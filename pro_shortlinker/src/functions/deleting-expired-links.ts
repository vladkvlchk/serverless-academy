// import dynamodb from "../db";

// export const handler = async () => {
//   const currentTime = Date.now();

//   const params = {
//     TableName: "Links",
//     FilterExpression: "#expire_date < :currentTime",
//     ExpressionAttributeNames: {
//       "#expire_date": "expire_date",
//     },
//     ExpressionAttributeValues: {
//       ":currentTime": currentTime,
//     },
//   };

//   try {
//     const data = await dynamodb.scan(params).promise();

//     if (data.Items) {
//       for (const item of data.Items) {
//         const deleteParams = {
//           TableName: "Links",
//           Key: {
//             id: item.id, 
//           },
//         };
//         await dynamodb.delete(deleteParams).promise();
//       }
//     }
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: "successfully deleted" }),
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         error: "Item\' deleting error: " + error.message,
//       }),
//     };
//   }
// };
