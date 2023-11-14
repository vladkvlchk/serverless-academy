// import { SQSEvent } from "aws-lambda";
// import { ses } from "../aws";

// export const handler = async (event: SQSEvent) => {
//   try {
//     const messages_arr = event.Records.map((record) => JSON.parse(record.body));

//     console.log(messages_arr.length, messages_arr);

//     const messages_map = new Map();
//     messages_arr.forEach((message) => {
//       if (messages_map.get(message.owner_email)) {
//         messages_map.set(message.owner_email, [
//           ...messages_map.get(message.owner_email),
//           { ...message },
//         ]);
//       } else {
//         messages_map.set(message.owner_email, [{ ...message }]);
//       }
//     });

//     const promises = [];
//     const send_email = async (email, links) => {
//       const params = {
//         Destination: {
//           ToAddresses: [email],
//         },
//         Message: {
//           Body: {
//             Text: {
//               Data: links
//                 .map((link) => `Your link ${link.short_link} was deactivated`)
//                 .join("\n"),
//             },
//           },
//           Subject: {
//             Data: "Pro-shortlinker notifications",
//           },
//         },
//         Source: process.env.SENDER_EMAIL,
//       };
//       const res = await ses.sendEmail(params).promise();
//       console.log(res);
//     };

//     messages_map.forEach((value, key) => {
//       promises.push(send_email(key, value));
//     });

//     await Promise.all(promises);
//   } catch (err) {
//     console.error(err.message);
//   }
// };
