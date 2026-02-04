const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
   const token = req.cookies.token; 

     if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Not authenticated",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store user data in request
    next();
  } catch (error) {
    return res.status(403).json({
      success:true,
      message: "Invalid or expired token",
       });
  }
};
