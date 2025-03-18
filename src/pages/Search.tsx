import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LogOut,
  Search as SearchIcon,
  MapPin,
  AlertTriangle,
  PawPrint,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  Select,
  Dog as DogCard,
  Button,
  Input,
  Modal,
  MatchedDog,
  Spinner,
  ErrorMessage,
  Skeleton,
} from "../components";
import {
  getBreeds,
  getDogs,
  getMatch,
  logout,
  searchDogs,
  getLocationsByZipCodes,
} from "../utils/api";
import { type Dog, type Location } from "../global.d";

const DOGS_PER_PAGE = 20;

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    breeds: [] as string[],
    zipCodes: [] as string[],
    sort: "breed:asc",
    from: "",
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [isValidatingZip, setIsValidatingZip] = useState<boolean>(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState<boolean>(false);
  const [isGeneratingMatch, setIsGeneratingMatch] = useState<boolean>(false);

  const {
    data: breeds,
    isLoading: isLoadingBreeds,
    error: breedsError,
    refetch: refetchBreeds,
  } = useQuery({
    queryKey: ["breeds"],
    queryFn: getBreeds,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
    refetch: refetchSearch,
  } = useQuery({
    queryKey: ["dogs", searchParams],
    queryFn: async () => {
      try {
        const { resultIds, next, prev } = await searchDogs({
          ...searchParams,
          size: DOGS_PER_PAGE,
        });

        if (!resultIds.length) {
          return { dogs: [], next, prev };
        }

        const dogs = await getDogs(resultIds);
        return { dogs, next, prev };
      } catch (error) {
        console.error("Error fetching search results:", error);
        throw new Error("Failed to fetch search results. Please try again.");
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleAddBreed = () => {
    if (selectedBreed && !searchParams.breeds.includes(selectedBreed)) {
      setSearchParams((prev) => ({
        ...prev,
        breeds: [...prev.breeds, selectedBreed],
      }));
      setSelectedBreed("");
    }
  };

  const handleAddZipCode = async () => {
    if (
      !zipCode ||
      searchParams.zipCodes.includes(zipCode) ||
      zipCode.length !== 5
    ) {
      if (zipCode && zipCode.length !== 5) {
        toast.error("ZIP code must be 5 digits");
      }
      return;
    }

    setIsValidatingZip(true);
    try {
      const locationData = await getLocationsByZipCodes([zipCode]);

      if (locationData && locationData.length > 0) {
        setSearchParams((prev) => ({
          ...prev,
          zipCodes: [...prev.zipCodes, zipCode],
        }));
        setLocations((prev) => [...prev, ...locationData]);
        setZipCode("");
        toast.success(
          `Added ${locationData[0].city}, ${locationData[0].state} to your search`
        );
      } else {
        toast.error("Invalid ZIP code. Please enter a valid US ZIP code.");
      }
    } catch (error: unknown) {
      console.error("ZIP code validation error:", error);
      toast.error(
        "Failed to validate ZIP code. Please check your connection and try again."
      );
    } finally {
      setIsValidatingZip(false);
    }
  };

  const handleRemoveBreed = (breed: string) => {
    setSearchParams((prev) => ({
      ...prev,
      breeds: prev.breeds.filter((b) => b !== breed),
    }));
  };

  const handleRemoveZipCode = (zipCodeToRemove: string) => {
    setSearchParams((prev) => ({
      ...prev,
      zipCodes: prev.zipCodes.filter((z) => z !== zipCodeToRemove),
    }));
    setLocations((prev) =>
      prev.filter((loc) => loc.zip_code !== zipCodeToRemove)
    );
  };

  const handleSort = (value: string) => {
    setSearchParams((prev) => ({ ...prev, sort: value }));
  };

  const handleToggleFavorite = (dogId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(dogId)) {
        next.delete(dogId);
      } else {
        next.add(dogId);
      }
      return next;
    });
  };

  const handleGenerateMatch = async () => {
    if (favorites.size === 0) {
      toast.error("Please select at least one favorite dog");
      return;
    }

    setIsGeneratingMatch(true);
    try {
      const matchResponse = await getMatch(Array.from(favorites));

      if (!matchResponse || !matchResponse.match) {
        throw new Error("No match was found. Try selecting different dogs.");
      }

      const matchId = matchResponse.match;

      const dogMatches = await getDogs([matchId]);

      if (!dogMatches || dogMatches.length === 0) {
        throw new Error("Could not retrieve details for your matched dog.");
      }

      const dogMatch = dogMatches[0];
      setMatchedDog(dogMatch);
      setIsMatchModalOpen(true);

      toast.success(`You've been matched with ${dogMatch.name}!`, {
        duration: 3000,
        position: "bottom-center",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate match. Please try again.";

      toast.error(errorMessage);
      console.error("Match generation error:", error);
    } finally {
      setIsGeneratingMatch(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successful");
      navigate("/");
    } catch (error: unknown) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");

      if (error instanceof Error && error.message.includes("401")) {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <PawPrint className="w-8 h-8 mr-2 text-primary-500" />
            Find a dog that can appreciate you
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Breed
              </label>
              <div className="flex gap-2">
                <Select
                  value={selectedBreed}
                  onChange={(e) => setSelectedBreed(e.target.value)}
                  className="flex-1"
                  disabled={isLoadingBreeds || !!breedsError}
                >
                  <option value="">
                    {isLoadingBreeds
                      ? "Loading breeds..."
                      : breedsError
                      ? "Error loading breeds"
                      : "Select a breed"}
                  </option>
                  {breeds?.map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </Select>
                <Button
                  onClick={handleAddBreed}
                  disabled={isLoadingBreeds || !selectedBreed || !!breedsError}
                >
                  {isLoadingBreeds ? (
                    <Spinner size="sm" />
                  ) : (
                    <SearchIcon className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {breedsError && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Failed to load breeds
                  <button
                    onClick={() => refetchBreeds()}
                    className="ml-2 text-primary-500 hover:text-primary-700 underline"
                  >
                    Retry
                  </button>
                </p>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by ZIP Code
              </label>
              <div className="flex gap-2">
                <Input
                  value={zipCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setZipCode(value);
                  }}
                  placeholder="Enter ZIP code"
                  className="flex-1"
                  maxLength={5}
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
                <Button
                  onClick={handleAddZipCode}
                  disabled={isValidatingZip || zipCode.length !== 5}
                >
                  {isValidatingZip ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <Select
                value={searchParams.sort}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="breed:asc">Breed (A-Z)</option>
                <option value="breed:desc">Breed (Z-A)</option>
                <option value="age:asc">Age (Youngest)</option>
                <option value="age:desc">Age (Oldest)</option>
                <option value="name:asc">Name (A-Z)</option>
                <option value="name:desc">Name (Z-A)</option>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {searchParams.breeds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500">
                  Breeds:
                </span>
                {searchParams.breeds.map((breed) => (
                  <span
                    key={breed}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700"
                  >
                    {breed}
                    <button
                      onClick={() => handleRemoveBreed(breed)}
                      className="ml-2 hover:text-primary-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {searchParams.zipCodes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500">
                  ZIP Codes:
                </span>
                {searchParams.zipCodes.map((zipCode) => {
                  const location = locations.find(
                    (loc) => loc.zip_code === zipCode
                  );
                  const locationLabel = location
                    ? `${location.city}, ${location.state}`
                    : zipCode;

                  return (
                    <span
                      key={zipCode}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                      title={locationLabel}
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      {zipCode}
                      {location && (
                        <span className="ml-1 text-xs text-blue-600">
                          ({location.city}, {location.state})
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveZipCode(zipCode)}
                        className="ml-2 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {favorites.size} {favorites.size === 1 ? "Favorite" : "Favorites"}
          </h2>
          <Button
            onClick={handleGenerateMatch}
            disabled={favorites.size === 0 || isGeneratingMatch}
          >
            {isGeneratingMatch ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Generating...
              </>
            ) : (
              "Generate Match"
            )}
          </Button>
        </div>

        {isSearching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} />
            ))}
          </div>
        ) : searchError ? (
          <ErrorMessage
            title="Error Loading Dogs"
            message="We couldn't fetch the dog listings. Please try again."
            onRetry={refetchSearch}
            className="max-w-lg mx-auto my-12"
          />
        ) : searchResults?.dogs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex flex-col items-center">
              <MapPin className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No dogs found
              </h3>
              <p className="text-gray-500 mb-4 max-w-md">
                We couldn't find any dogs matching your current filters. Try
                adjusting your search criteria.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults?.dogs.map((dog: Dog) => (
              <DogCard
                key={dog.id}
                dog={dog}
                isFavorite={favorites.has(dog.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center gap-4">
          <Button
            variant="outline"
            disabled={!searchResults?.prev}
            onClick={() =>
              setSearchParams((prev) => ({
                ...prev,
                from: searchResults?.prev || "",
              }))
            }
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={!searchResults?.next}
            onClick={() =>
              setSearchParams((prev) => ({
                ...prev,
                from: searchResults?.next || "",
              }))
            }
          >
            Next
          </Button>
        </div>
      </main>

      <Modal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        title="Your Perfect Match"
        className="max-w-lg"
      >
        {matchedDog && (
          <MatchedDog
            dog={matchedDog}
            onClose={() => setIsMatchModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

Search.displayName = "Search";

export default Search;
