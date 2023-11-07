import * as bcryptjs from "bcryptjs";

import { dynamodb } from "../aws";
import { TokensType } from "../types";
import tokenService from "./token-service";
import CustomError from "../exceptions/custom-error";

class UserService {
  async registration(email: string, password: string): Promise<TokensType> {
    //checking if the user already exists
    dynamodb.get(
      {
        TableName: "Users",
        Key: {
          email,
        },
      },
      (err, data) => {
        if (data.Item) {
          CustomError.throwError(409, "User already exists");
        }
      }
    );

    //adding new user
    const hashedPassword = await bcryptjs.hash(password, 10);

    const params = {
      TableName: "Users",
      Item: {
        email,
        password: hashedPassword,
      },
    };

    await dynamodb.put(params).promise();

    const { accessToken, refreshToken } = tokenService.generateTokens({
      email,
    });

    return { accessToken, refreshToken };
  }

  async logIn(email: string, password: string): Promise<TokensType> {
    //getting user with the email
    const data = await dynamodb
      .get({
        TableName: "Users",
        Key: {
          email,
        },
      })
      .promise();

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
