import { APIGatewayProxyHandler } from 'aws-lambda';
import { fetchMediaById } from '../clients/media-client';
import { verifyAuth } from '../helpers/verify-auth';
import { withErrorHandler } from '../helpers/error-handler';

export const handler: APIGatewayProxyHandler = withErrorHandler(
  async (event) => {
    await verifyAuth(event);
    const { mediaId } = event.pathParameters;
    const result = await fetchMediaById(mediaId);
    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify(null),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  }
);
