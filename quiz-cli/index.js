const questions = require("./data/questions.json");
const chalk = require("chalk");
const inquirer = require("inquirer");

const main = async () => {
  console.clear();
  console.log(chalk.green("Welcome to the Quiz!!\n\n"));
  const markedAnswers = [];

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const { markedAnswer } = await inquirer.prompt({
      type: "list",
      name: "markedAnswer",
      message: `${i + 1}. ${question.title}`,
      choices: question.options,
    });
    markedAnswers.push(markedAnswer);
  }

  let score = 0;
  questions.forEach((question, id) => {
    score += (question.options[question.answer] === markedAnswers[id]);
  });

  console.log(chalk.green(`\nYour score is ${score}/${questions.length}`));

  console.log("Correct answers");
  questions.forEach(question => {
    console.log(chalk.blue(question.title), question.options[question.answer]);
  });

}

main();