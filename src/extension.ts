// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { add_package_command } from './commands/add_package';
import { insert_package_import_command } from './commands/insert_import';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const add = vscode.commands.registerCommand(
		'go-package-manager.add_package',
		add_package_command
	);

	const insert = vscode.commands.registerCommand(
		'go-package-manager.insert_package',
		insert_package_import_command
	);

	context.subscriptions.push(
		add,
		insert
	);
}

export function deactivate() {
	// There is no deactivation logic for the extension.
	// But let it be here for the template consistency.
}


