import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDogsByIds } from "../api/dogs.ts";
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Box,
  Button,
} from "@mui/material";

const MatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dog, setDog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleBackToSearch = () => {
    localStorage.removeItem("dogFilters");
    localStorage.removeItem("favorites");
    navigate("/search", { state: { flowType: "Default" } });
  };

  useEffect(() => {
    const fetchDogDetails = async () => {
      if (!id) {
        console.error("No dog ID found in URL");
        return;
      }

      try {
        console.log("Fetching dog details for ID:", id);
        const dogDetails = await getDogsByIds([id]);

        if (dogDetails && dogDetails.length > 0) {
          setDog(dogDetails[0]);
        } else {
          console.error("No dog details found for ID:", id);
        }
      } catch (err) {
        console.error("Failed to fetch matched dog details.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDogDetails();
  }, [id]);

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Loading your match...
        </Typography>
      </Container>
    );
  }

  if (!dog) {
    return (
      <Container
        maxWidth="sm"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        <Typography variant="h6" mt={2} color="error">
          No dog found for this match.
        </Typography>
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBackToSearch}
          >
            Back to Search
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={dog.img || "https://via.placeholder.com/300"} // Placeholder image fallback
          alt={dog.name}
        />
        <CardContent>
          <Typography variant="h5">{dog.name}</Typography>
          <Typography variant="body1">
            <strong>Breed:</strong> {dog.breed}
          </Typography>
          <Typography variant="body1">
            <strong>Age:</strong> {dog.age} years
          </Typography>
          <Typography variant="body1">
            <strong>Location:</strong> {dog.zip_code}
          </Typography>
        </CardContent>
      </Card>
      <Box mt={4} textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/search", { state: { flowType: "Default" } })}
        >
          Back to Search
        </Button>
      </Box>
    </Container>
  );
};

export default MatchPage;
