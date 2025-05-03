import * as vscode from 'vscode';
import { PackageInfo } from '../package-manager/models/package_info';
import { handlePackagePickerAction } from '../package-manager/presentation/pick_and_handle';
import { PkgGoDevAPI } from '../package-manager/services/pkg_go_dev_api';

function goGetPackage(goPackage: PackageInfo) {
    const terminal = vscode.window.createTerminal("Go Get Terminal");
    terminal.show();
    terminal.sendText(`go get ${goPackage.importPath}`, false);
}

export async function add_package_command() {
    handlePackagePickerAction(new PkgGoDevAPI(), goGetPackage);
}
