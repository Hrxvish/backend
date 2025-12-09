function parseArrayParam(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseNumber(value, fallback = null) {
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function parseQuery(query) {
  const search = (query.search || '').trim().toLowerCase();

  const regions = parseArrayParam(query.region);
  const genders = parseArrayParam(query.gender);
  const categories = parseArrayParam(query.category);
  const tags = parseArrayParam(query.tags);
  const paymentMethods = parseArrayParam(query.paymentMethod);

  let ageMin = parseNumber(query.ageMin);
  let ageMax = parseNumber(query.ageMax);

  if (ageMin != null && ageMax != null && ageMin > ageMax) {
    // handle invalid numeric range gracefully – swap
    [ageMin, ageMax] = [ageMax, ageMin];
  }

  const dateFrom = parseDate(query.dateFrom);
  const dateTo = parseDate(query.dateTo);

  const sortBy = query.sortBy || 'date';
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

  const page = parseNumber(query.page, 1);
  const limit = parseNumber(query.limit, 10);

  return {
    search,
    regions,
    genders,
    categories,
    tags,
    paymentMethods,
    ageMin,
    ageMax,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
    page: page < 1 ? 1 : page,
    limit: limit || 10
  };
}

module.exports = { parseQuery };
