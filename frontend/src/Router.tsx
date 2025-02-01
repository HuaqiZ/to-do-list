// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import App from "./App"; // Task Page
// import CalendarPage from "./components/CalendarPage";
// import SettingsPage from "./components/SettingsPage";

// const AppRouter = () => {
//   return (
//       <Routes>
//         <Route path="/" element={<App />} />
//         <Route path="/calendar" element={<CalendarPage />} />
//         <Route path="/settings" element={<SettingsPage />} />
//       </Routes>
//   );
// };

// export default AppRouter;

import React from "react";
import { Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import SideMenu from "./components/SideMenu";
import App from "./App"; // Task Page
import CalendarPage from "./components/CalendarPage";
import SettingsPage from "./components/SettingsPage";

const AppRouter = () => {
  return (
      <Box sx={{ display: "flex", height: "100vh" }}>
        <SideMenu />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: 3,
          }}
        >
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Box>
      </Box>
  );
};

export default AppRouter;
