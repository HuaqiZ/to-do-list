import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Switch from '@mui/material/Switch';
import { Box, Typography, Button, Grid } from "@mui/material";

const categories = [
  { name: "Work Tasks", color: "#d3d3d3" },
  { name: "Personal Tasks", color: "#6c757d" },
  { name: "Shopping Tasks", color: "#adb5bd" },
];

export default function SettingsPage() {
  return (
    <div>
      <Card>
        <CardContent>
          <Typography
            variant="h6" 
            sx={{
              marginBottom: 2
            }}>
            Category Colors
          </Typography>
          {categories.map((category, index) => (
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            key={index}
            sx={{
              border: "1px solid #ddd",
              borderRadius: 1,
              marginBottom: 1,
              padding: 1.5,
              gap: 3
            }}
          >
            <Grid item sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: category.color,
                  borderRadius: 1,
                  marginRight: 2,
                }}
              />
              <Typography>{category.name}</Typography>
            </Grid>
            <Grid item>
              <Button variant="outlined"
                size="small"
                sx={{ backgroundColor: "#fbfcfc", color: "black", borderColor:"black", textTransform: "none" }}>
                Change
              </Button>
            </Grid>
          </Grid>
        ))}
          <Button sx={{textTransform: "none", color: "black"}}> + Add New Category</Button>
        </CardContent>
      </Card>

      <Card sx={{marginTop: 3}}>
        <CardContent>
          <Typography variant="h6" sx={{marginBottom: 2}}>
            Display Settings
          </Typography>
          <Grid container alignItems="center"
            justifyContent="space-between">Show Category Colors<Switch /></Grid>
          <Grid container alignItems="center"
            justifyContent="space-between">Show Completed Tasks<Switch /></Grid>
        </CardContent>
      </Card>
      
      <Box sx={{marginTop: "24px", display: "flex", justifyContent: "flex-end"}}>
        <Button sx={{color: "black", border: "1px solid black", marginRight: "8px", textTransform: "none"}}>Cancel</Button>
        <Button sx={{color: "white", backgroundColor: "black", textTransform: "none"}}>Save Changes</Button>
      </Box>
    </div>
  );
}
