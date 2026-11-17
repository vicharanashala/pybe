/**
 * Custom application error with an HTTP status code.
 */
class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message.
   * @param {number} statusCode - HTTP status code (default 500).
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Express global error-handling middleware.
 * Must have 4 parameters so Express recognises it as an error handler.
 */
function globalErrorHandler(err, _req, res, _next) {
  // Log full stack in development, message-only in production
  if (process.env.NODE_ENV !== 'production') {
    console.error('[ERROR]', err.stack || err.message);
  } else {
    console.error('[ERROR]', err.message);
  }

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Prisma known-request errors (e.g. unique constraint, not found)
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'The requested record was not found.',
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: 'A record with that unique value already exists.',
    });
  }

  return res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = { AppError, globalErrorHandler };
