import React, { useState, useEffect } from "react";
import axios from 'axios';
import {Box, Grid, Button} from '@mui/material';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./components/SortableItem";
import Header from "./components/Header";

import "./style.css";
import TaskItem from "./components/TaskItem";

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

const App = () => {
  const [data, setData] = useState<List[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  // const [items, setItems] = useState<number[]>([]);

  // const filteredTasks = selectedFilter === "All" ? data : data.filter(task => task.priority === selectedFilter);

  useEffect(() => {
    // axios.get(`http://localhost:8080/tasks?limit=10&offset=0&filterByField=priority&filterByValue=1`) 
    axios.get(`http://localhost:8080/tasks?limit=10&offset=0`) 
      .then(response => {
        // const sortedData = response.data.sort((a: List, b: List) => a.display_order - b.display_order);
        setData(response.data);
        // setItems(sortedData.map((item: List) => item.display_order));
        // localStorage.setItem("userId", String(sortedData[1].user_id));
      })
      .catch(error => console.error('Error:', error));
  }, []);


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleSelectTask = (taskId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedTasks((prev) => [...prev, taskId]);
    } else {
      setSelectedTasks((prev) => prev.filter((id) => id !== taskId));
    }
  };

  // const handleDragEnd = (event: any) => {
  //   const { active, over } = event;
  //   if (!over || active.id === over.id) return;
  
  //   const oldIndex = data.findIndex(item => item.display_order === active.id);
  //   const newIndex = data.findIndex(item => item.display_order === over.id);
  
  //   if (oldIndex === -1 || newIndex === -1) return;
  
  //   const newData = arrayMove(data, oldIndex, newIndex);
  
  //   const updatedData = newData.map((item, index) => ({
  //     ...item,
  //     display_order: index + 1, 
  //   }));
  
  //   setData(updatedData);
  //   // setItems(updatedData.map(item => item.display_order));
  
  //   updateDisplayOrder(updatedData);
  // };  

  // const updateDisplayOrder = async (updatedItems: List[]) => {
  //   try {
  //     await axios.post("http://localhost:8080/task/update-order", {
  //       tasks: updatedItems.map(({ id, display_order }) => ({ id, display_order })),
  //     });
  //     console.log("Order updated successfully!");
  //   } catch (error) {
  //     console.error("Error updating order:", error);
  //   }
  // };

  return (
      <Box
        component="main"
        sx={(theme) => ({
          // flexGrow: 1,
          // overflow: 'auto',
        })}
      >
          <Header data={data} setData={setData} selectedTasks={selectedTasks} setSelectedTasks={setSelectedTasks} />
          {/* <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={data.map(item => item.display_order)} strategy={rectSortingStrategy}>
              <div className="grid-container">
                {data.map((item) => (
                  <SortableItem id={item.display_order} content={item} key={item.display_order} />
                ))}
              </div>
            </SortableContext>
          </DndContext> */}
          <div style={{ flex: 'row', marginTop: '30px' }} >
            {data.map((item) => (
              <TaskItem item={item} onSelect={handleSelectTask} />
            ))}
          </div>

        <Grid container spacing={1} sx={{ mt: 2 }}>
          <Grid item>
            <Button
              onClick={() => setSelectedFilter("All")}
              sx={{ textTransform: "none", color: 'black' }}
            >
              All Tasks
            </Button>
          </Grid>

          {/* Priority Filter Buttons */}
          {["High", "Medium", "Low"].map((filter) => (
            <Grid item key={filter}>
              <Button
                onClick={() => setSelectedFilter(filter)}
                sx={{ textTransform: "none", color: 'black'  }}
              >
                {filter} Priority
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
  );
};

export default App;
