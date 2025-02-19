import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import CustomThemeProvider from "./components/ThemeContext.tsx";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import ThemeToggle from "./components/ThemeToggle.tsx";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import searchLocations from "./api/searchLocations.ts";
import PetsIcon from "@mui/icons-material/Pets";
import Logout from "./components/Logout.tsx";
import MatchPage from "./pages/MatchPage.tsx";
import SearchCoicePage from "./pages/SearchCoicePage.tsx";
import DogAdoptionQuestionnaire from "./pages/DogAdoptionQuestionnaire.tsx";

const App: React.FC = () => {
  const [location, setLocation] = useState<{
    county: string;
    city: string;
    state: string;
    zip_code: string;
  } | null>(null);
  const [showLocation, setShowLocation] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              console.log(
                `Geolocation - Latitude: ${latitude}, Longitude: ${longitude}`
              );

              const locationData = await searchLocations(latitude, longitude);
              if (locationData) {
                const { county, city, state, postal: zip_code } = locationData;
                setLocation({ county, city, state, zip_code });
              }
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, []);

  return (
    <CustomThemeProvider>
      <Router>
        <AppContent location={location} showLocation={showLocation} setShowLocation={setShowLocation} />
      </Router>
    </CustomThemeProvider>
  );
};

const AppContent: React.FC<{ location: { county: string; city: string; state: string; zip_code: string } | null, showLocation: boolean, setShowLocation: React.Dispatch<React.SetStateAction<boolean>> }> = ({ location, showLocation, setShowLocation }) => {
  const navigate = useNavigate();
  const currentLocation = useLocation();

  const handleIconClick = () => {
    localStorage.removeItem("dogFilters");
    localStorage.removeItem("favoriteDogs");
    navigate("/searchCoice");
  };

  const handleHeaderClick = () => {
    localStorage.removeItem("dogFilters");
    localStorage.removeItem("favoriteDogs");
    navigate("/searchCoice");
  };

  useEffect(() => {
    if (currentLocation.pathname !== "/search") {
      setShowLocation(false);
    }
  }, [currentLocation.pathname, setShowLocation]);

  console.log("SHOW Location", showLocation)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleIconClick} // Navigate to /searchCoice on icon click
          >
            <PetsIcon />
          </IconButton>
          <Box sx={{ textAlign: "center", flexGrow: 1 }}>
            <Typography
              align="center"
              variant="h6"
              color="inherit"
              component="div"
              sx={{ cursor: "pointer" }}
              onClick={handleHeaderClick} // Navigate to /searchCoice on text click
            >
              Dog Finder App
            </Typography>
            
            {showLocation && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LocationOnIcon />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {location
                    ? `${location.county}, ${location.city}, ${location.state}`
                    : "Fetching location..."}
                </Typography>
              </Box>
            )}
          </Box>
          <ThemeToggle />
          <Logout />
        </Toolbar>
      </AppBar>
      <Box mt={2}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/search" element={<SearchPage setShowLocation={setShowLocation} location={location} />} />
          <Route path="/searchCoice" element={<SearchCoicePage setShowLocation={setShowLocation} />} />
          <Route path="/match/:id" element={<MatchPage />} />
          <Route path="/DogAdoptionQuestionnaire" element={<DogAdoptionQuestionnaire setShowLocation={setShowLocation} />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;