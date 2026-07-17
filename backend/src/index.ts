import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import "dotenv/config.js";
import initRepo from "./controllers/init.js";
import addFile from "./controllers/add.js";
import commitFiles from "./controllers/commit.js";
import revert from "./controllers/revert.js";
import pullChanges from "./controllers/pull.js";
import pushChanges from "./controllers/push.js";
import { loginUser, logoutUser } from "./utils/globalConfig.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { prisma } from "./prisma.js";
import { mainRouter } from "./routes/main.router.js";

async function startServer() {
  const app = express();
  const port = process.env.PORT || 8000;

  // CORS must be before routes
  app.use(cors({ origin: "*" }));
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(express.json({ limit: '10mb' }));
  app.use("/", mainRouter);

  try {
    await prisma.$connect();
    console.log("PostgreSQL connected!");
  } catch (err) {
    console.error("Unable to connect to DB:", err);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

yargs(hideBin(process.argv))
  .command("start", "Starts a new server", {}, () => {
    startServer().catch((err) => {
      console.error("Failed to start server:", err);
      process.exit(1);
    });
  })
  .command(
    "login <token>",
    "Login with your authentication token",
    (yargs) => {
      yargs.positional("token", {
        describe: "JWT token from web app login",
        type: "string",
      });
    },
    (argv) => {
      loginUser(argv.token as string);
    },
  )
  .command("logout", "Logout and remove stored credentials", {}, () => {
    logoutUser();
  })
  .command("init", "Initialise a new repository", {}, () => {
    initRepo();
  })
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
