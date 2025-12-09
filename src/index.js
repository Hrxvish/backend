import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './utils/db.js';
import salesRoutes from './routes/salesRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', salesRoutes);

async function start() {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}

start();
