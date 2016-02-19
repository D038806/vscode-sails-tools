"use strict";

let cp = require('child_process');
let path = require('path');
let vscode = require('vscode');
let fs = require('fs');
let utils = require('./extensionUtils');

const MODELS = 'Model', API = 'API', CONTROLLER = 'Controller';
const GEN_OPTIONS = [MODELS, API, CONTROLLER];
const CONTROLLERS_FOLDER = 'api/controllers';
const CONTROLLER_SUFFIX = 'Controller';

/**
 * @description Open the refered file in editor if exists, else shows an error message
 * @param  {string} filepath: the path of the file you want to open
 * @param  {string} kindOfFile: The kind of the file to open eg.: Model, Controller, etc
 * @return {void}
 */
function openFileInEditor(filePath, kindOfFile) {
    if (!filePath) return;
    if (!fs.existsSync(String(filePath))) {
        vscode.window.showErrorMessage('New ' + kindOfFile + ' file not found!');
    }
    vscode.workspace.openTextDocument(filePath + '')
        .then((document) => {
            vscode.window.showTextDocument(document);
        });
};
/**
 * @param  {string} relativeFolder
 * @param  {string} fileName
 * @param  {boolean} shouldCapitalize default: true
 */
function buildFilePath(relativeFolder, fileName, shouldCapitalize) {
    if (shouldCapitalize == undefined) shouldCapitalize = true;
    
    let _fileName = shouldCapitalize ? utils.capitalizeFirstLetter(fileName) : fileName;
    return path.join(vscode.workspace.rootPath, relativeFolder, _fileName + '.js')    
}

/**
 * @return void
 * @description Shows the input box and execute the command line to create the model
 *   and after that open the new model in editor.
 */
function executeModelGenerator() {
    vscode.window.showInputBox({ prompt: 'Choose your model name:' })
        .then((modelName) => {
            if (!modelName) return;

            generateModel(modelName)
                .then( filePath => {
                    openFileInEditor(filePath, 'Model');
                });
        })
}
/**
 * @description Executes the given generator and returns the stdout as the resolution of the promise
 * @param  {string} generatorName
 * @param  {string} paramName
 * @return {Promise}
 */
function executeGenerator (generatorName, paramName) {
    return new Promise((resolve, reject) => {
        let projectPath = vscode.workspace.rootPath;
        let options = {
            'cwd': projectPath,
            'encoding': 'utf8'
        };

        var command = 'sails generate ' + generatorName + ' '  + paramName;

        cp.exec(command, options, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout);
            }
        });

    });    
}

function executeControllerGenerator() {    
    vscode.window.showInputBox({ prompt: 'Choose your Controller name:' })
        .then((controllerName) => {
            if (!controllerName) return;

            executeGenerator('controller', controllerName)
                .then( stdout => {
                    openFileInEditor(buildFilePath(CONTROLLERS_FOLDER, controllerName + CONTROLLER_SUFFIX), 'Controller');
                });
        })
}


/**
 * @description Generates the model with the given name, and resolve the promise with the file's path
 * @param  {string} modelName - The name of the new model
 * @return {Promise} A promise that will resolve with the file name of the new module
 */
function generateModel(modelName) {
    return new Promise((resolve, reject) => {
        let projectPath = vscode.workspace.rootPath;
        let options = {
            'cwd': projectPath,
            'encoding': 'utf8'
        };

        var command = 'sails generate model ' + modelName;

        cp.exec(command, options, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve(path.join(projectPath, 'api/models', utils.capitalizeFirstLetter(modelName) + '.js'));
            }
        });

    });
};

/**
 * @return void
 * @description This method show a QuickPick that allow user to select wich generator he wants to run
 */
exports.selectGenerator = () => {
    vscode.window.showQuickPick(GEN_OPTIONS)
        .then((item) => {
            if (!item) return;
            switch (item) {
                case MODELS:
                    executeModelGenerator();
                    break;

                case CONTROLLER:
                    executeControllerGenerator();
                    break;

                default:
                    break;
            }
        })
};