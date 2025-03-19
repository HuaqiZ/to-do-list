import * as React from 'react';
import { styled } from '@mui/material/styles';
import {Avatar, Button, Box, Stack, Typography} from '@mui/material';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import MenuContent from './MenuContent';
import axios from 'axios';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu({setIsAuthenticated}: {setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>}) {
  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username");

  const handleLogout =() => {
    try {
      axios.get('http://localhost:8080/auth/logout', {
        withCredentials: true
      });
      setIsAuthenticated(false);
    } catch(err) {
      console.error('Logout failed:', err);
    }
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
    <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
        }}
      >
        <Avatar
          sizes="small"
          sx={{ width: 36, height: 36 }}
        >
          {username && username[0]}
        </Avatar>
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {username}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {email}
          </Typography>
        </Box>
      </Stack>
      </Box>
      <MenuContent />

      <Button variant="outlined" color="error" sx={{marginBottom: '30px', width: '80%', marginLeft: '20px'}} onClick={() => handleLogout()}>Logout</Button>
    </Drawer>
  );
}
