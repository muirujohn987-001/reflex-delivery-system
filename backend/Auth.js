const ApiError = require('../utils/APIerror');
const { verifyAccessToken } = require('../utils/JWT');

/**
 * authenticate() answers "who is this user?"
 *
 * Expects: Authorization: Bearer <token>
 * On success it attaches req.user = { id, role, email } and calls next().
 * On any problem it throws a 401 — this is the ONLY middleware in the
 * whole app allowed to return 401, per the contract Ben owns.
 */
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Missing or malformed authentication token'));
  }

  try {
    const payload = verifyAccessToken(token);
    // req.user comes from the *signed* token, never from the request body —
    // a client cannot forge their own role by editing a form field.
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
    };
    return next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired authentication token'));
  }
}

module.exports = { authenticate };