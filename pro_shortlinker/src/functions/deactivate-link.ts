import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import linkService from "../services/link-service";
import checkDate from "../validation/date";
import checkLink from "../validation/link";
import tokenService from "../services/token-service";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);
    const bearerHeader = event.headers["Authorization"];
    if(!bearerHeader){
        throw new Error("Bearer token is not found")
    }
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    //@ts-ignore
    const payload : { email: string } = tokenService.verifyAccessToken(bearerToken);
    if(!payload || !payload.email){
        throw new Error("Token error")
    }
    const owner_email = payload.email;

    const { link_id } = body;

    await linkService.removeLink(link_id, owner_email);

    return {
      statusCode: 200,
      body: JSON.stringify("Link successfully deactivated"),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
