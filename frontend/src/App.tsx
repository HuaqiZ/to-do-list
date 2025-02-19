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
}

const App = () => {
  const [items, setItems] = useState(["1", "2", "3", "4", "5", "6", "7"]);
  const [data, setData] = useState<List[]>([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/tasks?limit=10&offset=0&filterByField=status&filterByValue=1`) 
      .then(response => setData(response.data))
      .catch(error => console.error('Error:', error));
  }, []);


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
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
          <Header />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={rectSortingStrategy}>
              <div className="grid-container">
                {data.map((item) => (
                  <SortableItem id={item.id ?? 0} content={item} key={item.id} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
      </Box>
  );
};

export default App;
