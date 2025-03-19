import React, { useState, useEffect } from "react";
import CustomDatePicker from "./CustomDatePicker";
import CustomDropdown from "./CustomDropdown";
import AddIcon from '@mui/icons-material/Add';
import { Button, Chip, Stack, Typography } from '@mui/material';
import axios from "axios";
import { useUser } from "../UserContext";

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

const AddNewTask = ({ setData }: {setData: React.Dispatch<React.SetStateAction<List[]>>}) => {
  const { userId } = useUser();

  const [popupBox, showPopupBox] = useState(false);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [labels, setLabel] = useState<{ id: number; name: string; color: string }[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<{ id: number; name: string; color: string }[]>([]);

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

  const createNewTodo =() => {
      showPopupBox(true);
    }
  
    const handleTaskNameChange = (event: any) => {
      setName(event.target.value);
    };
  
    const handleTaskDescriptionChange = (event: any) => {
      setContent(event.target.value);
    }

    const handleDropdownChange = (value: number) => {
      setSelectedStatus(value); // Update the value in the parent
    };

    const handleDatePickerChange = (value: any) => {
      setSelectedDate(value);
    }

    const addNewToDo = () => {
      if (!name.trim() || !selectedDate || selectedStatus) {
        alert("Please fill out all the required field");
        return;
      }
      
      const taskData: List = {
        task_name: name,
        content,
        due_date: selectedDate,
        priority: selectedStatus,
        label: selectedLabel,
        user_id: userId !== null ? userId : 0, 
      }

      axios.post('http://localhost:8080/add', {
        task_name: name,
        content: content,
        due_date: selectedDate,
        priority: selectedStatus,
        label: selectedLabel,
        user_id: userId !== null ? userId : 0,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  
      setData((prev) => [...prev, taskData]);
      setContent('');
      setName('');
      setSelectedLabel([]);
      showPopupBox(false);
    };

    return (
        <div>
            <Button size="medium" startIcon={<AddIcon />} onClick={() => createNewTodo()} sx={{backgroundColor: 'black', color: 'white', padding: '10px', textTransform: "none"}}>
                New Task
            </Button>
            {popupBox &&
            <div className='overlay'>
              <div className='popup'>
                <div className='content_popup'>
                  <h2>Create task</h2>
                    <label>Task Title<span style={{ color: 'red' }}> *</span></label>
                    <input id="task_name" value={name} placeholder='Enter task title' onChange={handleTaskNameChange}/>
                    <label>Description</label>
                    <textarea id="task_description" value={content} onChange={handleTaskDescriptionChange} placeholder='Add description' />
                    <div className="row_container">
                      <div className="column_item">
                        <span>Due date<span style={{ color: 'red' }}> *</span></span>
                        <CustomDatePicker onValueChange={handleDatePickerChange} />
                      </div>
                      <div className="column_item">
                        <span>Priority<span style={{ color: 'red' }}> *</span></span>
                        <CustomDropdown onValueChange={handleDropdownChange} />
                      </div>
                    </div>
                    <span>Labels<Typography variant="caption" sx={{marginLeft: '24px'}}>You can edit the label type on setting</Typography></span>
                    <Stack direction="row" spacing={1}>
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
                    <div className='button_function'>
                      <button id="cancel_button" 
                        onClick={() => {
                          setContent('');
                          setName('');
                          setSelectedLabel([]);
                          showPopupBox(false)
                          }}>Cancel</button>
                      <button onClick={() => addNewToDo()}>Create task</button>
                    </div>
                </div>
              </div>
            </div>
          }
        </div>
    )
  };
  
export default AddNewTask;