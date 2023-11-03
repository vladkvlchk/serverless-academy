import * as bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";

import dynamodb from "../db";
import { TokensType } from "../types";
import tokenService from "./token-service";

class UserService {
  async registration(email: string, password: string): Promise<TokensType> {
    //checking if the user already exists
    await dynamodb.get(
      {
        TableName: "Users",
        Key: {
          email,
        },
      },
      (err, data) => {
        if (err) throw new Error("DB error: cannot read the table");

        if (data.Item) {
          throw new Error("User with this email is already registered");
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

  async logIn(email: string, password: string)
//   : Promise<TokensType> 
  {
    //get user with the email
    //check if the user exist
    //check if the password is correct
    const data = await dynamodb.get({
      TableName: "Users",
      Key: {
        email,
      },
    }).promise();

    if(!data.Item){
        throw new Error("User isn\'t found")   
    }

    const isPassEquals = await bcryptjs.compare(password, data.Item.password);
    if (!isPassEquals) throw new Error("Incorrect password");

    const { accessToken, refreshToken } = tokenService.generateTokens({ email });

    return { accessToken, refreshToken };
  }
}

export default new UserService();
