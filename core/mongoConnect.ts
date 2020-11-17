import mongoose from "mongoose";
import env from "./env";

const mongoConnect = () => {
  const db: string = env("DB_DATABASE");

  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    })
    .then(() => {
      console.log(`mongodb connected to: ${db}`);
    })
    .catch((ex) => {
      console.error("mongodb could not connect: ", ex);
    });
};

export default mongoConnect;
