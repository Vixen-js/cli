#!/usr/bin/env node --no-warnings
import pkg from "../package.json" assert { type: "json" };
import { program } from "commander";
import chalk from "chalk";
import { execSync } from "child_process";

const CLI_NAME = " Vixen ";

const templates: Record<string, string> = {
  vanilla: "https://github.com/Vixen-js/template-vanilla-ts",
};

program.version(pkg.version).description("Vixen CLI");

program
  .description("create a new project")
  .argument("<name>", "project name")
  .option("-t --template <template>", "template name")
  .action((projectName, options) => {
    if (options.template) {
      if (!templates[options.template]) {
        console.log(
          chalk.bgCyan.bold(CLI_NAME),
          chalk.red(`Template ${options.template} not found`),
        );
        process.exit(1);
        return;
      }
      console.log(
        chalk.bgCyan.bold(CLI_NAME),
        chalk.green("Creating project:"),
        chalk.magenta(projectName),
        chalk.green("with template"),
        chalk.magenta(options.template),
      );
    } else {
      console.log(
        chalk.bgCyan.bold(CLI_NAME),
        chalk.green("Creating project:"),
        chalk.magenta(projectName),
        chalk.green("with"),
        chalk.magenta("default_template"),
      );
    }

    createProject(projectName, options.template);
  });

program.parse(process.argv);

function createProject(projectName: string, template: string = "vanilla") {
  try {
    execSync(`git clone --depth 1 ${templates[template]} ${projectName}`, {
      stdio: ["pipe", "pipe", "ignore"],
    });
  } catch (e: unknown) {
    console.log(
      chalk.bgCyan.bold(CLI_NAME),
      chalk.red(
        `Error Initializing git repository:\n\t${(e as Error).message}`,
      ),
    );
    process.exit(1);
  }
  try {
    let gitCleanResult = execSync(`cd ${projectName} && rm -rf .git`, {
      stdio: ["pipe", "pipe", "ignore"],
    }).toString();
    gitCleanResult =
      gitCleanResult !== "" ? gitCleanResult : "Started git initialization";
    console.log(chalk.bgCyan.bold(CLI_NAME), gitCleanResult);
  } catch (e: unknown) {
    console.log(
      chalk.bgCyan.bold(CLI_NAME),
      chalk.red(
        `Error Preparing local git repository:\n\t${(e as Error).message}`,
      ),
    );
    process.exit(1);
  }

  try {
    let gitInitResult = execSync(`cd ${projectName} && git init`, {
      stdio: ["pipe", "pipe", "ignore"],
    }).toString();
    gitInitResult =
      gitInitResult !== ""
        ? gitInitResult
        : "Git repo initialized successfully";
    console.log(chalk.bgCyan.bold(CLI_NAME), gitInitResult);
  } catch (e: unknown) {
    console.log(
      chalk.bgCyan.bold(CLI_NAME),
      chalk.red(
        `Error Initializing git repository:\n\t${(e as Error).message}`,
      ),
    );
    process.exit(1);
  }
  console.log(
    chalk.bgCyan.bold(CLI_NAME),
    chalk.green("Project created successfully!"),
  );
  console.log(
    chalk.bgCyan.bold(CLI_NAME),
    chalk.magenta(`Next steps:
        \t1. run 'cd ${projectName} && pnpm i' to install dependencies`),
  );
  console.log(
    chalk.bgCyan.bold(CLI_NAME),
    chalk.magenta("\t2. Start watch server running 'pnpm watch'"),
  );
  console.log(
    chalk.bgCyan.bold(CLI_NAME),
    chalk.magenta("\t2. Start development application running 'pnpm dev'"),
  );
  process.exit(0);
}
