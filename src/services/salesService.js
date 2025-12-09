import { Sale } from '../models/salesModel.js';

// Build Mongo query from incoming query params
function buildQuery(params) {
  const {
    search,
    region,
    gender,
    category,
    tags,
    paymentMethod,
    ageMin,
    ageMax,
    dateFrom,
    dateTo
  } = params || {};

  const query = {};

  // Search on Customer Name + Phone Number
  if (search && String(search).trim()) {
    const regex = new RegExp(String(search).trim(), 'i');
    query.$or = [
      { 'Customer Name': regex },
      { 'Phone Number': regex }
    ];
  }

  const addInFilter = (field, value) => {
    if (!value) return;
    const list = String(value)
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);
    if (list.length) query[field] = { $in: list };
  };

  addInFilter('Customer Region', region);
  addInFilter('Gender', gender);
  addInFilter('Product Category', category);
  addInFilter('Tags', tags);
  addInFilter('Payment Method', paymentMethod);

  // Age range
  const ageQ = {};
  if (ageMin) ageQ.$gte = Number(ageMin);
  if (ageMax) ageQ.$lte = Number(ageMax);
  if (Object.keys(ageQ).length) query.Age = ageQ;

  // Date range
  const dateQ = {};
  if (dateFrom) dateQ.$gte = new Date(dateFrom);
  if (dateTo) {
    const d = new Date(dateTo);
    d.setHours(23,59,59,999);
    dateQ.$lte = d;
  }
  if (Object.keys(dateQ).length) query.Date = dateQ;

  return query;
}

function buildSort(sortBy = 'date', sortOrder = 'desc') {
  const dir = sortOrder === 'asc' ? 1 : -1;
  switch (sortBy) {
    case 'quantity':
      return { Quantity: dir };
    case 'customerName':
      return { 'Customer Name': dir };
    case 'date':
    default:
      return { Date: dir };
  }
}

/**
 * Get paginated sales list from MongoDB
 * @param {object} params - query params from req.query
 * @returns { Promise<{data: Array, meta: object}> }
 */
export async function getSalesList(params = {}) {
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const limit = Number(params.limit) > 0 ? Number(params.limit) : 10;
  const skip = (page - 1) * limit;

  const query = buildQuery(params);
  const sort = buildSort(params.sortBy, params.sortOrder);

  const [items, total] = await Promise.all([
    Sale.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Sale.countDocuments(query)
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const meta = {
    page,
    limit,
    totalItems: total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };

  return { data: items, meta };
}
