const useFetch = () => {
  const fetcher = async (url: string, options?: {}) => {
    let response;

    if (!options) {
      response = await fetch(url);
    } else {
      response = await fetch(url, options);
    }

    const data = await response.json();
    return data;
  };
  return { fetcher };
};

export default useFetch;