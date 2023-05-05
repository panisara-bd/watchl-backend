const headers = {
  'X-RapidAPI-Key': process.env.RAPIDAPI_API_KEY,
  'X-RapidAPI-Host': 'imdb8.p.rapidapi.com',
};

type SearchResult = {
  d: Array<{
    i: {
      height: number;
      imageUrl: string;
      width: number;
    };
    id: string;
    l: string;
    q: string;
    y: number;
  }>;
};

export const searchMedia = async (query: string): Promise<SearchResult> => {
  const options = {
    method: 'GET',
    headers,
  };
  const url = `https://imdb8.p.rapidapi.com/title/auto-complete?q=${encodeURI(
    query
  )}`;
  const response = await fetch(url, options);

  if (response.ok) {
    return response.json();
  } else {
    return { d: [] };
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
    nextEpisode: string;
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

export const fetchMediaById = async (
  id: string
) => {
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
    nextEpisode: clientResult.title.nextEpisode,
    numberOfEpisodes: clientResult.title.numberOfEpisodes,
    title: clientResult.title.title,
    titleType: clientResult.title.titleType,
    year: clientResult.title.year,
    rating: clientResult.ratings.rating,
    genres: clientResult.genres,
    summary: clientResult.plotSummary.text,
  };
  return result;
  } else {
    return null;
  }
};
