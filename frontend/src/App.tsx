import React, { useState, useEffect } from "react";
import axios from 'axios';
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
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "./style.css"; // Custom CSS for styling the grid

interface List {
  task_name: string,
  content: string,
  due_date: any,
  display_order: number,
  status: number,
}

const SortableItem = ({ id }: { id: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="sortable-item"
      {...attributes}
      {...listeners}
    >
      {id}
    </div>
  );
};

const App = () => {
  const [items, setItems] = useState(["1", "2", "3", "4", "5", "6", "7"]);
  const [data, setData] = useState<List[]>([]);
  const [popupBox, showPopupBox] = useState(false);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    axios.get('http://localhost:9000') // Backend URL
      .then(response => setData(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  const addNewToDo = () => {
    const taskData: List = {
      task_name: name,
      content,
      due_date: null,
      display_order: 1,
      status: 1,
    }
    axios.post('http://localhost:9000/add', {
      content: content,
      due_date: null,
      status: 0,
      display_order: 1,
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
    showPopupBox(false);
  };

  const createNewTodo =() => {
    showPopupBox(true);
  }

  const handleTaskNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleTaskDescriptionChange = (event: any) => {
    setContent(event.target.value);
  }

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
    <div>
      <button id="add_button" onClick={() => createNewTodo()}>Add New</button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <div className="grid-container">
            {items.map((id) => (
              <SortableItem key={id} id={id} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {popupBox &&  
            <div className='overlay'>
              <div className='popup'>
                <div className='content_popup'>
                  <h2>Create task</h2>
                    <input id="task_name" value={name} placeholder='Task name' onChange={handleTaskNameChange}/>
                    <textarea id="task_description" value={content} onChange={handleTaskDescriptionChange} placeholder='Task description' />
                    <div className='button_function'>
                      <button id="cancel_button" onClick={() => showPopupBox(false)}>Cancel</button>
                      <button onClick={() => addNewToDo()}>Create task</button>
                    </div>
                </div>

                <div className='sideBar'>
                  <span>Type</span>
                  {/* dropdown list */}
                  <span>Status</span>
                  {/* dropdown list */}
                  <span>Due date</span>
                  {/* calender */}
                </div>
              </div>

              
            </div>
          }
    </div>
  );
};

export default App;
