const axios = require("axios");
const list = require("./api-list");

const fetchIsDone = async (api) => {
  let attempts_left = 3;

  while (attempts_left > 0) {
    try {
      const { data } = await axios.get(api);
      return data.isDone;
    } catch (err) {
      attempts_left--;
    }
  }
};

async function main() {
    let true_count = 0;
    let false_count = 0;
    const promises = [];
  
    list.forEach((api) => {
      const promise = fetchIsDone(api)
        .then((isDone) => {
          if (isDone === undefined) {
            console.log(`[Fail] ${api}: The endpoint is unavailable`);
          } else if (!isDone) {
            false_count++;
            console.log(`[Success] ${api}: isDone - false`);
          } else if (isDone) {
            true_count++;
            console.log(`[Success] ${api}: isDone - true`);
          }
        });
  
      promises.push(promise);
    });
  
    await Promise.all(promises);
  
    console.log("\nFound True values: ", true_count);
    console.log("Found False values: ", false_count);
  }
  

main();
