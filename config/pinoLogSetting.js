import pinoHttp from "pino-http";

function pinoLogSetting () {
  return pinoHttp({
    serializers: {
      req(req) {
        req.body = req.raw.body;
        return req;
      }
    },
    transport: {
      target: "pino-pretty",
      options: {
        singleLine: true,
      }
    },
  });
}

export default pinoLogSetting;