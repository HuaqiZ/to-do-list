import React, { useState, useEffect } from "react";
import axios from 'axios';
import Box from '@mui/material/Box';
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

const App = () => {
  const [data, setData] = useState<List[]>([]);
  // const [items, setItems] = useState<number[]>([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/tasks?limit=10&offset=0&filterByField=status&filterByValue=1`) 
      .then(response => {
        const sortedData = response.data.sort((a: List, b: List) => a.display_order - b.display_order);
        setData(sortedData);
        // setItems(sortedData.map((item: List) => item.display_order));
        // localStorage.setItem("userId", String(sortedData[1].user_id));
      })
      .catch(error => console.error('Error:', error));
  }, []);


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    const oldIndex = data.findIndex(item => item.display_order === active.id);
    const newIndex = data.findIndex(item => item.display_order === over.id);
  
    if (oldIndex === -1 || newIndex === -1) return;
  
    const newData = arrayMove(data, oldIndex, newIndex);
  
    const updatedData = newData.map((item, index) => ({
      ...item,
      display_order: index + 1, 
    }));
  
    setData(updatedData);
    // setItems(updatedData.map(item => item.display_order));
  
    updateDisplayOrder(updatedData);
  };  

  const updateDisplayOrder = async (updatedItems: List[]) => {
    try {
      await axios.post("http://localhost:8080/task/update-order", {
        tasks: updatedItems.map(({ id, display_order }) => ({ id, display_order })),
      });
      console.log("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
      <Box
        component="main"
        sx={(theme) => ({
          // flexGrow: 1,
          // overflow: 'auto',
        })}
      >
          <Header data={data} setData={setData} />
          <DndContext
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
          </DndContext>
      </Box>
  );
};

export default App;
