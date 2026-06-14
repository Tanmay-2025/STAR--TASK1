export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}