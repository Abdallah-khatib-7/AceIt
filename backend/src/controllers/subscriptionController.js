const db = require('../db/database');

const PLANS = {
  basic: {
    name: 'Basic',
    price: 9.99,
    features: {
      cv_reviews: 5,
      interviews: 5,
      quizzes: 20,
      pdf_reports: false,
      priority_support: false
    }
  },
  pro: {
    name: 'Pro',
    price: 19.99,
    features: {
      cv_reviews: 'unlimited',
      interviews: 'unlimited',
      quizzes: 'unlimited',
      pdf_reports: true,
      priority_support: true
    }
  }
};

const getPlans = async (req, res, next) => {
  try {
    res.json({ plans: PLANS });
  } catch (err) {
    next(err);
  }
};

const getCurrentSubscription = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM subscriptions 
       WHERE user_id = ? AND status = 'active' 
       ORDER BY started_at DESC LIMIT 1`,
      [req.user.id]
    );

    const [user] = await db.query(
      'SELECT plan FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({
      current_plan: user[0].plan,
      subscription: rows.length > 0 ? rows[0] : null
    });
  } catch (err) {
    next(err);
  }
};

const upgradePlan = async (req, res, next) => {
  try {
    const { plan, payment_ref } = req.body;

    if (!plan || !PLANS[plan]) {
      return res.status(400).json({ message: 'Invalid plan. Choose basic or pro.' });
    }

    if (req.user.plan === plan) {
      return res.status(400).json({ message: `You are already on the ${plan} plan.` });
    }

    // Set expiry to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Expire any existing active subscription
    await db.query(
      `UPDATE subscriptions SET status = 'expired' WHERE user_id = ? AND status = 'active'`,
      [req.user.id]
    );

    // Create new subscription
    await db.query(
      `INSERT INTO subscriptions (user_id, plan, status, expires_at, payment_ref) 
       VALUES (?, ?, 'active', ?, ?)`,
      [req.user.id, plan, expiresAt, payment_ref || `MOCK-${Date.now()}`]
    );

    // Update user plan
    await db.query(
      'UPDATE users SET plan = ? WHERE id = ?',
      [plan, req.user.id]
    );

    res.json({
      message: `Successfully upgraded to ${PLANS[plan].name} plan`,
      plan,
      expires_at: expiresAt,
      features: PLANS[plan].features
    });
  } catch (err) {
    next(err);
  }
};

const cancelSubscription = async (req, res, next) => {
  try {
    if (req.user.plan === 'free') {
      return res.status(400).json({ message: 'You are already on the free plan.' });
    }

    await db.query(
      `UPDATE subscriptions SET status = 'cancelled' WHERE user_id = ? AND status = 'active'`,
      [req.user.id]
    );

    await db.query(
      'UPDATE users SET plan = ? WHERE id = ?',
      ['free', req.user.id]
    );

    res.json({ message: 'Subscription cancelled. You have been moved to the free plan.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPlans, getCurrentSubscription, upgradePlan, cancelSubscription };