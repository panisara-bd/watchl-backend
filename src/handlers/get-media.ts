import { APIGatewayProxyHandler } from 'aws-lambda';
import { fetchMediaById } from '../clients/media-client';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { mediaId } = event.pathParameters;
  const clientResult = await fetchMediaById(mediaId);
  if (!clientResult) {
    return {
      statusCode: 404,
      body: JSON.stringify(null),
    };
  }

  const result = {
    id: mediaId,
    image: {
      height: clientResult.title.image.height,
      url: clientResult.title.image.url,
      width: clientResult.title.image.width,
    },
    runningTimeInMinutes: clientResult.title.runningTimeInMinutes,
    nextEpisode: clientResult.title.nextEpisode,
    numberOfEpisodes: clientResult.title.numberOfEpisodes,
    title: clientResult.title.title,
    titleType: clientResult.title.titleType,
    year: clientResult.title.year,
    rating: clientResult.ratings.rating,
    genres: clientResult.genres,
    summary: clientResult.plotSummary.text,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
