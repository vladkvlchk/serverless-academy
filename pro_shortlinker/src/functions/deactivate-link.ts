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

    const { link_id } = body;

    await linkService.removeLink(link_id, email);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Link successfully deactivated"}),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
