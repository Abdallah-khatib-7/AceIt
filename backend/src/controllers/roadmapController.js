const db = require('../db/database');

const getRoadmap = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM roadmap_items 
       WHERE user_id = ? 
       ORDER BY FIELD(priority, 'high', 'medium', 'low'), created_at DESC`,
      [req.user.id]
    );

    const grouped = {
      high: rows.filter((r) => r.priority === 'high'),
      medium: rows.filter((r) => r.priority === 'medium'),
      low: rows.filter((r) => r.priority === 'low')
    };

    res.json({ roadmap: grouped, total: rows.length });
  } catch (err) {
    next(err);
  }
};

const markDone = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM roadmap_items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Roadmap item not found' });
    }

    await db.query(
      'UPDATE roadmap_items SET is_done = ? WHERE id = ?',
      [!rows[0].is_done, req.params.id]
    );

    res.json({ message: rows[0].is_done ? 'Marked as pending' : 'Marked as done' });
  } catch (err) {
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id FROM roadmap_items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Roadmap item not found' });
    }

    await db.query('DELETE FROM roadmap_items WHERE id = ?', [req.params.id]);

    res.json({ message: 'Item removed from roadmap' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRoadmap, markDone, deleteItem };