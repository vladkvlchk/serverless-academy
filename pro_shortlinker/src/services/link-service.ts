import dynamodb from "../db";

class LinkService {
  async addLink(
    original_link: string,
    expiration_time: string,
    owner_email: string
  ) {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; //length - 62 ( sorted by chars.split('').sort().join(''); )
    let id = ""; //this will be short path

    const data = await dynamodb.scan({ TableName: "Links" }).promise();
    
    const all_items = data.Items.sort((itemA, itemB) => {
        if (itemA.id.length > itemB.id.length) {
          return 1
        } if (itemA.id.length < itemB.id.length) {
          return -1
        } else {
          return itemA.id > itemB.id ? 1 : -1
        }
        })

    const last_link_id = all_items.length ? all_items[all_items.length - 1].id : ""; //last booked link id

    let flag = false; // this flag we use to know if we need to keep changing next chars (false - we need | true - we don't need)
    id = last_link_id
      .split("")
      .reverse()
      .map((char) => {
        if (flag) return char;

        const n_i = chars.indexOf(char); //0-61
        if (n_i !== chars.length - 1) flag = true; // if index is not 61(max value)

        return chars[(n_i + 1) % chars.length];
      })
      .reverse()
      .join("");

    if (!flag) {
      // adding one char like we add figure when we get 10(2 figures) after 9(1 figure), or 100(3 figures) after 99(2 figures)
      id += chars[0];
    }

    //assembling data
    const short_link = process.env.HOST + "/" + id;
    const params = {
      TableName: "Links",
      Item: {
        id,
        original_link,
        short_link,
        owner_email,
        expiration_time
      },
    };
    await dynamodb.put(params).promise();

    return params.Item;
  }
}

export default new LinkService();
