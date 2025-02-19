import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface SnackbarAlertProps {
  open: boolean;
  message: string;
  severity: "success" | "error";
  onClose: () => void;
}

const SnackbarAlert: React.FC<SnackbarAlertProps> = ({
  open,
  message,
  severity,
  onClose,
}) => (
  <Snackbar
    open={open}
    autoHideDuration={3000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <Alert onClose={onClose} severity={severity} variant="filled">
      {message}
    </Alert>
  </Snackbar>
);

export default SnackbarAlert;
