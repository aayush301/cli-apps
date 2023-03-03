#!/usr/bin/env node
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const github = require('./lib/github');
const repo = require('./lib/repo');
// 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

clear();
console.log(chalk.yellow(figlet.textSync("Ginit", { horizontalLayout: "full" })))
const getGithubToken = async () => github.getStoredGithubToken() || await github.getPersonalAccessToken();

const main = async () => {
  try {
    const token = await getGithubToken();
    github.githubAuth(token);
    const url = await repo.createRemoteRepo();
    await repo.createGitignore();
    await repo.setupRepo(url);
    console.log(chalk.green("All done"));
  }
  catch (err) {
    if (err) {
      switch (err.status) {
        case 401: console.log(chalk.red("Couldn't log you in. Please provide correct credentials/token")); break;
        case 422: console.log(chalk.red("There is already a remote repo or token with the same name")); break;
        default: console.log(chalk.red(err));
      }
    }
  }
}

main();