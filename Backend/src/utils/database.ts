import mongoose from "mongoose";

export default async function ConnectedDB(uri: string) {
  await mongoose
    .connect(uri, {
      dbName: "Render1com_TypescriptEcommerce",
    })
    .then((item) => {
      console.log(
        `connected to dbName :  ${item.connection.db?.namespace} in connectionDB and ${item.connection.port} in running and ${item.connection.host} is machine(or device) is use and running`
      );
    })
    .catch((error) => {
      console.log("in connected to DB" + error);
    });
}
