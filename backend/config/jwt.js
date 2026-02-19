module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'habitta-default-secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d'
};
