import { dynamodb } from "../aws";
import CustomError from "../exceptions/custom-error";
import { BatchExecuteStatementCommand, BatchGetCommand, GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

class LinkService {
  async create(
    original_link: string,
    active_time: string,
    owner_email: string
  ) {
    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; //length - 62 ( sorted by chars.split('').sort().join(''); )
    let id = ""; //this will be short path

    const data = await dynamodb.send(
      new GetCommand({
        TableName: "AppValues",
        Key: { key: "last_created_link_id" },
      })
    );

    const last_link_id = data.Item ? data.Item.value : "";

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

    //calculation expiration time
    let expiration_time: number | string = Date.now();
    if (active_time === "1 day") {
      expiration_time += 1000 * 60 * 60 * 24;
    } else if (active_time === "3 days") {
      expiration_time += 1000 * 60 * 60 * 24 * 3;
    } else if (active_time === "5 days") {
      expiration_time += 1000 * 60 * 60 * 24 * 5;
    } else if (active_time === "one-time") {
      expiration_time = "one-time";
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
        is_active: true,
      },
    };

    await dynamodb.send(new PutCommand(params));
    if (data.Item) {
      await dynamodb.send(
        new UpdateCommand({
          TableName: "AppValues",
          Key: {
            key: "last_created_link_id",
          },
          UpdateExpression: "SET #attrName = :new_link_id",
          ExpressionAttributeNames: {
            "#attrName": "value",
          },
          ExpressionAttributeValues: {
            ":new_link_id": id,
          },
        })
      );
    } else {
      await dynamodb.send(
        new PutCommand({
          TableName: "AppValues",
          Item: {
            key: "last_created_link_id",
            value: id,
          },
        })
      );
    }

    const data2 = await dynamodb.send(new GetCommand({
      TableName: "Users",
      Key:{
        email: owner_email
      }
    }))

    await dynamodb.send(new UpdateCommand({
      TableName: "Users",
      Key: {
        email: owner_email
      },
      UpdateExpression: "SET #attrName = :new_value",
      ExpressionAttributeNames: {
        "#attrName": "link_ids",
      },
      ExpressionAttributeValues: {
        ":new_value": [...data2.Item.link_ids, id],
      },
    }))

    //HERE I HAVE TO SET SCHEDULE FOR DEACTIVATION

    return params.Item;
  }

  async deactivate(id: string, owner_email: string): Promise<void> {
    //checking if the user owns the link
    const data = await dynamodb.send(
      new GetCommand({
        TableName: "Links",
        Key: {
          id
        },
      })
    );
    if (!data.Item) {
      CustomError.throwError(404, "Not found");
    }

    //deactivation
    await dynamodb.send(
      new UpdateCommand({
        TableName: "Links",
        Key: {
          id
        },
        UpdateExpression: "SET #attrName = :new_value",
        ExpressionAttributeNames: {
          "#attrName": "is_active",
        },
        ExpressionAttributeValues: {
          ":new_value": false,
        },
      })
    );
  }

  async getAllByEmail(email: string) {
    //getting user
    const data1 = await dynamodb.send(new GetCommand({
      TableName: "Users",
      Key: {
        email
      }
    }))
    if(!data1.Item){
      return []
    }

    //getting user links
    const data4 = await dynamodb.send(new BatchGetCommand({
      RequestItems: {
        Links: {
          Keys: data1.Item.link_ids.map((id: string) => ({id}))
        }
      }
    }))

    return data4.Responses['Links'];
  }

  async getLinkById(id: string) {
    // const data = await dynamodb.scan({ TableName: "Links" }).promise();
    // const link = data.Items.find((item) => item.id === id);
    // if (!link) {
    //   CustomError.throwError(404, "Not found");
    // }

    // if (link.expiration_time === "one-time") {
    //   await this.deactivate(link.id, link.owner_email);
      // await sqs
      //   .sendMessageBatch({
      //     Entries: [
      //       {
      //         Id: link.id,
      //         MessageBody: JSON.stringify(link),
      //       },
      //     ],
      //     QueueUrl: `${process.env.SQS_URL}/notifications`,
      //   })
      //   .promise();
    // }

    // return link.original_link;
  }
}

export default new LinkService();
