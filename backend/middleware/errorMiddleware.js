/**
 * 404 Handler — route not found
 */
const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

/**
 * Global Error Handler
 * Express automatically calls this when next(error) called
 * OR when asyncHandler catches an error
 */
const errorHandler = (err, req, res, next) => {
    // Sometimes Express gives 200 even on error — fix it
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        statusCode = 404;
        err.message = 'Resource not found (invalid ID)';
    }

    // Mongoose duplicate key (unique field)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        err.message = `${field} already exists`;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        err.message = 'Invalid token';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        err.message = 'Token expired, please login again';
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        err.message = Object.values(err.errors).map(e => e.message).join(', ');
    }

    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };