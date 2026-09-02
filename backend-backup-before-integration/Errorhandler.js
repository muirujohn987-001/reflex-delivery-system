const ApiError = require('../utils/APIerror');

/**
 * The ONE place in the whole app that turns an error into an HTTP
 * response. Must be registered LAST in app.js, after every route:
 *
 *   app.use('/api/auth', authRoutes);
 *   app.use('/api/deliveries', deliveryRoutes);   // Adineke's routes
 *   ...
 *   app.use(errorHandler);                        // always last
 *
 * Rule from the security section of the docs: never leak stack traces,
 * raw SQL, or secrets to the client.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { errors: err.details } : {}),
    });
  }

  // Postgres unique_violation — most commonly a duplicate email on register.
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'A record with these details already exists',
    });
  }

  // Anything else is unexpected: log the full error for developers,
  // but only ever send a generic message to the client.
  console.error('[unhandled error]', err);
  return res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again.',
  });
}

/** Optional 404 handler for routes that don't exist at all. Mount just
 *  before errorHandler: app.use(notFound); app.use(errorHandler); */
function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = { errorHandler, notFound };