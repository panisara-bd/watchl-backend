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
      
      if (e.message && e.message.includes('Rate limit exceeded')) {
        return {
          statusCode: 429,
          body: JSON.stringify({ 
            message: 'Rate limit exceeded', 
            error: 'Too many requests. Please try again later.' 
          }),
        };
      }
      
      if (e.message && e.message.includes('API key unauthorized')) {
        return {
          statusCode: 403,
          body: JSON.stringify({ 
            message: 'API key issue', 
            error: 'API key is unauthorized or expired' 
          }),
        };
      }
      
      if (e.message && e.message.includes('Network error')) {
        return {
          statusCode: 502,
          body: JSON.stringify({ 
            message: 'Network error', 
            error: 'Unable to connect to external API' 
          }),
        };
      }
      
      if (e.message && e.message.includes('IMDB API server error')) {
        return {
          statusCode: 502,
          body: JSON.stringify({ 
            message: 'External API error', 
            error: 'The movie database is temporarily unavailable' 
          }),
        };
      }
      
      if (e.message && e.message.includes('Invalid JSON response')) {
        return {
          statusCode: 502,
          body: JSON.stringify({ 
            message: 'Data format error', 
            error: 'Received invalid response from movie database' 
          }),
        };
      }
      
      if (e.message && e.message.includes('IMDB API error')) {
        return {
          statusCode: 502,
          body: JSON.stringify({ 
            message: 'External API error', 
            error: e.message 
          }),
        };
      }
      
      if (e.message && e.message.includes('environment variable')) {
        return {
          statusCode: 500,
          body: JSON.stringify({ 
            message: 'Configuration error', 
            error: 'Required API key not configured' 
          }),
        };
      }

      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' }),
      };
    }
  };
