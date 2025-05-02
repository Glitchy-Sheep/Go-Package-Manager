import * as vscode from 'vscode';
import { PackageInfo } from '../models/package_info';
import { GoAPI } from '../services/pkgGoDevSearchService';
import { debounce } from '../utils/debounce';
import { formatPackageItemDescription, formatPackageItemDetail, formatPackageItemLable } from '../utils/formatters';

export async function add_package() {

    const quickPick = vscode.window.createQuickPick();
    quickPick.placeholder = 'Type package name...';
    quickPick.matchOnDescription = true;
    quickPick.matchOnDetail = true;

    const goApi = new GoAPI();

    const updateItems = async (query: string) => {
        try {
            const response = await goApi.searchPackage(query);

            const items = response.map((pkg: PackageInfo) => ({
                label: formatPackageItemLable(pkg),
                description: formatPackageItemDescription(pkg),
                detail: formatPackageItemDetail(pkg),
                data: pkg,
            }));

            quickPick.items = items;
        } catch (error) {
            console.error('Error fetching Go package data:', error);
            quickPick.items = [];
        }
    };

    const debouncedUpdateItems = debounce(updateItems, 2000);

    quickPick.onDidChangeValue(query => {
        quickPick.items = [];
        debouncedUpdateItems(query);
    });

    quickPick.onDidHide(() => quickPick.dispose());

    quickPick.show();
}
