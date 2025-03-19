
// const AppRouter = () => {
//   return (
//       <Routes>
//         <Route path="/" element={<App />} />
//         <Route path="/calendar" element={<CalendarPage />} />
//         <Route path="/settings" element={<SettingsPage />} />
//       </Routes>
//   );
// };


import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import SideMenu from "./components/SideMenu";
import App from "./App"; // Task Page
import SettingsPage from "./components/SettingsPage";
import Login from './components/Login';
import axios from "axios";
import { useUser } from "./UserContext";

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { setUserId } = useUser();

  useEffect(() => {
    async function checkIfLogin() {
      try {
        const response = await axios.get(`http://localhost:8080/auth/check`,{withCredentials: true})
        setIsAuthenticated(true);
        setUserId(response.data.user.id);
        localStorage.setItem("userId", String(response.data.user.id));
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("username", response.data.user.username);
      } catch(err) {
        console.error('Authentication check failed:', err);
        setIsAuthenticated(false);
      }
    }
    checkIfLogin();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? (
   <Box sx={{ display: "flex", height: "100vh" }}>
        <SideMenu setIsAuthenticated={setIsAuthenticated} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: 3,
          }}
        >
          <Routes>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/" element={<App />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Box>
      </Box>
  ) : (
    <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent:"center" }}>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Box>
  )
};

export default AppRouter;
