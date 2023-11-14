import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import * as AWS from "aws-sdk";

const dynamodb = new DynamoDBClient({});
// const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = ''//new AWS.SQS();
const ses = ''//new AWS.SES();

export { 
    sqs, ses, 
    dynamodb };
