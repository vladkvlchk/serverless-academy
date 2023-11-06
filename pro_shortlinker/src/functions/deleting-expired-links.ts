import { dynamodb } from "../aws";

export const handler = async () => {
  try {
    const currentTime = Date.now();

    const data = await dynamodb.scan({ TableName: "Links" }).promise();

    const expired_links = data.Items.filter(
        (item) => item.expiration_time < currentTime && item.expiration_time !== 'one-time'
    );

    if (expired_links) {
      for (const item of expired_links) {
        const deleteParams = {
          TableName: "Links",
          Key: {
            id: item.id,
            owner_email: item.owner_email,
          },
        };
        await dynamodb.delete(deleteParams).promise();
      }
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
