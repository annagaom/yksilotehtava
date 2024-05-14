import path from 'path';
import express from 'express';
import api from './api/index.js';

import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1', api);
app.use('/uploads', express.static('uploads'));

app.use((req, res) => {
  res.status(404).json({ error: 'Reittiä ei löydy' });
});

app.use((err, req, res, next) => {
  console.error('Virhe:', err.message);
  res.status(500).json({ error: 'Jotain meni pieleen' });
});

export default app;
