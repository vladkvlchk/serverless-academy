import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import linkService from "../../../services/link-service";
import tokenService from "../../../services/token-service";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const email = tokenService.getEmailFromBearer(event.headers["Authorization"])

    const response = await linkService.getLinksByEmail(email);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({ message : error.message }),
    };
  }
};
