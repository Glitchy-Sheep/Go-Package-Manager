import * as vscode from 'vscode';
import { PackageInfo } from './package_info';

/**
 * QuickPickItemWithPackageInfo extends vscode.QuickPickItem to supplement it
 * with PackageInfo for sorting purposes within the quick pick views
 */
export interface QuickPickItemWithPackageInfo extends vscode.QuickPickItem {
    package: PackageInfo;
}
