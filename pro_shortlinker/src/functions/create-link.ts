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
    const email = tokenService.getEmailFromBearer(event.headers["Authorization"])

    const { link, expiration_time } = body;

    //validation
    checkDate(expiration_time);
    checkLink(link);

    const response = await linkService.addLink(link, expiration_time, email);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
