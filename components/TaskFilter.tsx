```tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

type TaskFilterProps = {
  onFilterChange: (filters: TaskFilters) => void;
};

type TaskFilters = {
  status?: string;
  priority?: string;
  dueDate?: string;
};

const TaskFilter: React.FC<TaskFilterProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const filters: TaskFilters = {
      ...(status && { status }),
      ...(priority && { priority }),
      ...(dueDate && { dueDate }),
    };
    onFilterChange(filters);
  }, [status, priority, dueDate, onFilterChange]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Filter Tasks</h2>
      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={handleStatusChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={handlePriorityChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={handleDueDateChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

export default TaskFilter;
```