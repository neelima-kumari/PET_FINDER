import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";

const dogAvatars = [
  "https://placedog.net/100/100?id=1",
  "https://placedog.net/100/100?id=2",
  "https://placedog.net/100/100?id=3",
  "https://placedog.net/100/100?id=4",
  "https://placedog.net/100/100?id=5",
  "https://placedog.net/100/100?id=6",
];

const cardAnimation = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  hover: { scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" },
};

const SearchChoicePage: React.FC<{ setShowLocation: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setShowLocation }) => {
  const navigate = useNavigate();
 const [answers, setAnswers] = useState({
     breed: "",
     minAge: "",
     maxAge: "",
     zip_code: "",
     flowType: "Get Started"
   });

  useEffect(() => {
    setShowLocation(false);
  }, [setShowLocation]);

  const handleNavigate = (path: string, showLocation: boolean) => {
    setShowLocation(showLocation);
  
    setAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers }; // Ensuring previous state is maintained
      return updatedAnswers;
    });
  
    navigate(path, { state: answers });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Choose Your Search Option
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {/* First Card: Find Your Best Match */}
        <Grid item xs={12} sm={6}>
          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Card
              sx={{
                textAlign: "center",
                p: 2,
                boxShadow: 3,
                borderRadius: 3,
                transition: "0.3s",
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="center" gap={1} mb={2}>
                  {dogAvatars.slice(0, 3).map((src, index) => (
                    <Avatar
                      key={index}
                      alt={`Dog ${index + 1}`}
                      src={src}
                      sx={{ width: 60, height: 60 }}
                    />
                  ))}
                </Box>
                <Typography variant="h5" gutterBottom>
                  Find Your Best Match
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  It only takes 60 seconds!
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleNavigate("/DogAdoptionQuestionnaire", false)}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Second Card: Find Dogs Nearby */}
        <Grid item xs={12} sm={6}>
          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Card
              sx={{
                textAlign: "center",
                p: 2,
                boxShadow: 3,
                borderRadius: 3,
                transition: "0.3s",
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="center" gap={1} mb={2}>
                  {dogAvatars.slice(3, 6).map((src, index) => (
                    <Avatar
                      key={index}
                      alt={`Dog ${index + 4}`}
                      src={src}
                      sx={{ width: 60, height: 60 }}
                    />
                  ))}
                </Box>
                <Typography variant="h5" gutterBottom>
                  Find Dogs Nearby
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Discover dogs available for adoption in your area.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => handleNavigate("/search", true)}
                >
                  Explore Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchChoicePage;
