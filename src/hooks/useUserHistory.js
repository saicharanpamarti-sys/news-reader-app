import { useState, useEffect, useCallback } from 'react';

export const useUserHistory = (userEmail) => {
  const [history, setHistory] = useState([]);
  const HISTORY_KEY = userEmail ? `news_history_${userEmail.trim().toLowerCase()}` : null;

  useEffect(() => {
    if (!HISTORY_KEY) {
      setHistory([]);
      return;
    }
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      setHistory(saved ? JSON.parse(saved) : []);
    } catch (err) {
      console.error("History parse error:", err);
      setHistory([]);
    }
  }, [HISTORY_KEY]);

  const addOrUpdateHistory = useCallback((newData) => {
    if (!HISTORY_KEY) return;

    setHistory(prev => {
      const existingIndex = prev.findIndex(item => item.id === newData.id);

      let updated;
      if (existingIndex >= 0) {
        // Update existing and move it to the front for recency
        const existing = prev[existingIndex];
        const merged = {
          ...existing,
          ...newData,
          viewedAt: newData.viewedAt || existing.viewedAt,
          timeSpent: (existing.timeSpent || 0) + (newData.timeSpent || 0),
        };
        // remove the old entry and unshift merged
        updated = [merged, ...prev.slice(0, existingIndex), ...prev.slice(existingIndex + 1)];
      } else {
        // Add new at front
        updated = [{ ...newData, timeSpent: newData.timeSpent || 0 }, ...prev];
      }

      // Keep max 50 items
      const trimmed = updated.slice(0, 50);

      // Save
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
      } catch (err) {
        console.error("History save error:", err);
      }

      return trimmed;
    });
  }, [HISTORY_KEY]);

  const updateTimeSpent = useCallback((id, additionalMs) => {
    if (!HISTORY_KEY || !additionalMs) return;

    setHistory(prev => {
      const updated = prev.map(item =>
        item.id === id
          ? { ...item, timeSpent: (item.timeSpent || 0) + additionalMs }
          : item
      );

      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {}

      return updated;
    });
  }, [HISTORY_KEY]);

  const clearHistory = useCallback(() => {
    if (!HISTORY_KEY) return;
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, [HISTORY_KEY]);

  return {
    history,
    addOrUpdateHistory,     // ← renamed & improved (replaces addToHistory)
    updateTimeSpent,
    clearHistory,
  };
};