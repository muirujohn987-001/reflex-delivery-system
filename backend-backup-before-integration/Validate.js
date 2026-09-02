
const ApiError = require('../utils/APIerror');

/**
 * validateBody(schema) checks req.body against a Zod schema BEFORE the
 * request reaches the controller/service. Bad input never touches the
 * database layer.
 *
 * On success it also replaces req.body with the *parsed* data, so trimming,
 * lower-casing the email, etc. happen in exactly one place.
 */
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || '(body)',
        message: issue.message,
      }));
      return next(new ApiError(400, 'Validation failed', details));
    }

    req.body = result.data;
    next();
  };
}

module.exports = { validateBody };