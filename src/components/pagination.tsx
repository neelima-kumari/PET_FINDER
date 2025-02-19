import React from "react";
import { Box, Button } from "@mui/material";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChange,
}) => (
  <Box mt={4} display="flex" justifyContent="center">
    <Button
      variant="outlined"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 0}
    >
      Previous
    </Button>
    <Button
      variant="outlined"
      onClick={() => onPageChange(currentPage + 1)}
      sx={{ ml: 2 }}
    >
      Next
    </Button>
  </Box>
);

export default Pagination;
