const { auth } = require('express-oauth2-jwt-bearer');

/**
 * Authorization middleware.
 * When used, the Access Token must exist and be verified against
 * the Auth0 JSON Web Key Set.
 */
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE, // The Identifier of your API in Auth0
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`, // Your Auth0 Domain
  tokenSigningAlg: 'RS256'
});

module.exports = { checkJwt };