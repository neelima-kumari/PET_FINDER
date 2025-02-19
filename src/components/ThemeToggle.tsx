import React, { useContext } from "react";
import { IconButton } from "@mui/material";
import { ThemeContext } from "./ThemeContext.tsx";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const ThemeToggle: React.FC = () => {
  const { toggleTheme, mode } = useContext(ThemeContext);

  return (
    <IconButton color="inherit" onClick={toggleTheme}>
      {mode === "light" ? <Brightness4 /> : <Brightness7 />}
    </IconButton>
  );
};

export default ThemeToggle;
