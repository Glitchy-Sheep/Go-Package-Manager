import * as vscode from 'vscode';
import { getQueryFromUser } from '../../utils/get_query_from_user';
import { PackageInfo } from "../models/package_info";
import { QuickPickItemWithPackageInfo } from '../models/quick_pick_item_with_package_info';
import { PkgGoDevAPI, PkgGoDevHTTPError, PkgGoDevNetworkError, PkgGoDevUnexpectedError } from '../services/pkg_go_dev_api';
import { notifyAboutHttpError, notifyAboutNetworkConnectionError, notifyAboutUnexpectedError } from './error_reporters';
import { formatPackageItemDescription, formatPackageItemDetail, formatPackageItemLable } from './formatters';


const PackagePickerStates = {
    setLoading(quickPick: vscode.QuickPick<vscode.QuickPickItem>) {
        quickPick.title = 'Add go package';
        quickPick.value = "";
        quickPick.placeholder = 'Loading package list, please wait...';
        quickPick.enabled = false;
    },

    setResults(quickPick: vscode.QuickPick<vscode.QuickPickItem>, items: vscode.QuickPickItem[]) {
        // Allow fuzzy search by anything
        quickPick.enabled = true;
        quickPick.title = 'Add go package';
        quickPick.placeholder = 'Search by package name/description/detail';
        quickPick.items = items;
    }
};

function packageToQuickPickItem(pkg: PackageInfo): QuickPickItemWithPackageInfo {
    return {
        label: formatPackageItemLable(pkg),
        description: formatPackageItemDescription(pkg),
        detail: formatPackageItemDetail(pkg),
        package: pkg,
        buttons: [
            {
                iconPath: new vscode.ThemeIcon('globe'), // 🌐 icon
                tooltip: 'Open the package in browser (docs)'
            }
        ]
    };
}

/**
 * General package picker logic which calls the provided action for selected package
 *
 * If no query is provider or the user cancels, nothing happens
 *
 * @param pkgGoDevAPI - provider of packages 
 * @param action - callback for selected package
 * @returns 
 */
export async function handlePackagePickerAction(
    pkgGoDevAPI: PkgGoDevAPI,
    action: (pkg: PackageInfo) => void
) {
    let query = await getQueryFromUser();
    if (query === undefined) {
        return;
    }

    const packagePicker = vscode.window.createQuickPick<QuickPickItemWithPackageInfo>();
    packagePicker.onDidHide(() => packagePicker.dispose());
    packagePicker.matchOnDescription = true;
    packagePicker.matchOnDetail = true;

    packagePicker.onDidAccept(() => {
        packagePicker.hide();
        const selectedPackage = packagePicker.selectedItems[0].package;
        action(selectedPackage); // Call the provided action (either goGetPackage or insertImport)
    });

    PackagePickerStates.setLoading(packagePicker);
    packagePicker.show();

    packagePicker.onDidTriggerItemButton((element) => {
        const link = element.item.package.url;
        vscode.env.openExternal(vscode.Uri.parse(link));
    });

    try {
        const response = await pkgGoDevAPI.searchPackage(query);

        let usageSortedPackages = response.toSorted((a, b) => {
            const countA = parseInt(a.usedByCount.replace(/,/g, '')) || 0;
            const countB = parseInt(b.usedByCount.replace(/,/g, '')) || 0;
            return countB - countA;
        });

        const packagePickerItems = usageSortedPackages.map(packageToQuickPickItem);

        if (packagePickerItems.length === 0) {
            packagePicker.hide();
            vscode.window.showErrorMessage(`No packages found by your query (${query})`);
            return;
        }

        PackagePickerStates.setResults(packagePicker, packagePickerItems);

    } catch (error: any) {
        packagePicker.hide();

        if (error instanceof PkgGoDevNetworkError) {
            notifyAboutNetworkConnectionError();
        } else if (error instanceof PkgGoDevHTTPError) {
            // It can be destructive error which break the extension 
            // so let the user report the bug.
            notifyAboutHttpError(error);
        } else if (error instanceof PkgGoDevUnexpectedError) {
            // This is really bad case, shouldn't really even happen 
            // but if so, let the user report the bug.
            notifyAboutUnexpectedError(error);
        } else {
            // Critical hit, unexpected unexptectedness ✨
            notifyAboutUnexpectedError(error);
        }
    }
}
