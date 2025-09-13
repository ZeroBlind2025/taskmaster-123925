```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>('/api/tasks');
        setTasks(response.data);
      } catch (err) {
        setError('Failed to load tasks');
      }
    };

    fetchTasks();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            {task.description && <p className="text-gray-700">{task.description}</p>}
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${task.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                {task.status}
              </span>
              {task.dueDate && (
                <span className="text-sm text-gray-500">
                  Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
```