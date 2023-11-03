import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';
import * as bcryptjs from 'bcryptjs';
import checkEmail from '../validation/email';
import checkPassword from '../validation/password';
import userService from '../services/user-service';
// import * as AWS from 'aws-sdk';

// const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    //validation
    checkEmail(email);
    checkPassword(password);

    const { accessToken, refreshToken } = await userService.registration(email, password);

    return {
      statusCode: 200,
      body: JSON.stringify({ accessToken, refreshToken }), 
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }), 
    };
  }
};
