const token = await signToken(
  claims,
  demoJwtConfig.secret,
  demoJwtConfig.algorithm,
  demoJwtConfig.expiresIn
);

res.json({
  claims,
  expiresIn: demoJwtConfig.expiresIn,
  issuedAt: new Date().toISOString(),
  mode: "server",
  source: "apps/server/src/controllers/auth.controller.ts",
  token,
  tokenType: "Bearer",
  user: sessionUser
});
