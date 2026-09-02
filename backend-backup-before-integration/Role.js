const ApiError = require('../utils/APIerror');

/**
 * requireRole() answers "is this user ALLOWED to do this?"
 * Must run AFTER authenticate() on the route, e.g.:
 *
 *   router.post('/assign', authenticate, requireRole('DISPATCHER'), controller.assign);
 *
 * - No req.user at all -> authenticate() was skipped or the token was
 *   missing; that's a 401, not a 403.
 * - req.user exists but role isn't in the allowed list -> 403.
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    return next();
  };
}

module.exports = { requireRole };