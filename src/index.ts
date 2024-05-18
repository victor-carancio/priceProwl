import "reflect-metadata";
import app from "./app";

const port = 3000;
const server = () => {
  return app.listen(port);
};

const main = async () => {
  server();
  console.log(`Server is listen on port ${port}`);
};
main();
