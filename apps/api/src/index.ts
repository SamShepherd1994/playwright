import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { db, pool, runMigrations } from './db.js';
import { items } from './schema.js';
import { desc } from 'drizzle-orm';

const app = express();
const port = Number(process.env.PORT ?? 4000);

const corsOrigin = process.env.API_CORS_ORIGIN ?? 'http://localhost:5173';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.get('/api/items', async (_req, res) => {
  try {
    const result = await db.select().from(items).orderBy(desc(items.id));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/items', async (req, res) => {
  const name = String(req.body?.name ?? '').trim();
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const inserted = await db.insert(items).values({ name }).returning();
    res.status(201).json(inserted[0]);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

async function start() {
  await runMigrations();
  app.listen(port, () => {
    console.log(`[api] listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start API', err);
  process.exit(1);
});
