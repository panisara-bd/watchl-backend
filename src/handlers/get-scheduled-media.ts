import { APIGatewayProxyHandler } from 'aws-lambda';
import { getScheduledMedia } from '../clients/dynamo-db-client';
import { verifyAuth } from '../helpers/verify-auth';
import { withErrorHandler } from '../helpers/error-handler';

export const handler: APIGatewayProxyHandler = withErrorHandler(
  async (event) => {
    const user = await verifyAuth(event);

    await getScheduledMedia({
      userId: user.sub,
      time: event.pathParameters.time,
    });

    return {
      statusCode: 204,
      body: JSON.stringify(null),
    };
  }
);
