import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import "dotenv/config.js";
import initRepo from "./controllers/init.js";
import addFile from "./controllers/add.js";
import commitFiles from "./controllers/commit.js";
import revert from "./controllers/revert.js";
import pullChanges from "./controllers/pull.js";
import pushChanges from "./controllers/push.js";
import express from "express";
import bodyParser from "body-parser";
import type { Response, Request } from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());
  app.use(cors({ origin: "*" }));

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello from the server ! ");
  });

  let user = "test";

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log(`========`);
      console.log(user);
      console.log(`========`);
      socket.join(userID);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  })

}

yargs(hideBin(process.argv))
  .command("start", "Starts a new server", {}, startServer)
  .command(
    "init", // command
    "Initialise a new repository", // description
    {}, // parameters
    initRepo, // actual logic/function
  )
  .command(
    "add <file>",
    "Add a file to the staging area",
    (yargs) => {
      yargs.positional("file", {
        describe: "file to be added to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addFile(argv.file as string);
    },
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitFiles(argv.message as string);
    },
  )
  .command("push", "Push the changes to the repository", {}, pushChanges)
  .command(
    "pull",
    "Pull the latest changes from the repository",
    {},
    pullChanges,
  )
  .command(
    "revert <commitID>",
    "Revert the codebase back to a specific commt",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to be reverted to",
        type: "string",
      });
    },
    (argv) => {
      revert(argv.commitID as string);
    },
  )
  .demandCommand(1, "You need to enter at least one command !")
  .help().argv;
