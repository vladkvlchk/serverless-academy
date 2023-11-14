// import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
// import linkService from "../../services/link-service";

// export const handler = async (
//   event: APIGatewayProxyEvent
// ): Promise<APIGatewayProxyResult> => {
//   try {
//     const id = event.pathParameters?.id;

//     if (!id) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: "Missing id parameter" }),
//       };
//     }

//     const original_link = await linkService.getLinkById(id);

//     return {
//       statusCode: 302,
//       headers: {
//         Location: original_link,
//       },
//       body: "",
//     };
//   } catch (error) {
//     return {
//       statusCode: error.status || 500,
//       body: JSON.stringify({message: error.message})
//     }
//   }
// };
