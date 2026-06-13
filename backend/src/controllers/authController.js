const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, plan: user.plan },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );

    const user = { id: result.insertId, email, plan: 'free' };
    const token = generateToken(user);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: user.id, name, email, plan: 'free' }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan }
    });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, plan, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    next(err);
  }
};
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar, default_major, default_experience, email_notifications } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check email not taken by another user
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, req.user.id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    await db.query(
      'UPDATE users SET name = ?, email = ?, avatar = ?, default_major = ?, default_experience = ?, email_notifications = ? WHERE id = ?',
      [name, email, avatar || 'default', default_major || null, default_experience || null, email_notifications ?? true, req.user.id]
    );

    const [rows] = await db.query(
      'SELECT id, name, email, plan, avatar, default_major, default_experience, email_notifications, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ message: 'Profile updated successfully', user: rows[0] });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ message: 'Both fields are required' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = rows[0];

    const match = await bcrypt.compare(current_password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    if (current_password === new_password) {
      return res.status(400).json({ message: 'New password must differ from current password' });
    }

    const hashed = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete account' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    await db.query('DELETE FROM users WHERE id = ?', [req.user.id]);

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
};


module.exports = { register, login, me, updateProfile, changePassword, deleteAccount };