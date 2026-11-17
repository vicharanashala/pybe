// Gates every /api/scenario-gen/* route that touches provider keys, drafts,
// or publishing. One shared secret, set by the mentor in server/.env — no
// user accounts, no session system, matching the rest of this prototype's
// zero-auth approach everywhere except this one feature.

function requireAdminToken(req, res, next) {
  const expected = process.env.MENTOR_ADMIN_TOKEN;

  if (!expected || expected === 'change-me') {
    return res.status(500).json({
      message: 'MENTOR_ADMIN_TOKEN is not configured on the server. Set it in server/.env before using the Scenario Generator.'
    });
  }

  const provided = req.header('x-admin-token');
  if (!provided || provided !== expected) {
    return res.status(401).json({ message: 'Invalid or missing admin token.' });
  }

  next();
}

module.exports = requireAdminToken;
