import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        'tasks',
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );
      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        update_at: new Date(),
      };

      database.insert('tasks', task);

      return res.writeHead(201).end();
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const existingTask = database.select('tasks', { id });

      if (existingTask.length === 0) {
        return res.writeHead(404).end('Tarefa não encontrada');
      }

      const created_at = existingTask[0].created_at;

      const updatedTask = {
        title,
        description,
        created_at,
        updated_at: new Date(),
      };

      database.update('tasks', id, updatedTask);

      return res.writeHead(204).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      const existingTask = database.select('tasks', { id });

      if (existingTask.length === 0) {
        return res.writeHead(404).end('Tarefa não encontrada');
      }

      existingTask[0].completed_at = new Date();

      database.update('tasks', id, existingTask[0]);

      return res.writeHead(204).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const existingTask = database.select('tasks', { id });

      if (existingTask.length === 0) {
        return res.writeHead(404).end('Tarefa não encontrada');
      }

      database.delete('tasks', id);

      return res.writeHead(204).end();
    },
  },
];
