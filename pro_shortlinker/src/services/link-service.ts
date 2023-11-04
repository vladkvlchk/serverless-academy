import dynamodb from "../db";
import { LinkModelType } from "../types";

class LinkService {
  async addLink(
    original_link: string,
    expiration_time: string,
    owner_email: string
  ) {
    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; //length - 62 ( sorted by chars.split('').sort().join(''); )
    let id = ""; //this will be short path

    const data = await dynamodb.scan({ TableName: "Links" }).promise();

    const all_items = data.Items.sort((itemA, itemB) => {
      if (itemA.id.length > itemB.id.length) {
        return 1;
      }
      if (itemA.id.length < itemB.id.length) {
        return -1;
      } else {
        return itemA.id > itemB.id ? 1 : -1;
      }
    });

    const last_link_id = all_items.length
      ? all_items[all_items.length - 1].id
      : ""; //last booked link id

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
        expiration_time,
      },
    };
    await dynamodb.put(params).promise();

    return params.Item;
  }

  async removeLink(id: string, owner_email: string): Promise<void> {
    //checking if user own the link
    const data = await dynamodb.get({
        TableName: "Links",
        Key: {
            id,
            owner_email
        }
    }).promise();
    if (!data.Item) {
      throw new Error("Link is not found");
    }

    //deleting item
    await dynamodb
      .delete({
        TableName: "Links",
        Key: {
          id,
          owner_email
        },
      })
      .promise();
  }

  async getLinksByEmail(email: string) {
    const data = await dynamodb
      .scan({
        TableName: "Links",
        FilterExpression: "owner_email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
      .promise();
    
    return data.Items.map(item => ({
        id: item.id,
        original_link: item.original_link,
        expiration_time: item.expiration_time,
        short_link: item.short_link,
    }))
  }

  async getLinkById(id: string){
    const data = await dynamodb.scan({TableName: "Links"}).promise();
    const link = data.Items.find(item => item.id === id);
    if(!link){
        throw new Error("Link is not found")
    }
    return link.original_link
  }
}

export default new LinkService();
