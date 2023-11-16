import { dynamodb, sqs } from "../aws";

export const handler = async (event) => {
  try {
    console.log('event: ', event);
    console.log('id: ', event?.body?.id);
  } catch (error) {
    console.log(error.message)
  }
};
