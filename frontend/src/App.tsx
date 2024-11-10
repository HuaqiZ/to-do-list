// src/App.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface List {
  content: string,
  date: number,
  display_order: number,
  status: true,
}

const App: React.FC = () => {
  const [data, setData] = useState<List[]>([]);
  const [popupBox, showPopupBox] = useState(false);
  const [lists, setLists] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [completedList, setCompletedList] = useState<string[]>([]);

  useEffect(() => {
    axios.get('http://localhost:9000') // Backend URL
      .then(response => setData(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  const createNewTodo =() => {
    showPopupBox(true);
  }

  const handleTextareaChange = (event: any) => {
    setContent(event.target.value);
  };

  const addNewToDo = () => {
    axios.post('http://localhost:9000/add', {
      content: content,
      date: null,
      status: true,
      display_order: 1,
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

    setLists((prev) => [...prev, content]);
    setContent('');
    showPopupBox(false);
  };

  const changeToCompleted = (listContent: string) => {
    setCompletedList((prev) => [...prev, listContent]);
    setLists((prev) => prev.filter((item) => item !== listContent));
  }
   
  return (
    <div>
      <div className='nav_bar'>
        <button id="add_button" onClick={() => createNewTodo()}>Add New</button>
      </div>

      <div className='container'>
        <div>
          <h1>Active Lists</h1>
          <div className='lists'>
              {data.map((item, index) => (
                <div className='task' key={index}>
                  <input type="checkbox" onClick={() => changeToCompleted(item.content)}/>
                  {item.content}
                </div>
              ))}
          </div>
        </div>

        {/* <div>
          <h1>Completed Lists</h1>
          <div className='lists'>
          {completedList.map((item, index) => (
            <div className='task' key={index}>
              {item}
            </div>
          ))}
          </div>
        </div> */}

        {popupBox &&  
            <div className='overlay'>
              <div className='popup'>
                <div className='content_popup'>
                  <h2>Create task</h2>
                    <input id="task_name" placeholder='Task name' />
                    <textarea id="task_description" value={content} onChange={handleTextareaChange} placeholder='Task description' />
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
    </div>
  );
};

export default App;
