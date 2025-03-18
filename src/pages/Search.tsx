import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Search as SearchIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Input, Select, Dog, Button } from "../components";
import { getBreeds, getDogs, getMatch, logout, searchDogs } from "../utils/api";
import { type Dog } from "../global.d";

const DOGS_PER_PAGE = 20;

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    breeds: [] as string[],
    sort: "breeds:asc",
    from: "",
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectBreed, setSelectedBreed] = useState<string>("");

  const { data: breeds } = useQuery({
    queryKey: ["breeds"],
    queryFn: getBreeds,
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["dogs", searchParams],
    queryFn: async () => {
      const { resultIds, next, prev } = await searchDogs({
        ...searchParams,
        size: DOGS_PER_PAGE,
      });
      const dogs = await getDogs(resultIds);
      return { dogs, next, prev };
    },
  });

  return <div>Search</div>;
};

Search.displayName = "Search";

export default Search;
