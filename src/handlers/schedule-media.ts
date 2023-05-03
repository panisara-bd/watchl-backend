import { APIGatewayProxyHandler } from 'aws-lambda';
import { saveSchedule } from '../clients/dynamo-db-client';
import { verifyToken } from '../clients/cognito-verify-client';

export const handler: APIGatewayProxyHandler = async (event) => {
  const authorizationHeader = event.headers.authorization || event.headers.Authorization;
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

  await saveSchedule({ ...JSON.parse(event.body), userId: user.sub });
  return {
    statusCode: 201,
    body: JSON.stringify(null),
  };
};
