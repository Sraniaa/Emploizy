import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "EMPLOIZY_DB",
    })
    .then(() => {
      console.log("Connecté à la base de données.");
    })
    .catch((err) => {
      console.log(`Une erreur s'est produite. ${err}`);
    });
};
