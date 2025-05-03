import * as vscode from "vscode";
import { PackageInfo } from "../package-manager/models/package_info";
import { handlePackagePickerAction } from "../package-manager/presentation/pick_and_handle";
import { PkgGoDevAPI } from "../package-manager/services/pkg_go_dev_api";

function insert_or_copy_package_import(selectedPackage: PackageInfo) {
    const editor = vscode.window.activeTextEditor;

    const importStatement = `import "${selectedPackage.importPath}"`;

    if (editor) {
        editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, importStatement);
        });
    } else {
        vscode.window.showInformationMessage(
            "📋 No active editor, import copied to your clipboard.",
        );
        vscode.env.clipboard.writeText(importStatement);
    }

}

export function insert_package_import_command() {
    handlePackagePickerAction(
        new PkgGoDevAPI(),
        insert_or_copy_package_import
    );
}