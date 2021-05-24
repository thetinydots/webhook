import express from "express";
import cors from "cors";
import { json, urlencoded } from "body-parser";

export type hookType = {
  path: string;
  type?: "GET" | "POST";
  action: <T = any, J = any, K = any, I = any>(
    data?: T,
    params?: K,
    query?: I
  ) => J | Promise<J>;
};

export type hooksType = hookType[];

const webhook = (
  hooks: hooksType,
  PORT: number = 3010,
  debug: boolean = false
) => {
  const log = (...arg: any) => {
    if (debug) {
      console.log("WEBHOOK 👉", ...arg);
    }
  };
  const app = express();
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  hooks.forEach((hook) => {
    const action = (
      req: express.Request,
      res: express.Response
    ) => {
      log(
        "EVENT",
        hook.path,
        hook.type ? hook.type : "GET"
      );
      Promise.all([
        hook.action(
          req.body,
          req.params,
          req.query
        ),
      ])
        .then(([response]) => {
          res.setHeader(
            "X-Powered-By",
            "VOS Webhook"
          );
          res.send(response);
        })
        .catch((err) => {
          console.error(err);
          res.setHeader(
            "X-Powered-By",
            "VOS Webhook"
          );
          res.send({
            status: false,
            msg: "hook failed",
          });
        });
    };

    switch (hook.type) {
      case undefined:
      case "GET":
        app.get(hook.path, action);
        break;
      default:
        app.post(hook.path, action);
        break;
    }
  });
  app.use((req, res) => {
    log("NOT FOUND", req.path);
    res.setHeader("X-Powered-By", "VOS Webhook");
    res.status(404).send({
      status: false,
      msg: "hook not found",
    });
  });
  app.listen(PORT, () => {
    log("Server started at", PORT);
  });
};

export default webhook;
