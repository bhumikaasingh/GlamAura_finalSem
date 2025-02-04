const csrfProtection = (req, res, next) => {
    if (["POST", "PUT", "DELETE"].indexOf(req.method) !== -1) {
      const csrfToken = req.headers["x-csrf-token"]
      if (!csrfToken || csrfToken !== req.csrfToken()) {
        return res.status(403).json({ message: "Invalid CSRF token" })
      }
    }
    next()
  }
  
  module.exports = csrfProtection
  
  