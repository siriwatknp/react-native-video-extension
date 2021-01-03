const path = require('path');
const fse = require('fs-extra');

const packagePath = process.cwd();
const buildPath = path.join(packagePath, './dist');

async function createPackageFile() {
  const packageData = await fse.readJson(
    path.resolve(packagePath, './package.json'),
  );
  const { name, version, license, repository } = packageData;
  let scope = process.argv.find((arg) => arg.startsWith('scope='));
  if (scope) {
    scope = scope.replace('scope=', '');
  }
  const newPackageData = {
    name: `${scope ? `${scope.replace('/', '')}/` : ''}${name}`,
    version,
    private: false,
    repository,
    main: 'index.js',
    types: 'index.d.ts',
    license,
    publishConfig: {
      access: 'public',
    },
    peerDependencies: {
      react: '>=16',
      'react-native': '>=0.62',
      'react-native-video': '^5.1.0-alpha8',
    },
  };
  const targetPath = path.resolve(buildPath, './package.json');

  await fse.writeJSON(targetPath, newPackageData, { spaces: 2 });
  console.log(`Created package.json in ${targetPath}`);

  return newPackageData;
}

async function run() {
  try {
    await Promise.all([createPackageFile()]);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
