import { Article } from './mockData';

const ARTICLES_KEY = 'techpulse_custom_articles';

export function getCustomArticles(): Article[] {
  try {
    const data = localStorage.getItem(ARTICLES_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function saveCustomArticles(articles: Article[]): void {
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
}

export function addCustomArticle(article: Article): void {
  const articles = getCustomArticles();
  articles.unshift(article);
  saveCustomArticles(articles);
}

export function updateCustomArticle(id: string, updated: Article): void {
  const articles = getCustomArticles();
  const idx = articles.findIndex(a => a.id === id);
  if (idx !== -1) { articles[idx] = updated; saveCustomArticles(articles); }
}

export function deleteCustomArticle(id: string): void {
  saveCustomArticles(getCustomArticles().filter(a => a.id !== id));
}

export function exportData(): string {
  return JSON.stringify({ articles: getCustomArticles() }, null, 2);
}

export function importData(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.articles) { saveCustomArticles(data.articles); return true; }
    return false;
  } catch { return false; }
}