import { APIGatewayProxyHandler } from 'aws-lambda';
import { saveSchedule } from '../clients/dynamo-db-client';
import { verifyToken } from '../clients/cognito-verify-client';
import { fetchMediaById } from '../clients/media-client';
import { verifyAuth } from '../helpers/verify-auth';
import { withErrorHandler } from '../helpers/error-handler';

export const handler: APIGatewayProxyHandler = withErrorHandler(
  async (event) => {
    const user = await verifyAuth(event);
    
    const requestBody = JSON.parse(event.body);
    const media = await fetchMediaById(requestBody.mediaId);
    if (!media) {
      console.warn(`No media for ${requestBody.mediaId}`);
      return {
        statusCode: 404,
        body: JSON.stringify(null),
      };
    }

    await saveSchedule({ ...requestBody, media, userId: user.sub });
    return {
      statusCode: 201,
      body: JSON.stringify(null),
    };
  }
);
