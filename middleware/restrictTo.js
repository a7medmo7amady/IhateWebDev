exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array like ['admin', 'moderator']
    // req.user.role is set by the protect middleware

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};