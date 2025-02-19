import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import dogLogo from "../assets/doglogo.svg";

const API_BASE = "https://frontend-take-home-service.fetch.com";

const LoginPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE}/auth/login`,
        { name, email },
        { withCredentials: true }
      );
      navigate("/searchCoice");

      // navigate("/search"); // Navigate to SearchPage on success
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} textAlign="center">
        <img src={dogLogo} alt="Dog Finder Logo" width={"100px"} />
        <Typography variant="h4" gutterBottom>
          Dog Finder Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
