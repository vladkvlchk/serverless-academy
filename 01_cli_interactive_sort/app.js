const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function theBestFunction() {
  rl.question( "Hello, enter 10 words or digits dividing them into spaces: ", (str) => {
    const words = [];
    const numbers = [];

    str.split(" ").forEach((element) => {
      if (isNaN(element)) { //cannot be converted in number type
        words.push(element);
      } else { //can be converted in number type
        numbers.push(+element);
      }
    });

    console.log("How would you like to sort values: \n 1. Sort words alphabetically. \n 2. Show numbers from lesser to greater. \n 3. Show numbers from bigger to smaller. \n 4. Display words in ascending order by number of letters in the word. \n 5. Show only unique words. \n 6. Display only unique values from the set of words and numbers entered by the user. \n 7. To exit the program, the user need to enter exit, otherwise the program will repeat itself again and again, asking for new data and suggesting sorting.\n");

    rl.question("Select (1 - 6) and press ENTER: ", (option) => {
      switch (option) {
        case "1": //alphabetically
          const alpha = words.sort((a, b) => {
            if (a.toLowerCase() < b.toLowerCase()) return -1;
            else return 1;
          });
          console.log(alpha);
          break;
        case "2": //numbers smaller -> bigger
          const from_smaller = numbers.sort((a, b) => {
            if (a < b) return -1;
            else return 1;
          });
          console.log(from_smaller);
          break;
        case "3": //numbers bigger -> smaller
          const from_bigger = numbers.sort((a, b) => {
            if (a > b) return -1;
            else return 1;
          });
          console.log(from_bigger);
          break;
        case "4": //words shorter -> longer
          const from_shorter = words.sort((a, b) => {
            if (a.length < b.length) return -1;
            else return 1;
          });
          console.log(from_shorter);
          break;
        case "5": //unique words
          const uniqueWords = [];
          words.forEach((word) => {
            if (!uniqueWords.includes(word)) uniqueWords.push(word);
          });
          console.log(uniqueWords);
          break;
        case "6": //unique words and numbers
          const uniqueValues = [];
          words.forEach((word) => {
            if (!uniqueValues.includes(word)) uniqueValues.push(word);
          });
          numbers.forEach(number => {
            if (!uniqueValues.includes(number)) uniqueValues.push(number);
          })
          console.log(uniqueValues);
          break;
        case "exit":
          console.log("\nGood bye! Come back again!\n");
          rl.close();
          return 0;
        default: //for case user wrote wrong command
          console.log(option," - What's wrong with you!? The use can select 1 - 6 only! (or 'exit' to exit)");
        }

      theBestFunction();
      });
    }
  );
}

theBestFunction();

/*
[+] 1 Sort words alphabetically
[+] 2 Show numbers from lesser to greater
[+] 3 Show numbers from bigger to smaller
[+] 4 Display words in ascending order by number of letters in the word
[+] 5 Show only unique words
[+] 6 Display only unique values from the set of words and numbers entered by the user
[+] 7 To exit the program, the user need to enter exit, otherwise the program will repeat itself again and again, asking for new data and suggesting sorting
*/
