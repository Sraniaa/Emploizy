import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_LOCAL_URL, {
      dbName: "EMPLOIZY",
    })
    .then(() => {
      console.log("Connecté à la base de données.");
    })
    .catch((err) => {
      console.log(`Une erreur s'est produite. ${err}`);
    });
};
