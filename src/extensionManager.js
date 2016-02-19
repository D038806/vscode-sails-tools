"use strict";

let vscode = require('vscode');
let fs = require('fs');
const options = ['Generators', 'OpenShift']; 

exports.sailsTools = () => {
    vscode.window.showQuickPick(options)
        .then( (item) => {
            if (!item) { return; }
            
            switch(item){
                case 'Generators': {
                    var generatorTools = require('./sailsGeneratorTools');
                    generatorTools.selectGenerator();
                    
                }
            }
        } )
}