import { APIGatewayProxyHandler } from 'aws-lambda';
import { getSchedule } from '../clients/dynamo-db-client';
import { verifyAuth } from '../helpers/verify-auth';
import { withErrorHandler } from '../helpers/error-handler';

export const handler: APIGatewayProxyHandler = withErrorHandler(
  async (event) => {
    const user = await verifyAuth(event);
    const schedule = await getSchedule(user.sub);

    return {
      statusCode: 200,
      body: JSON.stringify(schedule.Items),
    };
  }
);
