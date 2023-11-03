import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import * as jwt from "jsonwebtoken";
import * as bcryptjs from "bcryptjs";
import * as jose from "node-jose";

import AWS = require("aws-sdk");
import userService from "../services/user-service";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    const data = await userService.logIn(email, password)

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
