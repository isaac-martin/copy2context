const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rootDir = path.basename(process.cwd());
const configPath = process.argv[2];
const config = require(`${rootDir}/${configPath}`);
const configObj = yaml.safeLoad(fs.readFileSync(config, 'utf8'));
const copyDirectories = configObj.copyDirectories;

let outputDir = configObj.ouptutDirectory;

const writeFile = async (dir, file, content) => {
  await mkdirp(dir);
  fs.writeFileSync(`${dir}/${file}.js`, content);
};

const run = async () => {
  if (!configPath) {
    console.error('No config argument passed');
  }
  if (!outputDir) {
    console.warn('No ouput directory sepecified in config. Defaulting to root/copy');
    outputDir = 'src/copy';
  }
  if (!copyDirectories) {
    console.warn('No copy directories sepecified in config. Please add');
  }

  try {
    Object.values(copyDirectories).forEach(dir => {
      let output = null;
      fs.readdir(dir, (err, files) => {
        if (err) {
          console.error(`Sorry! Couldn't read files`);
          console.error(err);
          return;
        }

        files.forEach(file => {
          const yamlData = yaml.safeLoad(fs.readFileSync(`${dir}/${file}`, 'utf8'));
          const prefix = file.split('.')[0];
          const newObject = {[prefix]: yamlData};
          output = {...output, ...newObject};
        });
        const exportedObject = `export default ${JSON.stringify(output, null, 4)}`;

        writeFile(outputDir, dir, exportedObject);
      });
    });
  } catch (e) {
    console.log(e);
  }
};

run();
