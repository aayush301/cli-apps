const CLI = require('clui');
const fs = require('fs');
const git = require('simple-git/promise')();
const touch = require("touch");
const _ = require("lodash");
const Spinner = CLI.Spinner;
const inquirer = require('./inquirer');
const gh = require("./github");
const chalk = require('chalk');

module.exports = {
  createRemoteRepo: async () => {
    const github = gh.getInstance();
    const { name, description, visibility } = await inquirer.askRepoDetails();

    const data = { name, description, private: visibility === "private" };
    const status = new Spinner("Creating remote repository...");
    status.start();

    try {
      const response = await github.repos.createForAuthenticatedUser(data);
      return response.data.ssh_url;
    }
    catch (err) {
      console.log(chalk.red(err.message));
    }
    finally {
      status.stop();
    }
  },

  createGitignore: async () => {
    const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');
    if (filelist.length) {
      const answers = await inquirer.askIgnoreFiles(filelist);
      if (answers.ignore.length) {
        fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
      }
      else {
        touch('.gitignore');
      }
    }
    else {
      touch('.gitignore');
    }
  },

  setupRepo: async url => {
    const status = new Spinner("Initializing local repositiory and pushing to remote...");
    status.start();

    try {
      await git.init();
      await git.add("./*");
      await git.commit("Initial commit");
      await git.addRemote("origin", url);
      await git.push("origin", "master");
    }
    catch (err) {
      console.log(chalk.red(err.message));
    }
    finally {
      status.stop();
    }

  }

}