// src/utils/historyUtils.js
const HISTORY_KEY_PREFIX = "news_history_"; // + email

export const getUserHistory = (email) => {
  if (!email) return [];
  const key = HISTORY_KEY_PREFIX + email.toLowerCase().trim();
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveToHistory = (email, newEntry) => {
  if (!email) return;
  const key = HISTORY_KEY_PREFIX + email.toLowerCase().trim();
  const history = getUserHistory(email);
  
  // Avoid duplicates (same article url)
  const exists = history.some(item => item.url === newEntry.url);
  if (exists) {
    // Update existing (e.g. add more time, update timestamp)
    const updated = history.map(item =>
      item.url === newEntry.url
        ? { ...item, timeSpent: (item.timeSpent || 0) + (newEntry.timeSpent || 0), lastRead: new Date().toISOString() }
        : item
    );
    localStorage.setItem(key, JSON.stringify(updated));
  } else {
    localStorage.setItem(key, JSON.stringify([...history, newEntry]));
  }
};

export const clearHistory = (email) => {
  if (!email) return;
  const key = HISTORY_KEY_PREFIX + email.toLowerCase().trim();
  localStorage.removeItem(key);
};