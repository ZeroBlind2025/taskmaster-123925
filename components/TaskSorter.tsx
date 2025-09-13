```tsx
import React, { useState } from 'react';
import { Task } from '../types';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';

interface TaskSorterProps {
  tasks: Task[];
  onSort: (sortedTasks: Task[]) => void;
}

const TaskSorter: React.FC<TaskSorterProps> = ({ tasks, onSort }) => {
  const [sortField, setSortField] = useState<keyof Task>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Task) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);

    const sortedTasks = [...tasks].sort((a, b) => {
      if (a[field] < b[field]) return isAsc ? -1 : 1;
      if (a[field] > b[field]) return isAsc ? 1 : -1;
      return 0;
    });

    onSort(sortedTasks);
  };

  return (
    <div className="flex flex-col space-y-2 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold text-gray-800">Sort Tasks</h2>
      <div className="flex flex-wrap gap-2">
        {['title', 'status', 'priority', 'dueDate', 'createdAt', 'updatedAt'].map((field) => (
          <button
            key={field}
            onClick={() => handleSort(field as keyof Task)}
            className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={`Sort by ${field}`}
          >
            {field}
            {sortField === field ? (
              sortOrder === 'asc' ? (
                <ChevronUpIcon className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 ml-1" />
              )
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskSorter;
```

```tsx
// types.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```