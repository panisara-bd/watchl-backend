const headers = {
  'X-RapidAPI-Key': process.env.RAPIDAPI_API_KEY,
  'X-RapidAPI-Host': 'imdb8.p.rapidapi.com',
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

export const searchMedia = async (query: string, retryCount = 0): Promise<any[]> => {
  if (!process.env.RAPIDAPI_API_KEY) {
    throw new Error('RAPIDAPI_API_KEY environment variable is not set');
  }

  const options = {
    method: 'GET',
    headers,
  };
  const url = `https://imdb8.p.rapidapi.com/title/v2/find?title=${encodeURIComponent(
    query
  )}&titleType=movie,tvSeries`;
  
  console.log(`Making request to IMDB API (attempt ${retryCount + 1}): ${url}`);
  
  try {
    const response = await fetch(url, options);
    console.log(`IMDB API response status: ${response.status}`);

    if (response.ok) {
      const responseText = await response.text();
      console.log(`IMDB API response length: ${responseText.length} characters`);
      
      if (!responseText || responseText.trim() === '') {
        console.log('Empty response from IMDB API');
        return [];
      }
      
      let clientResults: SearchResult;
      try {
        clientResults = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse IMDB API response:', parseError);
        console.error('Response text:', responseText.substring(0, 500));
        throw new Error('Invalid JSON response from IMDB API');
      }
      
      if (!clientResults || !clientResults.results || !Array.isArray(clientResults.results)) {
        console.log('No results array found in API response');
        return [];
      }
      
      console.log(`IMDB API returned ${clientResults.results.length} results`);
      
      const result = clientResults.results.map((clientResult) => {
        if (!clientResult.id || !clientResult.title) {
          console.warn('Skipping invalid result:', clientResult);
          return null;
        }
        
        return {
          id: clientResult.id.split('/').slice(-2, -1)[0],
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
        };
      }).filter(result => result !== null); // Remove null results
      
      return result;
    } else {
      const errorText = await response.text();
      console.error('IMDB API error:', response.status, errorText);
      
      // Handle specific HTTP status codes with retry logic
      if (response.status === 429 && retryCount < 2) {
        console.log(`Rate limited, retrying after delay (attempt ${retryCount + 1})`);
        await delay(1000 * (retryCount + 1)); // Progressive delay
        return searchMedia(query, retryCount + 1);
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded for IMDB API');
      } else if (response.status === 403) {
        throw new Error('API key unauthorized or expired');
      } else if (response.status >= 500 && retryCount < 1) {
        console.log(`Server error, retrying after delay (attempt ${retryCount + 1})`);
        await delay(500);
        return searchMedia(query, retryCount + 1);
      } else if (response.status >= 500) {
        throw new Error('IMDB API server error');
      }
      
      throw new Error(`IMDB API error ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error('Error in searchMedia:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch') && retryCount < 1) {
      console.log(`Network error, retrying after delay (attempt ${retryCount + 1})`);
      await delay(500);
      return searchMedia(query, retryCount + 1);
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error connecting to IMDB API');
    }
    
    throw error;
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
