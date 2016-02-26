'use strict';

let fs = require('fs');
let path = require('path');
let vscode = require('vscode');
let jsonfile = require('jsonfile');
jsonfile.spaces = 4;

let projPath = vscode.workspace.rootPath;
const packageFile = path.join(projPath, 'package.json');

function createBuildHook() {
    
};

function configureSupervisorOpts () {
    let filePath = path.join(projPath, 'supervisor_opts');
    const option = '-i .tmp';
    
    let supervisorOpts = [];
    
    if (fs.existsSync(filePath)) {
        supervisorOpts = fs.readFileSync(filePath, 'utf8').split('\n');
        if (supervisorOpts.indexOf(option) == -1) return;
    }
    
    supervisorOpts.push(option);
    
    fs.writeFileSync(filePath, supervisorOpts.join('\n'), {encoding: 'utf8'});    
}

function  configurePackageJson() {
    let pj = jsonfile.readFileSync(packageFile);
    
    
    
    jsonfile.writeFileSync(packageFile, pj);
}

exports.configureSailsForDeploy = () => {
  createBuildHook();  
}