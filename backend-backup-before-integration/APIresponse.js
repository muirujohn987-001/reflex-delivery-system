/**
 * The technical doc (section 8) fixes one JSON shape for every successful
 * response: { success, data, message }. This helper is the only place
 * that shape gets built, so nobody accidentally drifts from it.
 */
function sendSuccess(res, statusCode, data, message = 'Success') {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

module.exports = { sendSuccess };