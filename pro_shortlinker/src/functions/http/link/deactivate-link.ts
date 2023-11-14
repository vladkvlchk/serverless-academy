import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import linkService from "../../../services/link-service";
import tokenService from "../../../services/token-service";
import CustomError from "../../../exceptions/custom-error";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);
    const email = tokenService.getEmailFromBearer(
      event.headers["Authorization"]
    );

    const { link_id } = body;
    if(!link_id){
      CustomError.throwError(400, "Bad Request")
    }

    await linkService.deactivate(link_id, email);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Link successfully deactivated" }),
    };
  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
