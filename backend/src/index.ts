import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import "dotenv/config.js";
import initRepo from "./controllers/init.js";
import addFile from "./controllers/add.js";
import commitFiles from "./controllers/commit.js";
import revert from "./controllers/revert.js";
import pullChanges from "./controllers/pull.js";
import pushChanges from "./controllers/push.js";

yargs(hideBin(process.argv))
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
    addFile,
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
    commitFiles,
  )
  .command(
    "push",
    "Push the changes to the repository",
    {},
    pushChanges,
  )
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
    revert,
  )
  .demandCommand(1, "You need to enter at least one command !")
  .help().argv;
