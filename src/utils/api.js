// src/utils/api.js
export const fetchNews = async ({ category = '', search = '', limit = 9, country = null, provider = null }) => {
  const selectedProvider = provider || import.meta.env.VITE_NEWS_PROVIDER || 'thenewsapi';
  
  console.log(`[API] Starting fetch from provider: ${selectedProvider}`);
  
  const apiKey = getApiKey(selectedProvider);
  if (!apiKey) {
    throw new Error(`Missing API key for provider: ${selectedProvider}`);
  }

  const defaultCountry = country || import.meta.env.VITE_DEFAULT_COUNTRY || 'in';
  let url = '';
  let responseData = null;

  try {
    switch (selectedProvider) {
      case 'thenewsapi':
        url = `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&locale=${defaultCountry}&limit=${limit}`;
        if (category) url += `&categories=${category}`;
        if (search) {
          url = `https://api.thenewsapi.com/v1/news/all?api_token=${apiKey}&search=${encodeURIComponent(search)}&locale=${defaultCountry}&limit=${limit}`;
        }
        break;

      case 'newsdata':
        url = `https://newsdata.io/api/1/news?apikey=${apiKey}&size=${limit}&country=${defaultCountry}`;
        if (category) url += `&category=${category}`;
        if (search) url += `&q=${encodeURIComponent(search)}`;
        break;

      case 'newsapiorg':
        url = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&pageSize=${limit}&country=${defaultCountry}`;
        if (category) url += `&category=${category}`;
        if (search) {
          url = `https://newsapi.org/v2/everything?apiKey=${apiKey}&q=${encodeURIComponent(search)}&pageSize=${limit}`;
        }
        break;

      case 'gnews':
        url = `https://gnews.io/api/v4/top-headlines?apikey=${apiKey}&lang=${import.meta.env.VITE_DEFAULT_LANGUAGE || 'en'}&max=${limit}`;
        if (category) url += `&topic=${category.toLowerCase()}`;
        if (search) {
          url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(search)}&lang=${import.meta.env.VITE_DEFAULT_LANGUAGE || 'en'}&max=${limit}&apikey=${apiKey}`;
        }
        break;

      default:
        throw new Error(`Unsupported news provider: ${selectedProvider}`);
    }

    console.log(`[API] Fetching from URL:`, url.substring(0, 100) + '...');
    const response = await fetch(url);
    
    console.log(`[API] Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorMessage = getErrorMessage(response.status, selectedProvider);
      console.error(`[${selectedProvider}] API Error - Status ${response.status}:`, errorMessage);
      throw new Error(errorMessage);
    }

    responseData = await response.json();
    console.log(`[API] Response received successfully from ${selectedProvider}`);

    // Normalize articles to consistent format
    let rawArticles = [];
    switch (selectedProvider) {
      case 'thenewsapi':  rawArticles = responseData.data || []; break;
      case 'newsdata':    rawArticles = responseData.results || []; break;
      case 'newsapiorg':  rawArticles = responseData.articles || []; break;
      case 'gnews':       rawArticles = responseData.articles || []; break;
    }

    console.log(`[API] Found ${rawArticles.length} articles from ${selectedProvider}`);

    return rawArticles.map(item => ({
      uuid: item.uuid || item.article_id || item.url || item.id || Math.random().toString(36).slice(2),
      title: item.title || 'Untitled',
      description: item.description || item.content || item.snippet || item.body || 'No description available',
      url: item.url || item.link,
      image_url: item.image_url || item.urlToImage || item.image || null,
      published_at: item.published_at || item.pubDate || item.publishedAt || item.date,
      source: item.source || item.source_id || (item.source?.name) || 'Unknown Source',
    }));
  } catch (err) {
    console.error(`[${selectedProvider}] Fatal error:`, err.message);
    console.error('Provider:', selectedProvider);
    console.error('API Key present:', !!apiKey);
    console.error('Error type:', err.name);
    console.error('Full error:', err);
    throw err;
  }
};

function getErrorMessage(statusCode, provider) {
  const errorMap = {
    400: '❌ Bad Request - Check your search parameters',
    401: '❌ Unauthorized - API key is invalid or expired. Check your .env file',
    402: '❌ Payment Required - API quota exceeded or subscription needed. Please try another provider or upgrade your plan',
    403: '❌ Forbidden - Access denied. Check API key permissions',
    404: '❌ Not Found - Article or endpoint not found',
    429: '❌ Too Many Requests - Rate limit exceeded. Wait a moment and try again',
    500: '❌ Server Error - The news API server is having issues',
    503: '❌ Service Unavailable - The news API is temporarily down',
  };

  return errorMap[statusCode] || `❌ API Error ${statusCode} - Failed to fetch news from ${provider}`;
}

function getApiKey(provider) {
  const keys = {
    thenewsapi: import.meta.env.VITE_THENEWSAPI_KEY,
    newsdata: import.meta.env.VITE_NEWSDATA_KEY,
    newsapiorg: import.meta.env.VITE_NEWSAPIORG_KEY,
    gnews: import.meta.env.VITE_GNEWS_KEY,
  };
  
  const key = keys[provider];
  console.log(`[API] Getting key for ${provider}:`, key ? '✅ Found' : '❌ NOT FOUND');
  return key;
}