#!/usr/bin/env node

const walk = require('walk');
const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');
const chalk = require('chalk');
const packagePath = path.resolve(__dirname,'./package.json');
const version = JSON.parse(fs.readFileSync(packagePath).toString()).version;
const walker = walk.walk("./");

var program = require('commander');

program
    .version(version)
    .option('-d, --dir [value]', 'need delete directory')
    .parse(process.argv);

if (!program.dir) {
    console.log(chalk `{black.bgRed WARN} {green usage: rmdirr -d <directory>}!`);
    return;
}

let isDeleted = false;

walker.on('directory', (root, fileStats, next) => {
    if (fileStats.type === 'directory' && fileStats.name === program.dir) {
        const dir = path.resolve(root, fileStats.name);
        rimraf.sync(dir);
        console.log(chalk `{bgMagenta Delete} ${dir}`);
        isDeleted = true;
    }
    next();
}).on('end', function () {
    if (!isDeleted) {
        console.log(chalk `{black.bgYellowBright WARN} Nothing Deleted!`)
    } else {
        console.log(chalk `{black.bgGreen INFO} Done!`);
    }
});