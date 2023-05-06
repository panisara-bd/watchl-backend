import { APIGatewayProxyHandler } from 'aws-lambda';
import { searchMedia } from '../clients/media-client';
import { withErrorHandler } from '../helpers/error-handler';
import { verifyAuth } from '../helpers/verify-auth';

export const handler: APIGatewayProxyHandler = withErrorHandler(
  async (event) => {
    await verifyAuth(event);
    const { query } = event.queryStringParameters;
    const clientResults = await searchMedia(query);
    const results = clientResults.d.map((clientResult) => ({
      id: clientResult.id,
      image: clientResult.i
        ? {
            height: clientResult.i.height,
            url: clientResult.i.imageUrl,
            width: clientResult.i.width,
          }
        : undefined,
      title: clientResult.l,
      titleType: clientResult.q,
      year: clientResult.y,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  }
);
