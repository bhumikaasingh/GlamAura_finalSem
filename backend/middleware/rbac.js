const { verifySession } = require("../utils/sessionManager")

const rbac = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    const decodedToken = verifySession(token)
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" })
    }

    if (!allowedRoles.includes(decodedToken.role)) {
      return res.status(403).json({ message: "Access denied" })
    }

    req.user = decodedToken
    next()
  }
}

module.exports = rbac

