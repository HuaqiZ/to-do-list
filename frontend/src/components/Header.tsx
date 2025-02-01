import * as React from 'react';
import Stack from '@mui/material/Stack';
import AddNewTask from "./AddNewTask";
import EditType from "./EditType";


export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
        px: 3,
      }}
      spacing={2}
    >
        <p style={{ marginRight:'1000px'}}>My Tasks</p>
        <AddNewTask />
        {/* <EditType /> */}
    </Stack>
  );
}
