import { APIGatewayProxyHandler } from 'aws-lambda';
import { searchMedia } from '../clients/media-client';
import { withErrorHandler } from '../helpers/error-handler';
import { verifyAuth } from '../helpers/verify-auth';

export const handler: APIGatewayProxyHandler = withErrorHandler(
  async (event) => {
    await verifyAuth(event);
    
    if (!event.queryStringParameters || !event.queryStringParameters.query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing query parameter' }),
      };
    }
    
    const { query } = event.queryStringParameters;
    
    if (!query.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Query parameter cannot be empty' }),
      };
    }

    console.log(`Searching for media with query: "${query}"`);
    
    try {
      const results = await searchMedia(query);
      console.log(`Found ${results.length} results for query: "${query}"`);
      
      return {
        statusCode: 200,
        body: JSON.stringify(results),
      };
    } catch (error) {
      console.error('Search media error:', error);
      throw error;
    }
  }
);
