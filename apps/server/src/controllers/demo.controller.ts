import type { ExtRequest, ExtResponse } from "expresto-server";
import { NotFoundError } from "expresto-server";

import { emitEventPreset, getCoreFeatureRuntime } from "../lib/core-feature-demo.js";
import { getLiveDemoRuntime } from "../lib/live-demo-runtime.js";

type EventPresetParams = {
  presetId: string;
};

export default {
  route: "/demo",
  handlers: [
    {
      method: "get",
      path: "/core-features",
      secure: false,
      handler: (_req: ExtRequest, res: ExtResponse) => {
        res.json(getCoreFeatureRuntime());
      }
    },
    {
      method: "get",
      path: "/live-demo",
      secure: false,
      handler: async (_req: ExtRequest, res: ExtResponse) => {
        res.json(await getLiveDemoRuntime());
      }
    },
    {
      method: "post",
      path: "/events/:presetId",
      secure: "jwt",
      handler: async (req: ExtRequest<EventPresetParams>, res: ExtResponse) => {
        try {
          const eventSystem = await emitEventPreset(req.params.presetId);
          res.json(eventSystem);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown EventBus demo error.";

          if (message.startsWith("Unknown event preset")) {
            throw new NotFoundError(message);
          }

          throw error;
        }
      }
    }
  ]
};
