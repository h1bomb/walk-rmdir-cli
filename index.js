#!/usr/bin/env node

const walk = require('walk');
const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');
const chalk = require('chalk');
const program = require('commander');
const cliSpinners = require('cli-spinners');
const logUpdate = require('log-update');
const spinner = cliSpinners['dots'];
const packagePath = path.resolve(__dirname, './package.json');
const version = JSON.parse(fs.readFileSync(packagePath).toString()).version;
const walker = walk.walk("./");
let i = 0;

program
    .version(version)
    .option('-d, --dir [value]', 'need delete directory')
    .parse(process.argv);

if (!program.dir) {
    console.log(chalk `{black.bgRed WARN} {green usage: rmdirr -d <directory>}!`);
    return;
}

let isDeleted = false;
let filesCount = 0;
let deleteCount = 0;
let logStr = '';
let spinnerHandle;

walker.on('directory', (root, fileStats, next) => {
    const dirs = program.dir.split(',');
    dirs.forEach(dir => {
        if (fileStats.name === dir) {
            const dir = path.resolve(root, fileStats.name);
            try {
                rimraf.sync(dir);
            } catch (err) {
                logStr += err.message;
            }
            logStr += chalk `{bgMagenta Delete} ${dir} \n`;
            isDeleted = true;
            deleteCount++;
        }
    });
    filesCount++;
    next();
}).on('errors', (root, nodeStatsArray, next) => {
    next();
}).on('end', function () {
    if (!isDeleted) {
        logUpdate(chalk `{black.bgYellowBright WARN} Nothing Deleted!`)
    } else {
        logUpdate(chalk `{black.bgGreen INFO} Done!`);
    }
    clearInterval(spinnerHandle);
});

spinnerHandle = setInterval(() => {
    const frames = spinner.frames;
    logUpdate(logStr + frames[i = ++i % frames.length] + ' Files Count:' + filesCount + ' Delete Count:' + deleteCount);
}, spinner.interval);