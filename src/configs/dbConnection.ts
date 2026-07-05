"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// MongoDB Connection:

import mongoose from "mongoose";

const dbConnection = async function () {
    const dbUri = process.env.DB_URI;
    if (!dbUri) {
        console.error("! DB_URI is not defined in environment variables !");
        process.exit(1); // Exit the process with an error code
    }

  await mongoose
    .connect(dbUri)
    .then(() => console.log("* DB Connected *"))
    .catch((err) => {
      console.log("! DB Not Connected !");
      throw err;
    });
};

/* ------------------------------------------------------- */
export default dbConnection ;
