import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface MatchDialogProps {
  dog: Dog;
  onClose: () => void;
}

const MatchDialog: React.FC<MatchDialogProps> = ({ dog, onClose }) => {
  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Your Perfect Match!</DialogTitle>
      <DialogContent>
        <Card>
          <CardMedia
            component="img"
            height="300"
            image={dog.img}
            alt={dog.name}
          />
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {dog.name}
            </Typography>
            <Typography variant="body1">
              <strong>Breed:</strong> {dog.breed}
            </Typography>
            <Typography variant="body1">
              <strong>Age:</strong> {dog.age} years
            </Typography>
            <Typography variant="body1">
              <strong>Location:</strong> ZIP Code {dog.zip_code}
            </Typography>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatchDialog;
