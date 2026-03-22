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
      handler: async (req: ExtRequest<{ presetId: string }>, res: ExtResponse) => {
        const eventSystem = await emitEventPreset(req.params.presetId);
        res.json(eventSystem);
      }
    }
  ]
};
