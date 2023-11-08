import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import {checkEmail, checkPassword} from '../../../validation/';
import userService from '../../../services/user-service';
import CustomError from '../../../exceptions/custom-error';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;
    if(!email || !password){
      CustomError.throwError(400, "Bad Request")
    }

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
      body: JSON.stringify({ message: error.message }), 
    };
  }
};
