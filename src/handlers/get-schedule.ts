import { APIGatewayProxyHandler } from 'aws-lambda';
import { getSchedule } from '../clients/dynamo-db-client';
import { verifyToken } from '../clients/cognito-verify-client';

export const handler: APIGatewayProxyHandler = async (event) => {
  const authorizationHeader =
    event.headers.authorization || event.headers.Authorization;
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
    console.warn('Token is not valid')
    return {
      statusCode: 401,
      body: JSON.stringify(null),
    };
  }

  const schedule = await getSchedule(user.sub);
  console.log('Fetched schedule for ' + user.sub);

  return {
    statusCode: 200,
    body: JSON.stringify(schedule.Items),
  };
};
