import { APIGatewayProxyHandler } from 'aws-lambda';
import { searchMedia } from '../clients/media-client';
import { withErrorHandler } from '../helpers/error-handler';
import { verifyAuth } from '../helpers/verify-auth';

export const handler: APIGatewayProxyHandler = withErrorHandler(
  async (event) => {
    await verifyAuth(event);
    const { query } = event.queryStringParameters;
    const results = await searchMedia(query);

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  }
);
