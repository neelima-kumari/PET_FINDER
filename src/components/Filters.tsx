import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface FiltersProps {
  breeds: string[];
  onFilterChange: (breed: string) => void;
  onSortChange: (order: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  breeds,
  onFilterChange,
  onSortChange,
}) => {
  const handleBreedChange = (event: SelectChangeEvent) =>
    onFilterChange(event.target.value);
  const handleSortChange = (event: SelectChangeEvent) =>
    onSortChange(event.target.value);

  return (
    <Box
      mb={4}
      display="flex"
      justifyContent="space-between"
      sx={{ p: 2, gap: 2 }}
    >
      <FormControl variant="outlined" sx={{ minWidth: 200 }}>
        <InputLabel>Breed</InputLabel>
        <Select defaultValue="" onChange={handleBreedChange} label="Breed">
          <MenuItem value="">All Breeds</MenuItem>
          {breeds.map((breed) => (
            <MenuItem key={breed} value={breed}>
              {breed}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" sx={{ minWidth: 200 }}>
        <InputLabel>Sort By</InputLabel>
        <Select defaultValue="asc" onChange={handleSortChange} label="Sort By">
          <MenuItem value="asc">Breed: A-Z</MenuItem>
          <MenuItem value="desc">Breed: Z-A</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default Filters;
