import * as vscode from 'vscode';
import { queryPackageList } from '../services/goPackageService';
import { debounce } from '../utils/debounce';

export async function add_package() {

    const quickPick = vscode.window.createQuickPick();
    quickPick.placeholder = 'Type package name...';
    quickPick.matchOnDescription = true;
    quickPick.matchOnDetail = true;

    const updateItems = (query: string) => {
        quickPick.items = queryPackageList(query);
    };

    const debouncedUpdateItems = debounce(updateItems, 2000);

    quickPick.onDidChangeValue(query => {
        quickPick.items = [];
        debouncedUpdateItems(query);
    });

    quickPick.onDidHide(() => quickPick.dispose());

    quickPick.show();
}
