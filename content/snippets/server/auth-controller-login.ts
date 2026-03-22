export default {
  route: "/auth",
  handlers: [
    {
      method: "post",
      path: "/login",
      secure: "basic",
      handler: async (req: AuthenticatedRequest, res: ExtResponse) => {
        const sessionUser = normalizeSessionUser(req.user);
        const claims = createJwtClaims(sessionUser.username);
        const token = await signToken(
          claims,
          demoJwtConfig.secret,
          demoJwtConfig.algorithm,
          demoJwtConfig.expiresIn
        );

        res.json({ claims, token, tokenType: "Bearer", user: sessionUser });
      }
    }
  ]
};
