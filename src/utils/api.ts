const API_URL = import.meta.env.VITE_FETCH_API_URL;


export class ApiError extends Error {
  status: number;
  endpoint: string;
  
  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.endpoint = endpoint;
  }
}


async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.statusText}`;
      
      // Try to parse error message from response if possible
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // If we can't parse JSON, just use the status text
      }
      
      throw new ApiError(errorMessage, response.status, endpoint);
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new ApiError(
        `Network error while accessing ${endpoint}: ${error.message}`,
        0,
        endpoint
      );
    }
    throw new ApiError(
      `Unknown error while accessing ${endpoint}`,
      0,
      endpoint
    );
  }
}


export async function login(credentials: { name: string; email: string }) {
  try {
    const response = await fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return response.ok;
  } catch (error) {
    console.error("Login error:", error);
    throw error instanceof ApiError 
      ? error 
      : new ApiError("Failed to login. Please check your credentials.", 0, "/auth/login");
  }
}


export async function logout() {
  try {
    const response = await fetchWithAuth("/auth/logout", {
      method: "POST",
    });
    return response.ok;
  } catch (error) {
    console.error("Logout error:", error);
    throw error instanceof ApiError 
      ? error 
      : new ApiError("Failed to logout. Please try again.", 0, "/auth/logout");
  }
}


export async function searchDogs(params: {
  breeds?: string[];
  zipCodes?: string[];
  sort?: string;
  size?: number;
  from?: string;
}) {
  try {
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

    const endpoint = `/dogs/search?${searchParams}`;
    const response = await fetchWithAuth(endpoint);
    return response.json();
  } catch (error) {
    console.error("Search dogs error:", error);
    throw error instanceof ApiError 
      ? error 
      : new ApiError("Failed to search for dogs. Please try again.", 0, "/dogs/search");
  }
}


export async function getBreeds(): Promise<string[]> {
  try {
    const response = await fetchWithAuth("/dogs/breeds");
    return response.json();
  } catch (error) {
    console.error("Get breeds error:", error);
    throw error instanceof ApiError 
      ? error 
      : new ApiError("Failed to fetch dog breeds. Please try again.", 0, "/dogs/breeds");
  }
}


export async function getDogs(ids: string[]) {
  if (!ids.length) {
    return [];
  }
  
  try {
    const response = await fetchWithAuth("/dogs", {
      method: "POST",
      body: JSON.stringify(ids),
    });
    return response.json();
  } catch (error) {
    console.error("Get dogs error:", error);
    throw error instanceof ApiError 
      ? error 
      : new ApiError("Failed to fetch dog details. Please try again.", 0, "/dogs");
  }
}


export async function getMatch(favoriteIds: string[]) {
  if (!favoriteIds.length) {
    throw new ApiError("Please select at least one favorite dog to generate a match", 400, "/dogs/match");
  }
  
  try {
    const response = await fetchWithAuth("/dogs/match", {
      method: "POST",
      body: JSON.stringify(favoriteIds),
    });
    return response.json();
  } catch (error) {
    console.error("Get match error:", error);
    throw error instanceof ApiError 
      ? error 
      : new ApiError("Failed to generate a match. Please try again.", 0, "/dogs/match");
  }
}


export async function getLocationsByZipCodes(zipCodes: string[]) {
  if (!zipCodes.length) {
    return [];
  }
  
  try {
    const response = await fetchWithAuth("/locations", {
      method: "POST",
      body: JSON.stringify(zipCodes),
    });
    return response.json();
  } catch (error) {
    console.error("Get locations error:", error);
    throw error instanceof ApiError 
      ? error 
      : new ApiError("Failed to validate ZIP codes. Please try again.", 0, "/locations");
  }
}
