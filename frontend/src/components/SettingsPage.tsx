import React, {useEffect, useState} from "react";
import { Card, CardContent, Switch, Box, Typography, Button, Grid } from '@mui/material';
import ChangeLabel from "./ChangeLabel";
import axios from "axios";
import { useUser } from "../UserContext";

export default function SettingsPage() {
  const { userId } = useUser();

  const [showLabelColor, setShowLabelColor] = useState<boolean>(true);
  const [showCompletedTask, setshowCompletedTask] = useState<boolean>(true);

  useEffect(() => {
    if(!userId) return;
    axios.get(`http://localhost:8080/display-setting`)
      .then(response => {
        setShowLabelColor(response.data[0].show_label_colors === 1 ? true : false);
        setshowCompletedTask(response.data[0].show_completed_tasks === 1 ? true : false);
      })
      .catch(error => console.error('Error', error));
  }, [userId]);

  const updateDisplaySetting = async () => {
    try {
      await axios.post(`http://localhost:8080/display-setting`, {
        showLabelColor: showLabelColor,
        showCompletedTask
      });
    } catch (error) {
      console.error("Error update display setting", error);
    }
  };

  const handleLabelColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowLabelColor(event.target.checked);
  }

  const handleCompletedTask = (event: React.ChangeEvent<HTMLInputElement>) => {
    setshowCompletedTask(event.target.checked);  
  }

  return (
    <div>
      <ChangeLabel />

      <Card sx={{marginTop: 3}}>
        <CardContent>
          <Typography variant="h6" sx={{marginBottom: 2}}>
            Display Settings
          </Typography>
          <Grid container alignItems="center"
            justifyContent="space-between">Show Label Colors<Switch onChange={handleLabelColor} checked={showLabelColor} /></Grid>
          <Grid container alignItems="center"
            justifyContent="space-between">Show Completed Tasks<Switch onChange={handleCompletedTask} checked={showCompletedTask} /></Grid>
        </CardContent>
      </Card>
 
      <Box sx={{marginTop: "24px", display: "flex", justifyContent: "flex-end"}}>
        <Button sx={{color: "white", backgroundColor: "black", textTransform: "none"}} onClick={updateDisplaySetting}>Save Changes</Button>
      </Box>
    </div>
  );
}
