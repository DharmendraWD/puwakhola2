const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  let token;

  // console.log('Cookies received:', req.cookies); // Debug log
  // console.log('Authorization header:', req.headers.authorization); // Debug log

  // 1. Check Authorization header first (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    // console.log('Token from Authorization header:', token ? 'Present' : 'Missing');
  }

  // 2. If no header, check cookie (from browser)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
    // console.log('Token from cookie:', token ? 'Present' : 'Missing');
  }

  // 3. If still no token, return 401
  if (!token) {
    console.log('No token found anywhere');
    return res.status(401).json({
      success: false,
      message: "Not authorized, token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // console.log('Token verified successfully for user:', decoded.email);
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

module.exports = {
  isAuthenticated
};