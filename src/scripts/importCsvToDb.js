// backend/src/scripts/importCsvToDb.js
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import { connectDB } from '../utils/db.js';
import { Sale } from '../models/salesModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importCsv() {
  const filePath = path.join(__dirname, '..', 'data', 'sales.csv');
  console.log('📄 Importing CSV from:', filePath);

  await connectDB(process.env.MONGODB_URI);

  console.log('🧹 Clearing existing sales collection (if any)...');
  await Sale.deleteMany({});

  const buffer = [];
  let count = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        buffer.push({
          Date: row.Date ? new Date(row.Date) : null,
          'Customer ID': row['Customer ID'],
          'Customer Name': row['Customer Name'],
          'Phone Number': row['Phone Number'],
          'Customer Region': row['Customer Region'],
          Gender: row['Gender'],
          Age: row.Age ? Number(row.Age) : undefined,
          'Product Name': row['Product Name'],
          'Product Category': row['Product Category'],
          Quantity: row.Quantity ? Number(row.Quantity) : 0,
          FinalAmount: row.FinalAmount ? Number(row.FinalAmount) : 0,
          'Payment Method': row['Payment Method'],
          'Order Status': row['Order Status'],
          'Delivery Type': row['Delivery Type'],
          Tags: row.Tags ? row.Tags.split(',').map(t => t.trim()).filter(Boolean) : []
        });

        if (buffer.length >= 5000) {
          const batch = buffer.splice(0, buffer.length);
          Sale.insertMany(batch)
            .then(() => {
              count += batch.length;
              console.log(`Inserted ${count} records...`);
            })
            .catch(reject);
        }
      })
      .on('end', async () => {
        if (buffer.length > 0) {
          await Sale.insertMany(buffer);
          count += buffer.length;
        }
        console.log(`✅ Import complete. Total inserted: ${count}`);
        resolve();
      })
      .on('error', reject);
  });
}

importCsv()
  .then(() => {
    console.log('🎉 Done');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Import error:', err);
    process.exit(1);
  });
