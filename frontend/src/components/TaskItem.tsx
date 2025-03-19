import React, {useEffect, useState} from 'react';
import {Card, CardContent, Grid, Checkbox,Typography, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Stack} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CustomDatePicker from './CustomDatePicker';
import CustomDropdown from './CustomDropdown';
import axios from 'axios';
import { useUser } from '../UserContext';

interface List {
    id?: number,
    task_name: string,
    content: string,
    due_date: any,
    priority: number,
    label: {
      id: number;
      name: string;
      color: string;
  }[],
    user_id: number,
  }

const priorityLabels: Record<number, string>  = {
    0: "Low Priority",
    1: "High Priority",
    2: "Medium Priority",
};

const TaskItem  = ({item, onSelect}: {item: List, onSelect: (taskId: number, isSelected: boolean) => void}) => {
    const { userId } = useUser();
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState(item.due_date);
    const [selectedPriority, setSelectedPriority] = useState<number>(item.priority);
    const [labels, setLabel] = useState<{ id: number; name: string; color: string }[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<{ id: number; name: string; color: string }[]>(item.label);
    const [isChecked, setIsChecked] = useState(false);
    const [name, setName] = useState(item.task_name);
    const [content, setContent] = useState(item.content);
    
    useEffect(() => {
        const fetchLabels = async () => {
            try {
            const response = await axios.get(`http://localhost:8080/${userId}/labels`);
            setLabel(response.data);
            } catch (error) {
            console.error("Error fetching labels:", error);
            }
        };

        fetchLabels();
        }, [userId]);

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      };

      const handleDatePickerChange = (value: any) => {
        setSelectedDate(value);
      }

      const handleDropdownChange = (value: number) => {
        setSelectedPriority(value); // Update the value in the parent
      };

      const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
        onSelect(item.id as number, event.target.checked);
      };

      const handleTaskNameChange = (event: any) => {
        setName(event.target.value);
      };

      const handleTaskDescriptionChange = (event: any) => {
        setContent(event.target.value);
      }

    return (
        <div>
        <Card key={item.id} sx={{ mb: 2, backgroundColor: '#f9fafb' }}>
          <CardContent>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Checkbox 
                checked={isChecked}
                onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", marginTop: '10px' }}>{item.task_name}</Typography>
                {item.label && 
                  item.label.map((info) => (
                    <Chip
                      key={info.id}
                      label={info.name}
                      sx={{backgroundColor: info.color, marginRight: '5px'}}
                    />
                ))
                }
                <Typography variant="body2" sx={{color: '#6a6b6b'}}>Due: {new Date(item.due_date).toLocaleDateString("en-US", options)}</Typography>
              </Grid>
              <Grid item>
                <IconButton size="small" aria-label="delete" sx={{border: 'solid lightgrey', marginRight: '10px'}} onClick={() => setOpenPopup(true)}>
                    <EditIcon fontSize="inherit" />
                </IconButton>
                <Chip label={`${priorityLabels[item.priority as number] || "Unknown Priority"}`} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {openPopup && 
        <Dialog open={openPopup} onClose={setOpenPopup} maxWidth="xs" fullWidth>
        <IconButton
          aria-label="close"
          onClick={() => setOpenPopup(false)}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
  
        <DialogTitle sx={{ fontWeight: 'bold' }}>Task Details</DialogTitle>
  
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom>
            Title
          </Typography>
          <TextField
            value={name}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            onChange={handleTaskNameChange}
          />
  
          <div className="row_container">
            <div className="column_item" style={{gap: 0}}>
                <Typography variant="subtitle2" gutterBottom>Due date</Typography>
                <CustomDatePicker date={selectedDate} onValueChange={handleDatePickerChange} />
            </div>
            <div className="column_item" style={{gap: 0}}>
                <Typography variant="subtitle2" gutterBottom>Priority</Typography>
                <CustomDropdown date={selectedPriority} onValueChange={handleDropdownChange} />
            </div>
        </div>
  
          <Typography variant="subtitle2" gutterBottom style={{marginTop: '20px'}}>
            Description
          </Typography>
          <TextField
            value={content}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
            onChange={handleTaskDescriptionChange}
          />

        <Typography variant="subtitle2" gutterBottom>Labels
            <Typography variant="caption" sx={{marginLeft: '24px'}}>You can edit the label type on setting</Typography>
            </Typography>
                <Stack direction="row" spacing={1} sx={{marginTop:'10px'}}>
                {labels.map((item) => (
                    <Chip
                      key={item.id}
                      sx={{ backgroundColor: selectedLabel && selectedLabel.length > 0 && selectedLabel.some(label => label.id === item.id) ? item.color : 'transparent', 
                            border: selectedLabel && selectedLabel.length > 0 && selectedLabel.some(label => label.id === item.id) ? 'none' : `2px solid ${item.color}` }}
                      label={item.name}
                      onClick={() => {
                        setSelectedLabel(selectedLabel.some((i) => i.id === item.id) ? selectedLabel.filter((i) => i.id !== item.id) : [...selectedLabel, { id: item.id, name: item.name, color: item.color }])
                      }}
                      clickable
                    />
                ))}
                </Stack>
        </DialogContent>
  
        <DialogActions>
          <Button onClick={() => setOpenPopup(false)} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
        }
        </div>
    )
}

export default TaskItem;