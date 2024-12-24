import * as functions from "firebase-functions";
import next from "next";

const server = next({
  dev: process.env.NODE_ENV !== "production",
  conf: { distDir: ".next" },
});
const handle = server.getRequestHandler();

export const nextjsFunc = functions.https.onRequest(async (req, res) => {
  await server.prepare();
  handle(req, res);
});
