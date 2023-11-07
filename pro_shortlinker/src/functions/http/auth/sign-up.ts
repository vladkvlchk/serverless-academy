import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import checkEmail from '../../../validation/email';
import checkPassword from '../../../validation/password';
import userService from '../../../services/user-service';

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
      statusCode: error.status || 500,
      body: JSON.stringify({ error: error.message }), 
    };
  }
};
