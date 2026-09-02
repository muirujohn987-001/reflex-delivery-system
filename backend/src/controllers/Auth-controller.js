const authService = require('../services/Auth-service');
const { sendSuccess } = require('../utils/APIresponse');

/**
 * Controllers only: read the request, call the service, format the
 * response. No SQL, no business rules here — that's the service's job.
 */

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    return sendSuccess(res, 201, { user }, 'Account created');
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { token, user } = await authService.login(req.body);
    return sendSuccess(res, 200, { token, user }, 'Login successful');
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    // req.user.id comes from the verified JWT (set by the authenticate middleware)
    const user = await authService.getProfile(req.user.id);
    return sendSuccess(res, 200, { user }, 'Profile retrieved');
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };