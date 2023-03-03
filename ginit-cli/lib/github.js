const CLI = require("clui");
const Configstore = require("configstore");
const { Octokit } = require("@octokit/rest");
const Spinner = CLI.Spinner;
const { createBasicAuth } = require("@octokit/auth-basic");

const inquirer = require("./inquirer");
const pkg = require("../package.json");
const chalk = require("chalk");
const { createTokenAuth } = require("@octokit/auth-token");
const conf = new Configstore(pkg.name);

let octokit;

module.exports = {
  getInstance: () => octokit,
  getStoredGithubToken: () => conf.get("github.token"),

  getPersonalAccessToken: async () => {
    const credentials = await inquirer.askGithubCredentials();
    const status = new Spinner("Authenticating you, please wait...");
    status.start();

    const auth = createTokenAuth(credentials.token);

    try {
      const res = await auth();
      if (res.token) {
        conf.set('github.token', res.token);
        return res.token;
      }
      else {
        throw new Error("Github token was not found in the response");
      }
    }
    catch (err) {
      console.log(chalk.red(err.message));
    }
    finally {
      console.log(chalk.green("Authenticated"));
      status.stop();
    }
  },

  githubAuth: token => {
    octokit = new Octokit({ auth: token });
  }
}