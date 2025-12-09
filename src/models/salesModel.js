// backend/src/models/salesModel.js
import mongoose from 'mongoose';

const salesSchema = new mongoose.Schema(
  {
    Date: Date,
    'Customer ID': String,
    'Customer Name': String,
    'Phone Number': String,
    'Customer Region': String,
    Gender: String,
    Age: Number,
    'Product Name': String,
    'Product Category': String,
    Quantity: Number,
    FinalAmount: Number,
    'Payment Method': String,
    'Order Status': String,
    'Delivery Type': String,
    Tags: [String]
  },
  { collection: 'sales' }
);

export const Sale = mongoose.model('Sale', salesSchema);
