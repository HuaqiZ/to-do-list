import React, { useState } from "react";
import { Box, TextField, Typography, Button, Checkbox, FormControlLabel, Divider, Grid, FormControl  } from "@mui/material";
import { Google, GitHub } from "@mui/icons-material";
import axios from 'axios';
import { useUser } from "../UserContext";

const Login = ({setIsAuthenticated}: {setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [signUp, notSignUp] = useState<boolean>(false);

  const handleSignin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    if(signUp) {
      try {
        await axios.post('http://localhost:8080/auth/signup', {
          username,
          email,
          password
        }, {
          withCredentials: true // Allow cookies to be sent and stored
        });
        setIsAuthenticated(true);
      } catch(err) {
        console.error("Error update userinfo", err);
      }
    } else {
      try {
        await axios.post('http://localhost:8080/auth/login', {
          email,
          password
        }, {
          withCredentials: true
        });
        setIsAuthenticated(true);
      } catch(err) {
        console.error("Error update userinfo", err);
      }
    }
  }

  const handleChangeUsername = (event: any) => {
    setUsername(event.target.value);
  }

  const handleChangePassword = (event: any) => {
    setPassword(event.target.value);
  }

  const handleChangeEmail = (event: any) => {
    setEmail(event.target.value);
  }

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
          Log in to your account
        </Typography>

        {signUp && 
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            onChange={handleChangeUsername}
          />
        }
        <TextField
          fullWidth
          label="Email address"
          placeholder="name@company.com"
          type="email"
          margin="normal"
          onChange={handleChangeEmail}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          onChange={handleChangePassword}
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
          onClick={() => handleSignin()}
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
            onClick={() => {
              console.log("Clicked");
              notSignUp(true);
            }}
          >
            Sign up
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;