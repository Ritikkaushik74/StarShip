const BASE_URL = 'https://swapi.dev/api';

export const getStarships = async (page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/starships/?page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to fetch starships');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const searchStarships = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return { results: [] };
    }
    const response = await fetch(`${BASE_URL}/starships/?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search starships');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
