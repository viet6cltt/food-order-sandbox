module.exports = function pagination(defaultLimit = 10, maxLimit = 50) {
  return (req, res, next) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || defaultLimit;

    if (limit > maxLimit) limit = maxLimit;

    if (page < 1) page = 1;

    const skip = (page - 1) * limit;

    req.pagination = { page, limit, skip };
    next();
  };
};