import * as bcryptjs from "bcryptjs";

import { dynamodb } from "../aws";
import { TokensType } from "../types";
import tokenService from "./token-service";
import CustomError from "../exceptions/custom-error";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

class UserService {
  async registration(email: string, password: string): Promise<TokensType> {

    //checking if the user already exists
    const data = await dynamodb.send(new GetCommand({
      TableName: 'Users',
      Key: {
        email,
      },
    }));
    if (data.Item) {
        CustomError.throwError(409, "User already exists");
    }

    //adding new user
    const hashedPassword = await bcryptjs.hash(password, 10);

    const params = {
      TableName: "Users",
      Item: {
        email,
        password: hashedPassword,
        link_ids: []
      },
    };

    await dynamodb.send(new PutCommand(params));

    const { accessToken, refreshToken } = tokenService.generateTokens({
      email,
    });

    return { accessToken, refreshToken };
  }

  async logIn(email: string, password: string): Promise<TokensType> {
    const data = await dynamodb.send(new GetCommand({
      TableName: "Users",
      Key: {
        email
      }
    }))

    //checking if the user exist
    if (!data.Item) {
      CustomError.throwError(401, "Incorrect email or password");
    }

    //checking if the password is correct
    const isPassEquals = await bcryptjs.compare(password, data.Item.password);
    if (!isPassEquals) {
      CustomError.throwError(401, "Incorrect email or password");
    }

    //generating tokens
    const { accessToken, refreshToken } = tokenService.generateTokens({
      email,
    });

    return { accessToken, refreshToken };
  }
}

export default new UserService();
