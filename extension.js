// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const CSV = require('./src/createCsv')
const entityDefinitionChecks = require('./src/entityDefinitionChecks')

const csnfileOp = require('./src/csnFileOperations')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "cds-csv-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	/*
	let disposable = vscode.commands.registerCommand('cds-csv-generator.createCSV', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from CSV File Generator');
	});
	*/
	context.subscriptions.push(vscode.commands.registerCommand('cds-csv-generator.createCSV', () => {
		vscode.commands.executeCommand('cds-csv-generator.enterNamespace');
	}))

	context.subscriptions.push(vscode.commands.registerCommand('cds-csv-generator.enterNamespace', () => {
		const option = { placeHolder: "com.__", prompt: "Enter schema namespace" };

		vscode.window.showInputBox(option).then(value => {
			vscode.commands.executeCommand('cds-csv-generator.csnFile', value);
		})
	}))

	context.subscriptions.push(vscode.commands.registerCommand('cds-csv-generator.csnFile', (nameSpace) => {
		const option = { canSelectMany: false, title: "Please select csn file" };

		vscode.window.showOpenDialog(option).then(fileUri => {
			if (fileUri && fileUri[0]) {
				const csnFilePath = fileUri[0].fsPath
				vscode.commands.executeCommand('cds-csv-generator.csvFolder', csnFilePath, nameSpace);
			}
		})
	}))

	context.subscriptions.push(vscode.commands.registerCommand('cds-csv-generator.csvFolder', (csnFilePath, nameSpace) => {
		const option = { canSelectMany: false, canSelectFolders: true, title: "Please select a folder to save csv files (db/data)" };

		vscode.window.showOpenDialog(option).then(fileUri => {
			if (fileUri && fileUri[0]) {
				const csvFolderPAtch = fileUri[0].fsPath

				entityDefinitionChecks.namespace.nameSpaceValue = nameSpace
				CSV.createCSVFilesOut(csnFilePath, csvFolderPAtch)
			}
		})
	}))
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
