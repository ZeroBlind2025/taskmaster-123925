```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';
import { Logger } from './logger'; // Assume a logger module is available

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const markTaskAsComplete = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { taskId } = req.body;

  if (!taskId || typeof taskId !== 'string') {
    Logger.error('Invalid task ID provided');
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    await client.connect();
    const database = client.db('taskmaster');
    const tasksCollection = database.collection<Task>('tasks');

    const task = await tasksCollection.findOne({ _id: new ObjectId(taskId) });

    if (!task) {
      Logger.warn(`Task with ID ${taskId} not found`);
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.status === 'complete') {
      Logger.info(`Task with ID ${taskId} is already marked as complete`);
      return res.status(200).json({ message: 'Task is already complete' });
    }

    const updateResult = await tasksCollection.updateOne(
      { _id: new ObjectId(taskId) },
      {
        $set: {
          status: 'complete',
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      Logger.error(`Failed to update task with ID ${taskId}`);
      return res.status(500).json({ error: 'Failed to mark task as complete' });
    }

    Logger.info(`Task with ID ${taskId} marked as complete`);
    res.status(200).json({ message: 'Task marked as complete' });
  } catch (error) {
    Logger.error('Error marking task as complete', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
};

export default markTaskAsComplete;
```