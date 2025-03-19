import React, { useState, useEffect } from "react";
import axios from 'axios';
import {Box, Grid, Button} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
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

const priorityMap: Record<string, number> = {
  High: 1,
  Medium: 2,
  Low: 0,
};

const App = () => {
  const [data, setData] = useState<List[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    axios.get(`http://localhost:8080/tasks?limit=${rowsPerPage}&offset=${page * rowsPerPage}`) 
      .then(response => {
        setData(response.data);
      })
      .catch(error => console.error('Error:', error));
  }, [page, rowsPerPage]);


  // const sensors = useSensors(
  //   useSensor(PointerSensor),
  //   useSensor(KeyboardSensor)
  // );

  const handleSelectTask = (taskId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedTasks((prev) => [...prev, taskId]);
    } else {
      setSelectedTasks((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilter = async (filter: string) => {
    try {
      const url = priorityMap[filter] !== undefined
      ? `http://localhost:8080/tasks?filterByField=priority&filterByValue=${priorityMap[filter]}`
      : 'http://localhost:8080/tasks?limit=10&offset=0';
      
      const response = await axios.get(url);
      setData(response.data);
      setSelectedFilter(filter);
    } catch(err) {
      console.error('Error fetching tasks:', err);
    }
  }
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

        <Grid container spacing={1} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Grid item sx={{ display :' flex', alignContent: 'center', gap: 1.5}}>
            <Button
              sx={{
                textTransform: "none",
                color: 'black',
                bgcolor: selectedFilter === "All" ? '#e5e7eb' : 'transparent',
                '&:hover': {
                  bgcolor: selectedFilter === "All" ? '#b7b9bc' : 'rgba(0, 0, 0, 0.04)',
                },
                paddingX: '20px',
                paddingY: '15px',
                height: "30px"
              }}
              onClick={() => handleFilter("All")}
            >
              All Tasks
            </Button>
          
          {["High", "Medium", "Low"].map((filter) => (
              <Button
                sx={{
                  textTransform: "none",
                  color: 'black',
                  bgcolor: selectedFilter === filter ? '#e5e7eb' : 'transparent',
                  '&:hover': {
                    bgcolor: selectedFilter === filter ? '#b7b9bc' : 'rgba(0, 0, 0, 0.04)',
                  },
                  paddingX: '20px',
                  paddingY: '15px',
                  height: "30px"
                }}
                onClick={() => handleFilter(filter)}
              >
                {filter} Priority
              </Button>
          ))}
          </Grid>

        <TablePagination
          component="div"
          count={100}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Grid>
      </Box>
  );
};

export default App;
