import { SQSEvent } from "aws-lambda";
import { ses } from "../aws";

export const handler = async (event: SQSEvent) => {
  try {
    const messages_arr = event.Records.map((record) => JSON.parse(record.body));

    console.log(messages_arr.length, messages_arr);

    const messages_map = new Map();
    await messages_arr.forEach((message) => {
      //@ts-ignore
      if (messages_map.get(message.owner_email)) {
        messages_map.set(message.owner_email, [
          ...messages_map.get(message.owner_email),
          { ...message },
        ]);
      } else {
        messages_map.set(message.owner_email, [{ ...message }]);
      }
    });

    console.log(messages_map);

    for (let arr in messages_map.values()) {
      console.log(arr);
      const params = {
        Destination: {
          ToAddresses: ["5710233@stud.nau.edu.ua"], //owner_email
        },
        Message: {
          Body: {
            Text: {
              Data: arr
              //@ts-ignore
                .map((link) => `Your link ${link.short_link} was deactivated`)
                .join("\n"),
            },
          },
          Subject: {
            Data: "Pro-shortlinker notifications",
          },
        },
        Source: process.env.SENDER_EMAIL,
      };

      await ses.sendEmail(params).promise();
    }

    const params = {
      Destination: {
        ToAddresses: ["5710233@stud.nau.edu.ua"], //owner_email
      },
      Message: {
        Body: {
          Text: {
            //@ts-ignore
            Data: "Notifications were sended",
          },
        },
        Subject: {
          Data: "Pro-shortlinker notifications",
        },
      },
      Source: process.env.SENDER_EMAIL,
    };

    const res = await ses.sendEmail(params).promise();

    console.log(res);
  } catch (err) {
    console.error(err.message);
  }
};
