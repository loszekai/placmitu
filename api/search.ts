import { SearchResponse } from '../types/search';

export async function getSearch(query: string): Promise<SearchResponse> {
  const res = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error('Request failed');
  
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error("Failed to parse search response");
  }
}
