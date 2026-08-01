import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import "dotenv/config.js";
import initRepo from "./controllers/init.js";
import addFile from "./controllers/add.js";
import commitFiles from "./controllers/commit.js";
import revert from "./controllers/revert.js";
import pullChanges from "./controllers/pull.js";
import pushChanges from "./controllers/push.js";
import { loginUser, logoutUser, deviceLogin } from "./utils/globalConfig.js";
import createBranchCLI, { checkoutBranch, listBranches } from "./controllers/branchCli.js";
import { setRemote, showRemote } from "./controllers/remote.js";

async function startServer() {
  const { default: express } = await import("express");
  const { default: bodyParser } = await import("body-parser");
  const { default: cors } = await import("cors");
  const { prisma } = await import("./prisma.js");
  const { mainRouter } = await import("./routes/main.router.js");

  const app = express();
  const port = process.env.PORT || 8000;

  app.use(cors({ origin: "*" }));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(express.json({ limit: "50mb" }));
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
    "login [token]",
    "Login — no token required, authorize from your browser",
    (yargs) => {
      yargs.positional("token", {
        describe: "JWT token from web app login (optional)",
        type: "string",
      });
      yargs.option("api-url", {
        describe: "CodeSync API URL (default: http://localhost:8000)",
        type: "string",
      });
      yargs.option("web-url", {
        describe: "CodeSync web app URL (default: http://localhost:3000)",
        type: "string",
      });
    },
    async (argv) => {
      if (argv.token) {
        await loginUser(argv.token as string, argv["api-url"] as string | undefined);
      } else {
        await deviceLogin(
          argv["api-url"] as string | undefined,
          argv["web-url"] as string | undefined,
        );
      }
    },
  )
  .command("logout", "Logout and remove stored credentials", {}, () => {
    logoutUser();
  })
  .command(
    "init [repoId]",
    "Initialise a new repository",
    (yargs) => {
      yargs.positional("repoId", {
        describe: "CodeSync repository ID to link (optional)",
        type: "string",
      });
    },
    (argv) => {
      initRepo(argv.repoId as string | undefined);
    },
  )
  .command(
    "remote [repoId]",
    "Set or show the remote CodeSync repository",
    (yargs) => {
      yargs.positional("repoId", {
        describe: "CodeSync repository ID to link",
        type: "string",
      });
    },
    (argv) => {
      if (argv.repoId) {
        setRemote(argv.repoId as string);
      } else {
        showRemote();
      }
    },
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
    "Revert the codebase back to a specific commit",
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
  .command(
    "branch [name]",
    "Create, list, or switch branches",
    (yargs) => {
      yargs.positional("name", {
        describe: "New branch name (omit to list branches)",
        type: "string",
      });
    },
    (argv) => {
      if (argv.name) {
        createBranchCLI(argv.name as string);
      } else {
        listBranches();
      }
    },
  )
  .command(
    "checkout <branch>",
    "Switch to a branch",
    (yargs) => {
      yargs.positional("branch", {
        describe: "Branch name to switch to",
        type: "string",
      });
    },
    (argv) => {
      checkoutBranch(argv.branch as string);
    },
  )
  .demandCommand(1, "You need to enter at least one command !")
  .help().argv;
