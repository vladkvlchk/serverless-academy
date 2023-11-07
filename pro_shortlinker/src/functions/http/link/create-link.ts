import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import linkService from "../../../services/link-service";
import tokenService from "../../../services/token-service";
import { checkActiveTime, checkLink } from "../../../validation/index";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);
    const email = tokenService.getEmailFromBearer(
      event.headers["Authorization"]
    );

    const { link, active_time } = body;

    //validation
    checkActiveTime(active_time);
    checkLink(link);

    const response = await linkService.addLink(link, active_time, email);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
