import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  CircularProgress,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";
import { getBreeds, searchDogs, getDogsByIds } from "../api/dogs.ts";

const steps = [
  "Breed",
  "Min Age",
  "Max Age",
  "ZIP Code",
];

const DogAdoptionQuestionnaire: React.FC<{ setShowLocation: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setShowLocation }) => {
  const navigate = useNavigate();
  const [formStep, setFormStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogDetails, setDogDetails] = useState<any[]>([]);

  const [answers, setAnswers] = useState({
    breed: "",
    minAge: "",
    maxAge: "",
    zip_code: "",
    flowType: "Get Started"
  });
  console.log(dogDetails)

  useEffect(() => {
    setShowLocation(false);
    const fetchBreeds = async () => {
      try {
        const breedList = await getBreeds();
        setBreeds(breedList);
      } catch (err) {
        console.error("Failed to load breeds.");
      }
    };
    fetchBreeds();
  }, [setShowLocation]);

  const progressValue = ((formStep + 1) / steps.length) * 100;
  const location = useLocation();

  const handleNext = async () => {
    location.state.flowType = "Get Started";
    console.log("Answers:", answers, location);
    if (formStep < steps.length - 1) {
      setFormStep((prev) => prev + 1);
    } else {
      setLoading(true);
      try {
        const searchParams: any = {
          ...(answers.breed && { breeds: [answers.breed] }),
          ...(answers.zip_code && { zipCodes: [answers.zip_code] }),
          ...(answers.minAge && { ageMin: answers.minAge }),
          ...(answers.maxAge && { ageMax: answers.maxAge }),
          size: 12,
          from: 0,
        };

        console.log("Fetching dogs with params:", searchParams);

        const data = await searchDogs(searchParams);
        console.log("Search results:", data);

        if (!data.resultIds || data.resultIds.length === 0) {
          console.error("No dogs found for the selected filters.");
          setDogDetails([]);
          return;
        }

        const dogDetailsResponse = await getDogsByIds(data.resultIds);
        setDogDetails(dogDetailsResponse);

        setTimeout(() => {
          navigate("/search", { state: { ...answers, dogDetails: dogDetailsResponse } });
        }, 2000);
      } catch (err) {
        console.error("Error fetching dogs:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name?: string; value: unknown } }) => {
    const { name, value } = event.target;
    if (!name) return; // Ensure name exists to prevent errors
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const currentStepKey = steps[formStep].toLowerCase().replace(/\s/g, "");

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        color="primary"
        sx={{ textShadow: "1px 1px 3px rgba(0,0,0,0.2)" }}
      >
        Find Your Perfect Furry Friend! 🐶💜
      </Typography>

      <Box sx={{ width: "100%", mb: 4 }}>
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      <Paper
        elevation={6}
        sx={{
          p: 6,
          mt: 4,
          borderRadius: 5,
          boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
          background: "#ffffff",
          color: "black",
          textAlign: "center",
        }}
      >
        <motion.div
          key={formStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            {steps[formStep]}
          </Typography>
          {currentStepKey === "breed" ? (
            <FormControl fullWidth variant="outlined" sx={{ fontSize: "1.1rem", bgcolor: "white", borderRadius: 3 }}>
              <InputLabel>Breed</InputLabel>
              <Select
                name="breed"
                value={answers.breed}
                onChange={handleChange}
                label="Breed"
              >
                {breeds.map((breed) => (
                  <MenuItem key={breed} value={breed}>
                    {breed}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              name={currentStepKey}
              value={answers[currentStepKey as keyof typeof answers] || ""}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{ fontSize: "1.1rem", bgcolor: "white", borderRadius: 3 }}
            />
          )}
        </motion.div>
      </Paper>

      <Box mt={4} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleNext}
          sx={{
            width: "60%",
            fontSize: "1.3rem",
            borderRadius: 10,
            p: 2,
            fontWeight: "bold",
            textTransform: "none",
            background: "#6a11cb",
            backgroundImage: "linear-gradient(to right, #6a11cb, #2575fc)",
          }}
        >
          {formStep < steps.length - 1 ? "Next Step" : "Find My Match"}
        </Button>
      </Box>

      {loading && (
        <Box mt={3} textAlign="center">
          <CircularProgress color="secondary" sx={{ color: "#ff4081" }} />
          <Typography
            variant="body1"
            mt={2}
            sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
          >
            Finding your perfect match...
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default DogAdoptionQuestionnaire;
