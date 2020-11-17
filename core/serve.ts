import { Application } from "express";

const serve = (app: Application) => {
  const port = process.env.PORT || 4000;
  return app.listen(port);
};

export default serve;
