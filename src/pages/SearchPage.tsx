import React, { useState, useEffect, useCallback } from "react";
import { getBreeds, searchDogs, getDogsByIds, getMatch } from "../api/dogs.ts";
import {
  Container,
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination,
  Collapse,
} from "@mui/material";
import DogCard from "../components/DogCard.tsx";
import { useNavigate, useLocation } from "react-router-dom";

const SearchPage: React.FC<{
  setShowLocation: React.Dispatch<React.SetStateAction<boolean>>;
  location: { zip_code: string } | null;
}> = ({ setShowLocation, location }) => {
  const [dogs, setDogs] = useState<any[]>([]);
  const [dogDetails, setDogDetails] = useState<any[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [error, setError] = useState("");
  const [zipCode, setZipCode] = useState(location?.zip_code || "");
  const [radius, setRadius] = useState(10);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavorites = sessionStorage.getItem("favoriteDogs");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("breed:asc");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log("State from search page top: ", state);
  const flowType = state?.flowType;

  console.log("Flow Type:", flowType);
  console.log("dogs", dogs);


  const [filters, setFilters] = useState(() => {
    const savedFilters = sessionStorage.getItem("dogFilters");
    return savedFilters
      ? JSON.parse(savedFilters)
      : { breed: "", minAge: "", maxAge: "", zip_code: "" };
  });

  useEffect(() => {
    console.log("State from search page: ", state);
    const fetchBreeds = async () => {
      try {
        const breedList = await getBreeds();
        setBreeds(breedList);
      } catch (err) {
        setError("Failed to load breeds.");
      }
    };
    fetchBreeds();
  }, [setShowLocation, state]);

  useEffect(() => {
    console.log("State from my PAGE:", state);
    if (state.flowType === "Get Started") {
      setShowLocation(false);
      console.log("Get Started button was clicked");
      // Perform any action needed when "Get Started" button is clicked
    } else {
      setShowLocation(true);
    }
  }, [state, setShowLocation]);

  const handleZipCodeSearch = useCallback(
    async (zip: string) => {
      setLoading(true);
      setError("");
      try {
        const searchParams = {
          zipCodes: [zip],
          size: 12,
          from: 0,
          sort: sortOrder,
        };
        const data = await searchDogs(searchParams);
        setDogs(data.resultIds);
        setTotalPages(Math.ceil(data.total / 12));
        const dogDetailsResponse = await getDogsByIds(data.resultIds);
        setDogDetails(dogDetailsResponse);
      } catch (err) {
        setError("Failed to fetch dogs for the entered ZIP code.");
      } finally {
        setLoading(false);
      }
    },
    [sortOrder]
  );

  useEffect(() => {
    if (location?.zip_code) {
      setZipCode(location.zip_code);
      handleZipCodeSearch(location.zip_code);
    }
  }, [location, handleZipCodeSearch]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
    if (field === "zip_code") {
      setZipCode(value);
    }
    handleSearch(1);
  };

  const handleSearch = useCallback(
    async (pageNumber = 1) => {
      setLoading(true);
      setError("");

      try {
        const searchParams: any = {
          ...(filters.breed && { breeds: [filters.breed] }),
          ...(filters.zip_code && { zipCodes: [filters.zip_code] }),
          ...(filters.minAge && { ageMin: filters.minAge }),
          ...(filters.maxAge && { ageMax: filters.maxAge }),
          size: 12,
          from: (pageNumber - 1) * 12,
          sort: sortOrder,
        };

        console.log("Fetching dogs with params:", searchParams);

        const data = await searchDogs(searchParams);

        if (!data.resultIds || data.resultIds.length === 0) {
          setError("No dogs found for the selected filters.");
          setDogDetails([]);
          return;
        }

        setDogs(data.resultIds);
        setTotalPages(Math.ceil(data.total / 12));

        const dogDetailsResponse = await getDogsByIds(data.resultIds);
        setDogDetails(dogDetailsResponse);
      } catch (err) {
        console.error("Error fetching dogs:", err);
        setError("Failed to fetch dogs. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [filters, sortOrder]
  );

  useEffect(() => {
    if (state?.dogDetails) {
      setDogDetails(state.dogDetails);
    } else {
      handleSearch(1);
    }
  }, [filters, page, sortOrder, handleSearch, state]);

  useEffect(() => {
    sessionStorage.setItem("dogFilters", JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    sessionStorage.setItem("favoriteDogs", JSON.stringify(favorites));
  }, [favorites]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    handleSearch(value);
  };

  const handleAddFavorite = (dogId: string) => {
    setFavorites((prev) =>
      prev.includes(dogId)
        ? prev.filter((id) => id !== dogId)
        : [...prev, dogId]
    );
  };

  const handleGetMatch = async () => {
    if (favorites.length === 0) {
      setError("Please select at least one favorite dog for matching.");
      return;
    }
    setMatchLoading(true);
    try {
      console.log("Sending favorites for match:", favorites);

      const matchedResponse = await getMatch(favorites);
      const matchedDogId = matchedResponse.match;

      console.log("Matched Dog ID:", matchedDogId);

      if (!matchedDogId) {
        throw new Error("No match found.");
      }

      setMatchLoading(false);
      navigate(`/match/${matchedDogId}`);
    } catch (err) {
      console.error("Failed to generate a match:", err);
      setError("Failed to generate a match. Please try again.");
      setMatchLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({ breed: "", minAge: "", maxAge: "", zip_code: "" });
    setZipCode("");
    setRadius(10);
  };

  return (
    <Container maxWidth="lg">
      {flowType !== "Get Started" ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
          p={2}
          bgcolor="#f5f5f5"
          borderRadius={2}
        >
          <Typography variant="h5">Find Dogs Near You</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="Enter ZIP Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              variant="outlined"
              size="small"
            />
            <FormControl size="small" variant="outlined">
              <InputLabel>Radius</InputLabel>
              <Select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                label="Radius"
              >
                <MenuItem value={5}>Within 5 miles</MenuItem>
                <MenuItem value={10}>Within 10 miles</MenuItem>
                <MenuItem value={25}>Within 25 miles</MenuItem>
                <MenuItem value={50}>Within 50 miles</MenuItem>
                <MenuItem value={100}>Within 100 miles</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleZipCodeSearch(zipCode)}
            >
              Search
            </Button>
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5">
            Select your favourite dog to generate the match
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={handleGetMatch}
            disabled={matchLoading}
          >
            {matchLoading ? <CircularProgress size={24} /> : "Generate Match"}
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {flowType !== "Get Started" && (
          <Grid item xs={12} md={3}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide Filters" : "Add Filters"}
              </Button>
              <Collapse in={showFilters}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <FormControl fullWidth>
                    <InputLabel>Breed</InputLabel>
                    <Select
                      value={filters.breed}
                      onChange={(e) =>
                        handleFilterChange("breed", e.target.value)
                      }
                      label="Breed"
                    >
                      {breeds.map((breed) => (
                        <MenuItem key={breed} value={breed}>
                          {breed}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <TextField
                      label="Zip Code"
                      value={filters.zip_code}
                      onChange={(e) =>
                        handleFilterChange("zip_code", e.target.value)
                      }
                      variant="outlined"
                    ></TextField>
                  </FormControl>

                  <FormControl fullWidth>
                    <TextField
                      label="Age Min"
                      value={filters.minAge}
                      onChange={(e) =>
                        handleFilterChange("minAge", e.target.value)
                      }
                      variant="outlined"
                    ></TextField>
                  </FormControl>

                  <FormControl fullWidth>
                    <TextField
                      label="Age Max"
                      value={filters.maxAge}
                      onChange={(e) =>
                        handleFilterChange("maxAge", e.target.value)
                      }
                      variant="outlined"
                    ></TextField>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      label="Sort By"
                    >
                      <MenuItem value="breed:asc">Breed (A-Z)</MenuItem>
                      <MenuItem value="breed:desc">Breed (Z-A)</MenuItem>
                      <MenuItem value="age:asc">Age (Youngest First)</MenuItem>
                      <MenuItem value="age:desc">Age (Oldest First)</MenuItem>
                      <MenuItem value="name:asc">Name (A-Z)</MenuItem>
                      <MenuItem value="name:desc">Name (Z-A)</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSearch(1)}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Apply Filters"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </Button>
                </Box>
              </Collapse>
            </Box>
          </Grid>
        )}
        <Grid item xs={12} md={flowType !== "Get Started" ? 9 : 12}>
          <Grid container spacing={3}>
            {dogDetails.length > 0
              ? dogDetails.map((dog) => (
                  <Grid item xs={12} sm={6} md={4} key={dog.id}>
                    <DogCard
                      dog={dog}
                      onFavorite={handleAddFavorite}
                      isFavorite={favorites.includes(dog.id)}
                    />
                  </Grid>
                ))
              : !loading && (
                  <Typography variant="body1" mt={4} ml={2}>
                    No dogs found. Try adjusting your filters.
                  </Typography>
                )}
          </Grid>
          {flowType !== "Get Started" && (
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Grid>
      </Grid>
      {flowType === "Get Started" && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert onClose={() => setError("")} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default SearchPage;
