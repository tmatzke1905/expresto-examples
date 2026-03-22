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
          healthEndpoint: "/api/system/health",
          mode: "server",
          status: "ready"
        });
      }
    }
  ]
};
