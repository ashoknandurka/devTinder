const adminAuth = (req, res, next) => {
  console.log("admin middleware is called");
  const token = "xyz";
  const isAuthenticated = token === "xyz";

  if (!isAuthenticated) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

const userAuth = (req, res, next) => {
  console.log("user middleware is called");
  const token = "xyz";
  const isAuthenticated = token === "xyz";

  if (!isAuthenticated) {
    return res.status(401).send("Unauthorized");
  }
  next();
};
module.exports = { adminAuth, userAuth };
