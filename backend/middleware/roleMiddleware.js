// middleware/roleMiddleware.js
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.toUpperCase?.(); // safe check

    if (!userRole || !allowedRoles.map(r => r.toUpperCase()).includes(userRole)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }

    console.log(req.user);
    console.log(allowedRoles);
    next();
  };
};

module.exports = authorizeRoles;
