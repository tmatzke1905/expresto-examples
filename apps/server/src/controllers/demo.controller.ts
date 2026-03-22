import type { ExtRequest, ExtResponse } from "expresto-server";
import { NotFoundError } from "expresto-server";

import { emitEventPreset, getCoreFeatureRuntime } from "../lib/core-feature-demo.js";

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
