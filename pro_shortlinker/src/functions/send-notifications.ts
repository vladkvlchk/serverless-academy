import { SQSEvent } from "aws-lambda";

export const handler = async (event: SQSEvent) => {
  const messages = event.Records.map((record) => record.body);

  console.log(messages);
};
