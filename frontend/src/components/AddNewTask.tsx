import React, { useState } from "react";
import CustomDatePicker from "./CustomDatePicker";
import CustomDropdown from "./CustomDropdown";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

interface List {
    id?: number,
    task_name: string,
    content: string,
    due_date: any,
    display_order: number,
    status: number,
  }

const AddNewTask = () => {
    const [popupBox, showPopupBox] = useState(false);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState('');

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
          display_order: 1,
          status: selectedStatus,
        }
        // axios.post('http://localhost:9000/add', {
        //   content: content,
        //   due_date: null,
        //   status: 0,
        //   display_order: 1,
        // })
        // .then(function (response) {
        //   console.log(response);
        // })
        // .catch(function (error) {
        //   console.log(error);
        // });
    
        // setData((prev) => [...prev, taskData]);
        // setContent('');
        // setName('');
        // showPopupBox(false);
        console.log(taskData);
      };

      const handleAddLabel = () => {
        
      }
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
                    <span>Labels</span>
                    <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
                      <Chip label="Work" clickable  />
                      <Chip label="Project"  clickable />
                      <Chip label="+ Add Label" variant="outlined" onClick={handleAddLabel} clickable />
                    </Stack>
                    <div className='button_function'>
                      <button id="cancel_button" onClick={() => showPopupBox(false)}>Cancel</button>
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