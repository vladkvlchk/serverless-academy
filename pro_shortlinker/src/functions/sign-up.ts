import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';
import * as bcryptjs from 'bcryptjs';
import * as AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    const hashedPassword = await bcryptjs.hash(password, 10);

    const params = {
      TableName: 'Users',
      Item: {
        email,
        password: hashedPassword,
      },
    };

    await dynamodb.put(params).promise();

    const accessToken = 0//jwt.sign({ email }, process.env.ACCESS_KEY, { expiresIn: '1h' });
    const refreshToken = 0//jwt.sign({ email }, process.env.REFRESH_KEY, { expiresIn: '30d' });

    return {
      statusCode: 200,
      body: JSON.stringify({ accessToken, refreshToken }), //REMOVE PASSWORD!!!
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }), 
    };
  }
};
