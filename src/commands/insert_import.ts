import * as vscode from "vscode";
import { handlePackagePickerAction } from "../features/package-manager/pick_and_handle";
import { PackageInfo } from "../models/package_info";
import { PkgGoDevAPI } from "../services/pkgGoDevSearchService";

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