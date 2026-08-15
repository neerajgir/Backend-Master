export const validateSession = (req, res, next) => {
    // 1. Check if the session and userId exist
    if (req.session && req.session.userId) {
        // CRUCIAL: You must call next() to pass control to the controller
        return next(); 
    }

    // 2. If no session, send an error response immediately so it doesn't hang
    return res.status(401).json({
        success: false,
        message: "Unauthorized access. Please log in first."
    });
};