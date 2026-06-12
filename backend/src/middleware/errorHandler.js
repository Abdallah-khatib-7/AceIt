module.exports = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({ message: 'Something went wrong' });
  }

  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack
  });
};