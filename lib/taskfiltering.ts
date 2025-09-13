```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db } from 'mongodb';
import { z } from 'zod';
import { Logger } from './logger'; // Assume a logger module is available

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

const taskFilterSchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().optional().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
});

async function connectToDatabase(): Promise<Db> {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db('TaskMaster');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const logger = new Logger();
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const queryValidation = taskFilterSchema.safeParse(req.query);
    if (!queryValidation.success) {
      logger.error('Validation Error', queryValidation.error.errors);
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    const { status, priority, dueDate } = queryValidation.data;
    const filter: any = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };

    const db = await connectToDatabase();
    const tasks = await db.collection('tasks').find(filter).toArray();

    res.status(200).json(tasks);
  } catch (error) {
    logger.error('Internal Server Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
```