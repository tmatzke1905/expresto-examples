import type { ExtRequest, ExtResponse } from "expresto-server";

import { getCoreFeatureRuntime } from "../lib/core-feature-demo.js";

export default {
  route: "/system",
  handlers: [
    {
      method: "get",
      path: "/health",
      secure: false,
      handler: (_req: ExtRequest, res: ExtResponse) => {
        res.json({
          appName: "expresto-examples",
          title: "AP2 Bootstrap Runtime",
          mode: "server",
          status: "ready",
          message:
            "The React app is being served by expresto-server and the API is reachable.",
          contextRoot: "/api",
          healthEndpoint: "/api/system/health",
          webDelivery: "apps/web/dist",
          previewIndex: "preview/index.html",
          configPath: "apps/server/config/middleware.config.json",
          controllersPath: getCoreFeatureRuntime().config.controllersPath,
          metricsEndpoint: getCoreFeatureRuntime().config.metricsEndpoint,
          authModes: getCoreFeatureRuntime().config.authModes,
          schedulerMode: getCoreFeatureRuntime().config.schedulerMode,
          telemetryEnabled: getCoreFeatureRuntime().config.telemetryEnabled,
          source: "apps/server/src/controllers/system.controller.ts",
          timestamp: new Date().toISOString()
        });
      }
    }
  ]
};
