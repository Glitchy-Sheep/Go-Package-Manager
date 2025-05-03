import * as vscode from 'vscode';
import { PackageInfo } from '../models/package_info';

export function goGetPackage(goPackage: PackageInfo) {
    const terminal = vscode.window.createTerminal("Go Get Terminal");
    terminal.show();
    terminal.sendText(`go get ${goPackage.importPath}`, false);
}
