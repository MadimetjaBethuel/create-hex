#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import path from 'path';
import { ensureDirSync, writeJsonSync, copySync } from 'fs-extra';
import { execSync } from 'child_process';

const program = new Command();

program
  .version('0.0.1')
  .description('TypeForge a project generator for backend applications');

program
  .command('generate')
  .description('Generate a new project')
  .action(async () => {
    const selected_options = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is the name of your project?',
        default: 'my-project',
      },
      {
        type: 'input',
        name: 'server',
        message: 'What is the name of your server?',
        default: 'express',
      },
      {
        type: 'confirm',
        name: 'git',
        message: 'Do you want to initialize a git repository?',
        default: true,
      },
    ]);
    let git_url;
    if (selected_options.git) {
      const gitAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'git_repo',
          message: 'Enter git repository url:',
        },
      ]);

      git_url = gitAnswers.git_repo;
    }
    const project_dir = path.resolve(
      process.cwd(),
      selected_options.projectName
    );
    console.log('Generating project files...');

    ensureDirSync(project_dir);
    createPackageJson(project_dir, selected_options.projectName);
    const template_dir = path.resolve(__dirname, '../template');
    copySync(template_dir, project_dir);

    console.log('Files copied successfully.');

    if (selected_options.git && git_url) {
      console.log('Initializing git repository...');
      execSync(`git init && git remote add origin ${git_url}`);
    }
    execSync('npm install', { cwd: project_dir, stdio: 'inherit' });
    console.log(
      `Your project ${selected_options.projectName} has been generated successfully!`
    );
  });

program.parse();

function createPackageJson(project_dir: string, projectName: string) {
  const packageJson = {
    name: projectName,
    version: '1.0.0',
    description: '',
    main: 'index.ts',
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
      dev: 'nodemon index.js',
      start: 'node dist/index.js',
    },
    author: '',
    license: 'ISC',
    dependencies: {
      express: '^4.17.1',
      'body-parser': '^1.19.0',
      cors: '^2.8.5',
      dotenv: '^8.2.0',
      axios: '^1.6.5',
    },
    devDependencies: {
      nodemon: '^2.0.4',
      typescript: '^3.8.3',
      'ts-node': '^8.6.2',
      '@types/express': '^4.17.6',
      '@types/node': '^13.9.1',
      '@types/cors': '^2.8.17',
    },
  };

  writeJsonSync(path.join(project_dir, 'package.json'), packageJson, {
    spaces: 2,
  });
  console.log('package.json file created successfully.');
}
