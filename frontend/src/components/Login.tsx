import React from "react";
import { Box, TextField, Typography, Button, Checkbox, FormControlLabel, Divider, Grid } from "@mui/material";
import { Google, GitHub } from "@mui/icons-material";

export default function Login() {
    return (
        <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#f9f9f9",
        padding: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: "100%",
          padding: 4,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="textSecondary" textAlign="center" mb={3}>
          Sign in to your account
        </Typography>

        <TextField
          fullWidth
          label="Email address"
          placeholder="name@company.com"
          type="email"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <FormControlLabel control={<Checkbox />} label="Remember me" />
          <Button variant="text" sx={{ cursor: "pointer", textTransform: "none" }}>
            Forgot password?
          </Button>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{ backgroundColor: "#000", color: "#fff", mt: 2, mb: 2, "&:hover": { backgroundColor: "#333" } }}
        >
          Sign in
        </Button>

        <Divider sx={{ my: 2, color: "darkgray" }}>Or continue with</Divider>

        <Grid container sx={{ my: 0 }} spacing={2}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              sx={{ textTransform: "none" }}
              color='inherit'
            >
              Google
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHub />}
              sx={{ textTransform: "none" }}
              color='inherit'
            >
              GitHub
            </Button>
          </Grid>
        </Grid>

        <Typography variant="body2" color="textSecondary" textAlign="center" mt={3}>
          Don't have an account?{" "}
          <Typography
            component="span"
            color="primary"
            sx={{ cursor: "pointer", textDecoration: "underline" }}
          >
            Sign up
          </Typography>
        </Typography>
      </Box>
    </Box>
    );
}