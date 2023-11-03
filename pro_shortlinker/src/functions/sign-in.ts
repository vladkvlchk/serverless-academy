import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import * as jwt from "jsonwebtoken";
import * as bcryptjs from "bcryptjs";
import * as jose from "node-jose";

import AWS = require("aws-sdk");
// const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    let token;

    const privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAvMC00W5cBwLgXJ/j5tD6W2PLgES+NC9KhxjZMunDaQrY6UVI\n... ${process.env.PRIVATE_KEY} ...\n-----END RSA PRIVATE KEY-----`;
    const publicKeyPem = '-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAvMC00W5cBwLgXJ/j5tD6W2PLgES+NC9KhxjZMunDaQrY6UVI\n... 11nsdidi7d9nfnd23b ...\n-----END RSA PUBLIC KEY-----';


    await jose.JWK.asKey({
      kty: 'RSA',
      n: publicKeyPem, 
      d: privateKeyPem,
    }).then((key) => {
      return jose.JWE.createEncrypt({ format: 'compact' }, key)
        .update(JSON.stringify({ email }))
        .final();
    })
    .then((jweToken) => {
      token = jweToken;
    })
    .catch((error) => {
      throw new Error(error.message)
    });

    // const hashedPassword = await bcryptjs.hash(password, 10); // 10 rounds for hashing

    // const accessToken = jwt.sign({ email }, process.env.ACCESS_KEY, {
    //   expiresIn: "1h",
    // });
    // const refreshToken = jwt.sign({ email }, process.env.RESRESH_KEY, {
    //   expiresIn: "30d",
    // });
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({
    //    message: "hello from sign-in function"
    //   }),
    // };

    return {
      statusCode: 200,
      body: JSON.stringify({
        // access_key: process.env.ACCESS_KEY,
        // refresh_key: process.env.REFRESH_KEY,
        // bcrypt_secret: process.env.BCRYPT_SECRET,
        // email,
        // password
        token
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
