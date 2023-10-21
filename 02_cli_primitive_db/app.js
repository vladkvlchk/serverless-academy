import inquirer from "inquirer";
import * as fs from "fs";

async function addUser() {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the user's name (or press ENTER to stop adding users):",
    },
  ]);

  //catching stopping adding users
  if (!name) {
    const { confirmedSearch } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmedSearch",
        message: "Would you like to search values in DB?",
      },
    ]);
    if (confirmedSearch) {
      console.log(getDB());

      const { name } = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Enter user's name you wanna find in DB: ",
        },
      ]);

      const foundUser = getDB().find((user) => user.name === name);

      if (foundUser) {
        console.log(`User ${name} was found.`);
        console.log(foundUser);
      } else {
        console.log(
          `Unfortunately, user ${name} wasn\'t found. :( \n`
        );
      }
    }

    return;
  }

  const { gender, age } = await inquirer.prompt([
    {
      type: "list",
      name: "gender",
      message: "Choose the user's gender:",
      choices: ["male", "female"],
    },
    {
      type: "input",
      name: "age",
      message: "Enter the user's age:",
    },
  ]);

  putUserInDB({ name, gender, age });
  addUser();
}

function getDB() {
  const res = fs.readFileSync("db.txt", "utf-8");
  return JSON.parse(`[ ${res} ]`);
}

function putUserInDB({name, gender, age}) {
  fs.writeFile(
    "db.txt",
    `,\n{ "name": "${name}", "gender": "${gender}", "age": "${age}" }`,
    { flag: "a" },
    () => {}
  );
}

addUser();