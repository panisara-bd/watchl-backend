import { APIGatewayProxyHandler } from 'aws-lambda';
import { saveSchedule } from '../clients/dynamo-db-client';
import { verifyToken } from '../clients/cognito-verify-client';
import { fetchMediaById } from '../clients/media-client';

export const handler: APIGatewayProxyHandler = async (event) => {
  const authorizationHeader = event.headers.authorization || event.headers.Authorization;
  if (!authorizationHeader) {
    console.warn('No authorization header')
    return {
      statusCode: 401,
      body: JSON.stringify(null),
    };
  }
  
  const token = authorizationHeader.replace('Bearer ', '');
  const user = await verifyToken(token);
  if (!user) {
    console.warn('Invalid user')
    return {
      statusCode: 401,
      body: JSON.stringify(null),
    };
  }
  
  const requestBody = JSON.parse(event.body)
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
};
