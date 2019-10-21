#!/usr/bin/env node

const yaml = require('js-yaml');
const fs = require('fs');
const yargs = require('yargs');
const path = require('path');
const mkdirp = require('mkdirp');
const chalk = require('chalk');

const rootDir = path.resolve('.');
const options = yargs.usage('Usage: -c <config>').option('c', {alias: 'config', describe: 'Path of config file', type: 'string', demandOption: true}).argv;

const configPath = `${rootDir}/${options.config}`;

const error = chalk.bold.red;
const success = chalk.bold.green;
const warning = chalk.bold.orange;

fs.access(configPath, fs.F_OK, err => {
  if (err) {
    console.log(error(`Config file does not exist at ${configPath}`));
    return;
  }
  run();
});

const writeFile = async (dir, file, content) => {
  await mkdirp(dir);
  const fileName = `${dir}/${file}.js`;
  fs.writeFileSync(fileName, content);
  console.log(success(`Succesfully written to ${fileName}`));
};

const convertDirectoriesToArray = data => Object.entries(data).map(([key, value]) => ({file: key, path: value}));

const run = async () => {
  const configObj = yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));
  const copyDirectories = configObj.copyDirectories;

  let outputDir = configObj.ouptutDirectory;
  if (!outputDir) {
    console.log(warning('No ouput directory sepecified in config. Defaulting to /copy'));
    outputDir = `${rootDir}/copy`;
  }
  if (!copyDirectories) {
    console.log(error('No copy directories sepecified in config. Please add'));
    process.exit(1);
  }

  try {
    convertDirectoriesToArray(copyDirectories).forEach(dir => {
      let output = null;
      const directory = dir.path;
      fs.readdir(directory, (err, files) => {
        if (err) {
          console.log(error(`Sorry! Couldn't read files from ${directory}, make sure that you have specified the path correctly in config`));
          process.exit(1);
        }

        files.forEach(file => {
          const yamlData = yaml.safeLoad(fs.readFileSync(`${directory}/${file}`, 'utf8'));
          const prefix = file.split('.')[0];
          const newObject = {[prefix]: yamlData};
          output = {...output, ...newObject};
        });
        const exportedObject = `export default ${JSON.stringify(output, null, 4)}`;

        writeFile(outputDir, dir.file, exportedObject);
      });
    });
  } catch (e) {
    console.log(error(e));
  }
};
