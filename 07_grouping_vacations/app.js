const json_api = require("./api-example.json");

function main() {
  const workers_map = new Map();

  json_api.forEach((obj) => {
    if (!workers_map.get(obj.user._id)) { //we've never met user before
      workers_map.set(obj.user._id, {
        userId: obj.user._id,
        userName: obj.user.name,
        vacations: [{ startDate: obj.startDate, endDate: obj.endDate }],
      });
    } else { //we've met user before
      workers_map.set(obj.user._id, {
        ...workers_map.get(obj.user._id),
        vacations: [
          ...workers_map.get(obj.user._id).vacations,
          { startDate: obj.startDate, endDate: obj.endDate },
        ],
      });
    }
  });

  const workers_arr = [];

  for ([id, worker] of workers_map) { // just transforming map into array format
    workers_arr.push(worker);
  }

  return workers_arr; //array in necessary format
}

main();
