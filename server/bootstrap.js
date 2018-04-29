const fs = require('fs');
const shell = require('shelljs');
const path = require('path');

console.log('Bootstrapping the application');

if(!fs.existsSync(path.join(__dirname, 'logs'))) {
    if(shell.exec('mkdir logs').code === 0) {
        console.log('logs folder not available, created one instead');
    }
}

if(!fs.existsSync(path.join(__dirname, 'db'))) {
    if(shell.exec('mkdir db').code === 0) {
        console.log('db folder not available, created one instead');
    }
}

if(!fs.existsSync(path.join(__dirname, 'db', 'translations'))) {
    if(shell.exec('mkdir db/translations').code === 0) {
        console.log('db/translations folder not available, created on instead');
    }
}