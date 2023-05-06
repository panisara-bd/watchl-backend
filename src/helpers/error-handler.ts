import { APIGatewayProxyHandler } from 'aws-lambda';
import { AuthError } from './verify-auth';

export const withErrorHandler =
  (handler: APIGatewayProxyHandler): APIGatewayProxyHandler =>
  async (event, context) => {
    try {
      const response = await handler(event, context, undefined);
      if (response) {
        return response;
      }
    } catch (e) {
      if (e instanceof AuthError) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: e.message }),
        };
      }

      console.error('Unhandled error', e.message, e.stack);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Something went wrong' }),
      };
    }
  };
