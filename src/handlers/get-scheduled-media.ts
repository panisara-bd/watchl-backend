import { APIGatewayProxyHandler } from 'aws-lambda';
import { getScheduledMedia } from '../clients/dynamo-db-client';
import { verifyToken } from '../clients/cognito-verify-client';

export const handler: APIGatewayProxyHandler = async (event) => {
  const authorizationHeader =
    event.headers.authorization || event.headers.Authorization;
  if (!authorizationHeader) {
    return {
      statusCode: 401,
      body: JSON.stringify(null),
    };
  }

  const token = authorizationHeader.replace('Bearer ', '');
  const user = await verifyToken(token);
  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify(null),
    };
  }

  await getScheduledMedia({
    userId: user.sub,
    time: event.pathParameters.time,
  });

  return {
    statusCode: 204,
    body: JSON.stringify(null),
  };
};
