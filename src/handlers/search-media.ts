import { APIGatewayProxyHandler } from 'aws-lambda';
import { searchMedia } from '../clients/media-client';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { query } = event.queryStringParameters;
  const clientResults = await searchMedia(query);
  const results = clientResults.d.map((clientResult) => ({
    id: clientResult.id,
    image: {
      height: clientResult.i.height,
      url: clientResult.i.imageUrl,
      width: clientResult.i.width,
    },
    title: clientResult.l,
    titleType: clientResult.q,
    year: clientResult.y,
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(results),
  };
};
