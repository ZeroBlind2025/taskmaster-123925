```tsx
// components/TaskDetailView.tsx

import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { Task } from '../types';
import { fetchTaskById } from '../lib/api';

interface TaskDetailViewProps {
  task: Task | null;
  error?: string;
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task, error }) => {
  const router = useRouter();

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!task) {
    return <div className="text-gray-500">Loading task details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
      <p className="text-gray-700 mb-2"><strong>Status:</strong> {task.status}</p>
      {task.priority && <p className="text-gray-700 mb-2"><strong>Priority:</strong> {task.priority}</p>}
      {task.description && <p className="text-gray-700 mb-4">{task.description}</p>}
      {task.dueDate && (
        <p className="text-gray-700 mb-2">
          <strong>Due Date:</strong> {format(new Date(task.dueDate), 'PPP')}
        </p>
      )}
      <p className="text-gray-500 text-sm">
        Created At: {format(new Date(task.createdAt), 'PPPpp')}
      </p>
      <p className="text-gray-500 text-sm">
        Updated At: {format(new Date(task.updatedAt), 'PPPpp')}
      </p>
      <button
        onClick={() => router.back()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Back
      </button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  try {
    const task = await fetchTaskById(id as string);
    return { props: { task } };
  } catch (error) {
    return { props: { task: null, error: 'Failed to load task details.' } };
  }
};

export default TaskDetailView;
```

```tsx
// types/index.ts

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

```ts
// lib/api.ts

import { Task } from '../types';

export const fetchTaskById = async (id: string): Promise<Task> => {
  const response = await fetch(`/api/tasks/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }
  return response.json();
};
```