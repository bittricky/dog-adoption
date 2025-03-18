const API_URL = import.meta.env.VITE_FETCH_API_URL;

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response;
}

export async function login(credentials: { name: string; email: string }) {
  const response = await fetchWithAuth("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  return response.ok;
}

export async function logout() {
  const response = await fetchWithAuth("/auth/logout", {
    method: "POST",
  });
  return response.ok;
}

export async function searchDogs(params: {
  breeds?: string[];
  zipCodes?: string[];
  sort?: string;
  size?: number;
  from?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params.breeds?.length) {
    params.breeds.forEach((breed) => searchParams.append("breeds", breed));
  }
  if (params.zipCodes?.length) {
    params.zipCodes.forEach((zipCode) => searchParams.append("zipCodes", zipCode));
  }
  if (params.sort) searchParams.append("sort", params.sort);
  if (params.size) searchParams.append("size", params.size.toString());
  if (params.from) searchParams.append("from", params.from);

  const response = await fetchWithAuth(`/dogs/search?${searchParams}`);
  return response.json();
}

export async function getBreeds(): Promise<string[]> {
  const response = await fetchWithAuth("/dogs/breeds");
  return response.json();
}

export async function getDogs(ids: string[]) {
  const response = await fetchWithAuth("/dogs", {
    method: "POST",
    body: JSON.stringify(ids),
  });
  return response.json();
}

export async function getMatch(favoriteIds: string[]) {
  const response = await fetchWithAuth("/dogs/match", {
    method: "POST",
    body: JSON.stringify(favoriteIds),
  });
  return response.json();
}

export async function getLocationsByZipCodes(zipCodes: string[]) {
  const response = await fetchWithAuth("/locations", {
    method: "POST",
    body: JSON.stringify(zipCodes),
  });
  return response.json();
}
