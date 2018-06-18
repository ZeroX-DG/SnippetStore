const MakeLinuxInstaller = require('electron-installer-debian')
const MakeWinInstaller = require('electron-winstaller')
const chalk = require('chalk')

function getTarget () {
  switch (process.platform) {
    case 'darwin':
      return 'osx'
    case 'win32':
      return 'win'
    case 'linux':
      return 'linux'
    default:
      return process.platform
  }
}

const target = process.argv[2] !== 'current' ? process.argv[2] : getTarget()

const options = {
  linux: {
    bin: 'SnippetStore',
    src: `dist/SnippetStore-${target}-x64`,
    dest: 'dist/installers/',
    arch: 'amd64',
    icon: 'resources/icon/icon512.png',
    categories: [
      'Development',
      'Utility'
    ],
    lintianOverrides: [
      'changelog-file-missing-in-native-package'
    ]
  },
  win: {
    appDirectory: `dist/SnippetStore-win32-x64`,
    outputDirectory: 'dist/installers/',
    authors: 'Hung Nguyen <viethungax@gmail.com>',
    exe: 'SnippetStore.exe',
    iconUrl: 'resources/icon/icon512.ico',
    setupIcon: 'resources/icon/icon512.ico',
    skipUpdateIcon: true
  }
}

console.log(chalk.default.yellow('Making installer, please wait...'))

function runLinux () {
  MakeLinuxInstaller(options.linux)
    .then(() => console.log(chalk.default.green(`Successfully created package at ${options.linux.dest}`)))
    .catch(err => {
      console.error(err, err.stack)
      process.exit(1)
    })
}

function runWin () {
  MakeWinInstaller.createWindowsInstaller(options.win)
    .then(() => console.log(chalk.default.green(`Successfully created package at ${options.linux.dest}`)))
    .catch(err => {
      console.error(err, err.stack)
      process.exit(1)
    })
}

switch (target) {
  case 'linux':
    runLinux()
    break
  case 'win':
    runWin()
    break
}
