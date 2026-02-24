# News Aggregation App - Setup Guide

## ✅ Current Status
All API keys are configured in the `.env` file in the project root directory.

## 📋 Environment Variables

The following API keys have been set up in `.env`:

```env
VITE_NEWS_PROVIDER=thenewsapi
VITE_THENEWSAPI_KEY=VB0GD6o7HN1ywufaG4p5szmSq2GpdB9m8Cx6rv5Y
VITE_NEWSDATA_KEY=pub_30533ebdf1cb42478bac5c4cf0d7212f
VITE_NEWSAPIORG_KEY=14dd514c3cf049cfbad64d28acfe3839
VITE_GNEWS_KEY=a709a700e2b5f2a91ae8faade689dfcb
VITE_DEFAULT_COUNTRY=in
VITE_DEFAULT_LANGUAGE=en
```

## 🔧 How It Works

### API Configuration
- **Provider Selection**: Set `VITE_NEWS_PROVIDER` to one of:
  - `thenewsapi` (default)
  - `newsdata`
  - `newsapiorg`
  - `gnews`

- **Key Loading**: Each provider uses its corresponding API key:
  - `VITE_THENEWSAPI_KEY` → TheNewsAPI
  - `VITE_NEWSDATA_KEY` → NewsData.io
  - `VITE_NEWSAPIORG_KEY` → NewsAPI.org
  - `VITE_GNEWS_KEY` → GNews

### Frontend Integration
1. Environment variables are loaded via Vite's `import.meta.env`
2. The API utility (`src/utils/api.js`) validates API keys on startup
3. Articles are fetched and normalized to a consistent format
4. Results are displayed in the article grid

## 🚀 Running the App

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5174`

## 📊 Debugging

The home page displays a debug info box showing:
- Current news provider
- Status of all loaded API keys
- Console logs for troubleshooting

Check browser console (F12) for detailed error messages.

## ✨ Features

- **Multiple Provider Support**: Switch between 4 different news APIs
- **Search Functionality**: Search news by keywords
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Error Handling**: Clear error messages if API keys are missing
- **Loading States**: Spinner while fetching news
- **Article Display**: Rich article cards with images, titles, descriptions

## 🐛 Troubleshooting

### "No articles found"
1. Check if the incorrect API key is being used
2. Verify the API is working by testing the URL directly
3. Check browser console for specific error messages

### "API key not loaded"
1. Restart the dev server after updating `.env`
2. Make sure `.env` is in the project root (not in `src/`)
3. Check that Vite environment variable syntax is correct (VITE_ prefix)

### CORS Issues
Some APIs may have CORS restrictions. The app handles this by:
- Using proper fetch headers
- Catching and reporting errors

## 📝 Notes

- All API keys are stored securely in `.env` (excluded from git)
- Environment variables are accessible via `import.meta.env.VITE_*` in React
- The app automatically normalizes data from different APIs to a consistent format
