// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { add_package } from './commands/add_package';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "go-package-manager" is now active!');

	const disposable = vscode.commands.registerCommand(
		'go-package-manager.add_package',
		add_package
	);

	context.subscriptions.push(disposable);
}

export function deactivate() { }


