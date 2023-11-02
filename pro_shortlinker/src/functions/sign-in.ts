import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import AWS = require("aws-sdk");
// const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    // const accessToken = jwt.sign({ email }, process.env.ACCESS_KEY, {
    //   expiresIn: "1h",
    // });
    // const refreshToken = jwt.sign({ email }, process.env.RESRESH_KEY, {
    //   expiresIn: "30d",
    // });
    return {
      statusCode: 200,
      body: JSON.stringify({
       message: "hello from sign-in function"
      }),
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        access_key: process.env.ACCESS_KEY,
        refresh_key: process.env.REFRESH_KEY,
        bcrypt_secret: process.env.BCRYPT_SECRET,
        email,
        password
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
