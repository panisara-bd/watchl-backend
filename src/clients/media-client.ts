const headers = {
  'X-RapidAPI-Key': process.env.RAPIDAPI_API_KEY,
  'X-RapidAPI-Host': 'imdb8.p.rapidapi.com',
};

type SearchResult = {
  results: Array<{
    id: string;
    image: {
      height: number;
      url: string;
      width: number;
    };
    title: string;
    titleType: 'movie' | 'tvSeries';
    year: 2011;
  }>;
};

export const searchMedia = async (query: string) => {
  const options = {
    method: 'GET',
    headers,
  };
  const url = `https://imdb8.p.rapidapi.com/title/v2/find?title=${encodeURI(
    query
  )}&titleType=movie,tvSeries`;
  const response = await fetch(url, options);

  if (response.ok) {
    const clientResults: SearchResult = await response.json();
    const result = clientResults.results.map((clientResult) => ({
      id: clientResult.id.split('/').slice(-2, -1),
      image: clientResult.image
        ? {
            height: clientResult.image?.height,
            url: clientResult.image?.url,
            width: clientResult.image?.width,
          }
        : undefined,
      title: clientResult.title,
      titleType: clientResult.titleType,
      year: clientResult.year,
    }));
    return result;
  } else {
    return [];
  }
};

type MediaResult = {
  title: {
    image: {
      height: number;
      url: string;
      width: number;
    };
    runningTimeInMinutes: number;
    numberOfEpisodes: number;
    title: string;
    titleType: string;
    year: number;
  };
  ratings: {
    rating: number;
  };
  genres: string[];
  plotSummary: {
    text: string;
  };
};

export const fetchMediaById = async (id: string) => {
  const options = {
    method: 'GET',
    headers,
  };
  const url = `https://imdb8.p.rapidapi.com/title/get-overview-details?tconst=${id}`;
  const response = await fetch(url, options);

  if (response.ok) {
    const clientResult: MediaResult = await response.json();
    const result = {
      id: id,
      image: {
        height: clientResult.title.image.height,
        url: clientResult.title.image.url,
        width: clientResult.title.image.width,
      },
      runningTimeInMinutes: clientResult.title.runningTimeInMinutes,
      numberOfEpisodes: clientResult.title.numberOfEpisodes,
      title: clientResult.title.title,
      titleType: clientResult.title.titleType,
      year: clientResult.title.year,
      rating: clientResult.ratings?.rating,
      genres: clientResult.genres,
      summary: clientResult.plotSummary?.text,
    };
    return result;
  } else {
    return null;
  }
};
