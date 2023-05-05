import { APIGatewayProxyHandler } from 'aws-lambda';
import { fetchMediaById } from '../clients/media-client';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { mediaId } = event.pathParameters;
  const result = await fetchMediaById(mediaId);
  if (!result) {
    return {
      statusCode: 404,
      body: JSON.stringify(null),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
