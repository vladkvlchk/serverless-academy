import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    const hashedPassword = await bcrypt.hash(password, process.env.BCRYPT_SECRET);

    const params = {
      TableName: 'Users',
      Item: {
        Email: email,
        Password: hashedPassword,
      },
    };

    await dynamodb.put(params).promise();

    const accessToken = jwt.sign({ email }, process.env.ACCESS_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ email }, process.env.RESRESH_KEY, { expiresIn: '30d' });

    return {
      statusCode: 200,
      body: JSON.stringify({ accessToken, refreshToken, hashedPassword }), //REMOVE PASSWORD!!!
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
