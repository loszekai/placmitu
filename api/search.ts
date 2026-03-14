export async function getSearch(query: string): Promise<any> {
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
  return res.text();
}
