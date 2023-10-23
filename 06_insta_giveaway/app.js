const fs = require("fs");

const uniqueValues = () => {
  try {
    const unique_members = new Set();

    for (let i = 0; i < 20; i++) {
      const data = fs.readFileSync(`./db/out${i}.txt`, "utf-8");

      const values = data.split("\n");
      for (value of values) { // adding members that we've never met before
        if (!unique_members.has(value)) {
            unique_members.add(value);
        }
      }
    }

    return unique_members.size;
  } catch (e) {
    console.error(e);
  }
};

const existInAllFiles = () => {
  try {
    const members = new Set();

    const data = fs.readFileSync(`./db/out0.txt`, "utf-8");

    const values = data.split("\n"); 
    for (value of values) { // adding all unique values from first file
      if (!members.has(value)) {
        members.add(value);
      }
    }

    for (let i = 1; i < 20; i++) {
      const data = fs.readFileSync(`./db/out${i}.txt`, "utf-8");

      const file_values = data.split("\n");
      for (key in members) {
        // deleting keys that don't exist in current file
        if (!file_values.includes(key)) {
            members.delete(key);
        }
      }
    }

    return members.size;
  } catch (e) {
    console.error(e);
  }
};

const existInAtLeastTen = () => {
  try {
    const all_members = new Map();

    for (let i = 0; i < 20; i++) {
      const data = fs.readFileSync(`./db/out${i}.txt`, "utf-8");

      const keys = data.split("\n");
      for (key of keys) {
        // adding all members in one map, where values is set of indexes of files where we met them, key is username
        const count = all_members.get(key);
        if (!count) {
          all_members.set(key, new Set().add(i));
        } else {
          all_members.get(key).add(i);
        }
      }
    }

    let counter = 0;
    all_members.forEach((value) => {
      if (value.size > 9) counter++;
    });

    return counter;
  } catch (e) {
    console.error(e);
  }
};

function main() {
  console.log(uniqueValues(), " unique values"); // 129240
  console.log(existInAllFiles(), " exist in all files"); // 67148
  console.log(existInAtLeastTen(), " exist in at least ten"); //73245
}

main();
