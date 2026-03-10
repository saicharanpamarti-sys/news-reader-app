import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserHistory } from '../hooks/useUserHistory';

const HistoryTracker = ({ children, article, category = 'general' }) => {
  const { userEmail } = useAuth();
  const { addOrUpdateHistory, updateTimeSpent } = useUserHistory(userEmail);
  const startTime = useRef(null);
  const entryId = useRef(null);

  // track when a specific article prop is passed (e.g. in ArticlePage)
  useEffect(() => {
    if (!article || !userEmail) return;

    entryId.current =
      article.id ||
      article.uuid ||
      article.url?.split('?')[0] ||  // normalize url without query
      `temp-${Date.now()}`;

    startTime.current = Date.now();

    // Initial add / update (title, desc, etc.)
    addOrUpdateHistory({
      id: entryId.current,
      title: article.title || 'Untitled',
      desc: article.description || article.snippet || '',
      category,
      source: article.source?.name || article.source || 'Unknown',
      externalUrl: null,
      viewedAt: Date.now(),
      published_at: article.published_at || article.publishedAt,
      image_url: article.image_url || article.urlToImage,
    });

    const handleBeforeUnload = () => {
      const msSpent = Date.now() - startTime.current;
      if (msSpent > 2000) { // ignore < 2 sec views
        updateTimeSpent(entryId.current, msSpent);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Also save when component unmounts (navigation)
    return () => {
      const msSpent = Date.now() - startTime.current;
      if (msSpent > 2000) {
        updateTimeSpent(entryId.current, msSpent);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [article, userEmail, category, addOrUpdateHistory, updateTimeSpent]);

  // listen for any history events globally and add to history
  useEffect(() => {
    const handleVisited = (e) => {
      const info = e.detail || {};
      if (!info) return;
      const id =
        info.id ||
        info.uuid ||
        info.url?.split('?')[0] ||
        `temp-${Date.now()}`;

      // add basic record (timeSpent later via other logic)
      addOrUpdateHistory({
        id,
        title: info.title || 'Untitled',
        desc: info.description || info.snippet || info.desc || '',
        category: category || info.category || 'general',
        source: info.source?.name || info.source || 'Unknown',
        externalUrl: info.externalUrl || info.url,
        viewedAt: Date.now(),
        published_at: info.published_at || info.publishedAt,
        image_url: info.image_url || info.urlToImage || null,
      });
    };

    window.addEventListener('articleVisited', handleVisited);
    return () => window.removeEventListener('articleVisited', handleVisited);
  }, [addOrUpdateHistory, category]);

  return <>{children}</>;
};

export default HistoryTracker;