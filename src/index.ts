import "reflect-metadata";
import app from "./app";

const port = process.env.PORT || 3000;
const server = () => {
  return app.listen(port);
};

const main = async () => {
  console.log(`Server is listen on port ${port}`);
  server();
};
main();

/* ---------------- web socket ----------------*/
// const server = http.createServer(app);

// export const io = new SocketIOServer(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("New Websocket connection");
//   socket.on("disconnect", () => {
//     console.log("Websocket disconnected");
//   });
// });

// server.listen(port, () => {
//   console.log(`Server is listen on port ${port}`);
// });
