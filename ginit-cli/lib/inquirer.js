const inquirer = require('inquirer');
const files = require('./files');

const githubCredentialsQuestions = [
  {
    name: "token",
    type: "input",
    message: "Enter your token:",
    validate: value => value.length ? true : "Please enter token",
  }
];

const _2FACodeQuestion = {
  name: "twoFactorAuthenticationCode",
  type: "input",
  message: "Enter your two-factor authentication code:",
  validate: value => value.length ? true : "Please enter your two-factor authentication code"
};

const repoQuestions = ({ defaultRepoName, defaultDesc, }) => [
  {
    type: "input",
    name: "name",
    message: "Enter a name for the repository:",
    default: defaultRepoName || files.getCurrentDirectoryBase(),
    validate: value => value.length ? true : "Please enter a name for the repository"
  },
  {
    type: "input",
    name: "description",
    default: defaultDesc || null,
    message: "Optionally enter a description for the repository",
  },
  {
    type: "input",
    name: "visibility",
    message: "Public or private",
    choices: ["public", "private"],
    default: "public",
  }
];

const ignoreFileQuestions = fileList => [
  {
    type: "checkbox",
    name: "ignore",
    message: "Select the files and/or folders you wish to ignore:",
    choices: fileList,
    default: ["node_modules", "bower_components"]
  }
];

module.exports = {
  askGithubCredentials: () => inquirer.prompt(githubCredentialsQuestions),
  getTwoFactorAuthenticationCode: () => inquirer.prompt(_2FACodeQuestion),
  askRepoDetails: () => {
    const args = require("minimist")(process.argv.slice(2));
    return inquirer.prompt(repoQuestions({
      defaultRepoName: args._[0], defaultDesc: args._[1]
    }));
  },
  askIgnoreFiles: fileList => inquirer.prompt(ignoreFileQuestions(fileList)),
}