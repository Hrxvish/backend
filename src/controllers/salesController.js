import { getSalesList } from '../services/salesService.js';

export async function getSales(req, res) {
  try {
    const { data, meta } = await getSalesList(req.query);
    res.json({ success: true, data, meta });
  } catch (err) {
    console.error('getSales error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales data'
    });
  }
}
