import type { ExtRequest, ExtResponse } from "expresto-server";
import { signToken } from "expresto-server";

import {
  createJwtClaims,
  demoJwtConfig,
  normalizeSessionUser
} from "../lib/demo-auth.js";

type AuthenticatedRequest = ExtRequest & {
  auth?: Record<string, unknown>;
  user?: Record<string, unknown>;
};

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
      }
    },
    {
      method: "get",
      path: "/session",
      secure: "jwt",
      handler: (req: AuthenticatedRequest, res: ExtResponse) => {
        const claims = (req.auth ?? {}) as Record<string, unknown>;
        const sessionUser = normalizeSessionUser(req.user);

        res.json({
          claims,
          expiresIn: demoJwtConfig.expiresIn,
          issuedAt: new Date().toISOString(),
          mode: "server",
          source: "apps/server/src/controllers/auth.controller.ts",
          tokenType: "Bearer",
          user: sessionUser
        });
      }
    }
  ]
};
