// src/utils/api.js
export const fetchNews = async ({ category = '', search = '', limit = 9, country = null, provider = null }) => {
  const selectedProvider = provider || import.meta.env.VITE_NEWS_PROVIDER || 'thenewsapi';

  console.log(`[NewsAPI] Fetching from provider: ${selectedProvider}`);

  const apiKey = getApiKey(selectedProvider);
  if (!apiKey) {
    throw new Error(`Missing API key for provider: ${selectedProvider}. Check .env file.`);
  }

  const defaultCountry = country || import.meta.env.VITE_DEFAULT_COUNTRY || 'in';
  const defaultLanguage = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en';
  let url = '';

  try {
    switch (selectedProvider) {
      case 'thenewsapi':
        url = `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&locale=${defaultCountry}&limit=${limit}`;
        if (category) url += `&categories=${category}`;
        if (search) url = `https://api.thenewsapi.com/v1/news/all?api_token=${apiKey}&search=${encodeURIComponent(search)}&locale=${defaultCountry}&limit=${limit}`;
        break;

      case 'newsdata':
        url = `https://newsdata.io/api/1/news?apikey=${apiKey}&size=${limit}&country=${defaultCountry}`;
        if (category) url += `&category=${category}`;
        if (search) url += `&q=${encodeURIComponent(search)}`;
        break;

    

      case 'worldnewsapi':
        url = `https://api.worldnewsapi.com/search-news?api-key=${apiKey}&number=${limit}&language=${defaultLanguage}&source-countries=${defaultCountry}`;
        if (category) url += `&categories=${category}`;
        if (search) url += `&text=${encodeURIComponent(search)}`;
        break;
 case 'newsapiorg':
  if (search) {
    url = `https://newsapi.org/v2/everything?apiKey=${apiKey}&q=${encodeURIComponent(search)}&pageSize=${limit}`;
    // Optional: add &language=${defaultLanguage} or &sortBy=publishedAt
  } else {
    url = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&pageSize=${limit}&country=${defaultCountry}`;
    if (category) url += `&category=${category}`;
  }
  break;

      default:
        throw new Error(`Unsupported news provider: ${selectedProvider}`);
    }

    console.log(`[NewsAPI] Request URL (masked): ${url.replace(/apikey=[^&]+|api_token=[^&]+|apiKey=[^&]+/, 'API_KEY_MASKED')}`);

    const response = await fetch(url);

    console.log(`[NewsAPI] Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorMsg = getErrorMessage(response.status, selectedProvider);
      throw new Error(errorMsg);
    }

    const data = await response.json();

    let rawArticles = [];
switch (selectedProvider) {
  case 'thenewsapi':
    rawArticles = data.data || [];
    break;
  case 'newsdata':
    rawArticles = data.results || [];
    break;
  case 'newsapiorg':
    rawArticles = data.articles || [];
    break;
  case 'worldnewsapi':
    rawArticles = data.news || [];
    if (data.top_news && Array.isArray(data.top_news)) {
      data.top_news.forEach(group => {
        if (Array.isArray(group.news)) rawArticles.push(...group.news);
      });
    }
    break;
  default:
    rawArticles = [];

    }

    console.log(`[NewsAPI] Received ${rawArticles.length} articles from ${selectedProvider}`);

    return rawArticles.map(item => ({
      uuid: item.uuid || item.article_id || item.id || item.url || Math.random().toString(36).slice(2),
      title: item.title || item.headline || 'No title',
      description: item.description || item.summary || item.snippet || item.body || item.content || 'No description',
      url: item.url || item.link,
      image_url: item.image || item.image_url || item.urlToImage || item.thumbnail || null,
      published_at: item.publish_date || item.published_at || item.pubDate || item.publishedAt || item.date || null,
      source: item.source_country || item.source || item.source_id || (item.source?.name) || 'Unknown',
    }));
  } catch (err) {
    console.error(`[NewsAPI] Error from ${selectedProvider}:`, err.message);
    throw err;
  }
};

function getErrorMessage(status, provider) {
  const messages = {
    400: 'Bad request – invalid parameters',
    401: 'Unauthorized – invalid or missing API key',
    402: 'Payment required – quota exceeded or upgrade needed',
    403: 'Forbidden – access denied',
    404: 'Not found – endpoint or resource missing',
    429: 'Rate limit exceeded – wait and retry',
    500: 'Server error on ' + provider,
    503: 'Service temporarily unavailable',
  };
  return messages[status] || `Unknown error (${status}) from ${provider}`;
}

function getApiKey(provider) {
  const keyMap = {
    thenewsapi: import.meta.env.VITE_THENEWSAPI_KEY,
    newsdata: import.meta.env.VITE_NEWSDATA_KEY,
    worldnewsapi: import.meta.env.VITE_WORLDNEWSAPI_KEY,
   newsapiorg: import.meta.env.VITE_NEWSAPIORG_KEY,
  };
  return keyMap[provider];
}