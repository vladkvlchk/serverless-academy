import * as AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();
const ses = new AWS.SES();

export { dynamodb, sqs, ses };
