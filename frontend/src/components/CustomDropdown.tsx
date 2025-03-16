import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

interface CustomDropdownProps {
  onValueChange: (value: number) => void; // Prop to pass value back to parent
}

export default function CustomDropdown({ onValueChange }: CustomDropdownProps) {

  const [status, setStatus] = React.useState<number>(0);

  const handleChange = (event: any) => {
    setStatus(event.target.value);
    onValueChange(event.target.value);
  };

  return (
    <FormControl sx={{ minWidth: 120 }} size="small">
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={status}
        onChange={handleChange}
        sx={{borderColor: 'black', height: '30px'}}
      >
        <MenuItem value={1}>High Priority</MenuItem>
        <MenuItem value={2}>Medium Priority</MenuItem>
        <MenuItem value={0}>Low Priority</MenuItem>
      </Select>
    </FormControl>
  );
}