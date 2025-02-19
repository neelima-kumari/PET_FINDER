import React from "react";
import "./DogCard.css"; // Import the CSS file
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface DogCardProps {
  dog: {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
    distance: string;
  };
  onFavorite: (id: string) => void;
  isFavorite: boolean;
}

const DogCard: React.FC<DogCardProps> = ({ dog, onFavorite, isFavorite }) => {
  return (
    <Card
      sx={{
        maxWidth: 300,
        borderRadius: 3,
        boxShadow: 3,
        position: "relative",
      }}
    >
      <CardMedia component="img" height="200" image={dog.img} alt={dog.name} />

      {/* Favorite Icon in the top right corner */}
      <IconButton
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
        onClick={() => onFavorite(dog.id)}
      >
        {isFavorite ? (
          <FavoriteIcon sx={{ color: "purple" }} />
        ) : (
          <FavoriteBorderIcon sx={{ color: "purple" }} />
        )}
      </IconButton>

      <CardContent>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", color: "purple" }}
        >
          {dog.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {dog.age} • {dog.breed}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {dog.distance} away
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DogCard;
