import { dynamodb, sqs } from "../aws";

export const handler = async () => {
  try {
    const currentTime = Date.now();

    const data = await dynamodb.scan({ TableName: "Links" }).promise();

    let expired_links = data.Items.filter(
      (item) =>
        item.expiration_time < currentTime &&
        item.expiration_time !== "one-time"
    );

    if (expired_links) {
      for (const item of expired_links) {
        //delete item
        const deleteParams = {
          TableName: "Links",
          Key: {
            id: item.id,
            owner_email: item.owner_email,
          },
        };
        await dynamodb.delete(deleteParams).promise();
      }

      //notifying user
      const batches_10 = [];
      while (expired_links.length) {
        batches_10.push(expired_links.slice(0, 10));
        expired_links = expired_links.slice(10);
      }

      console.log(JSON.stringify(batches_10))

      batches_10.forEach(async (links) => {
        console.log('process...', links)
        const Entries = links.map((item) => ({
          Id: item.id,
          MessageBody: JSON.stringify(item),
        }));

        console.log('Entries: ', Entries);

        await sqs
          .sendMessageBatch({
            Entries,
            QueueUrl: `${process.env.SQS_URL}/notifications`,
          })
          .promise();
        console.log('happy end!');
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "successfully deleted" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Item' deleting error: " + error.message,
      }),
    };
  }
};
