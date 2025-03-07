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
  display_order: number,
  status: number,
  label: {
    id: number;
    name: string;
    color: string;
}[],
  user_id: number,
  }

const AddNewTask = ({data, setData }: {data: List[], setData: React.Dispatch<React.SetStateAction<List[]>>}) => {
  const { userId } = useUser();

  const [popupBox, showPopupBox] = useState(false);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [labels, setLabel] = useState<{ id: number; name: string; color: string }[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<{ id: number; name: string; color: string }>();

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/labels`);
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
      const taskData: List = {
        task_name: name,
        content,
        due_date: selectedDate,
        display_order: data.length + 1,
        status: selectedStatus,
        label: labels,
        user_id: userId !== null ? userId : 0, 
      }

      axios.post('http://localhost:8080/add', {
        task_name: name,
        content: content,
        due_date: selectedDate,
        display_order: data.length + 1,
        status: selectedStatus,
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
      setSelectedLabel(undefined);
      showPopupBox(false);
    };

    return (
        <div>
            <Button variant="contained" size="medium" startIcon={<AddIcon />} onClick={() => createNewTodo()}>
                New Task
            </Button>
            {popupBox &&
            <div className='overlay'>
              <div className='popup'>
                <div className='content_popup'>
                  <h2>Create task</h2>
                    <label>Task Title</label>
                    <input id="task_name" value={name} placeholder='Enter task title' onChange={handleTaskNameChange}/>
                    <label>Description</label>
                    <textarea id="task_description" value={content} onChange={handleTaskDescriptionChange} placeholder='Add description' />
                    <div className="row_container">
                      <div className="column_item">
                        <span>Due date</span>
                        <CustomDatePicker onValueChange={handleDatePickerChange} />
                      </div>
                      <div className="column_item">
                        <span>Status</span>
                        <CustomDropdown onValueChange={handleDropdownChange} />
                      </div>
                    </div>
                    <span>Labels<Typography variant="caption" sx={{marginLeft: '24px'}}>You can edit the label type on setting</Typography></span>
                    <Stack direction="row" spacing={1}>
                    {labels.map((item) => (
                      <Chip
                        key={item.id}
                        color={item.color as any}
                        label={item.name}
                        onClick={() => setSelectedLabel({ id: item.id, name: item.name, color: item.color })}
                        variant={selectedLabel && selectedLabel.id === item.id ? "filled" : "outlined"}
                        clickable
                      />
                    ))}
                    </Stack>
                    <div className='button_function'>
                      <button id="cancel_button" 
                        onClick={() => {
                          setContent('');
                          setName('');
                          setSelectedLabel(undefined);
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