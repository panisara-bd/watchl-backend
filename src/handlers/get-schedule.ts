import { APIGatewayProxyHandler } from 'aws-lambda';
import { getSchedule } from '../clients/dynamo-db-client';
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

  const schedule = await getSchedule(user.sub);

  return {
    statusCode: 200,
    body: JSON.stringify(schedule),
  };
};
