import * as React from 'react';
import AddNewTask from "./AddNewTask";
import EditType from "./EditType";
import { Stack, Button } from '@mui/material';

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

export default function Header({data, setData, selectedTasks, setSelectedTasks }: {data: List[], setData: React.Dispatch<React.SetStateAction<List[]>>, selectedTasks: number[], setSelectedTasks: React.Dispatch<React.SetStateAction<number[]>>}) {
  const handleDeleteTasks = async () => {
    try {
      await Promise.all(
        selectedTasks.map((taskId) =>
          fetch(`http://localhost:8080/tasks/${taskId}`, {
            method: 'DELETE',
          })
        )
      );
      alert('Tasks deleted');
      setSelectedTasks([]);
      // 刷新或更新数据
    } catch (error) {
      console.error('Failed to delete tasks:', error);
    }
  };

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
        px: 3,
      }}
      spacing={2}
    >
      <Stack direction="row" spacing={2} alignItems="center">
      <h3>My Tasks</h3>
      {selectedTasks.length > 0 && (
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteTasks}
        >
          Delete {selectedTasks.length} Task{selectedTasks.length > 1 ? 's' : ''}
        </Button>
      )}
      </Stack>
      <AddNewTask setData={setData} />
      {/* <EditType /> */}
    </Stack>
  );
}
