const { auth } = require('express-oauth2-jwt-bearer');

let checkJwt;

if (process.env.NODE_ENV === "test") {
  // Disable auth in test environment
  checkJwt = (req, res, next) => next();
} else {
  checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
    tokenSigningAlg: "RS256",
  });
}
module.exports = checkJwt ;