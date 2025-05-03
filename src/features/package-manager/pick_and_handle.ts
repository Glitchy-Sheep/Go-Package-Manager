import * as vscode from 'vscode';
import { PackageInfo } from "../../models/package_info";
import { QuickPickItemWithPackageInfo } from '../../models/quick_pick_item_with_package_info';
import { PkgGoDevAPI } from '../../services/pkgGoDevSearchService';
import { getQueryFromUser } from "../../utils/get_query_from_user";
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
    } catch (error) {
        packagePicker.hide();
        vscode.window.showErrorMessage((error as Error).message);
    }
}
