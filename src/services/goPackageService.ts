import * as vscode from 'vscode';
import { PackageInfo } from '../models/package_info';
import { formatPackageItemDescription, formatPackageItemDetail, formatPackageItemLable } from '../utils/formatters';

export function queryPackageList(query: string): vscode.QuickPickItem[] {

    // Mock data yet
    let packageList: PackageInfo[] = [
        {
            name: 'ginkgo',
            description: 'BDD Testing Framework for Go',
            importPath: 'github.com/onsi/ginkgo',
            usedByCount: '1.3k',
            license: 'MIT',
            version: 'v1.16.4',
            url: 'https://github.com/onsi/ginkgo',
        },
        {
            name: 'go-redis',
            description: 'Type-safe Redis client for Golang',
            importPath: 'github.com/go-redis/redis/v8',
            usedByCount: '1.4k',
            license: 'MIT',
            version: 'v8.11.4',
            url: 'https://github.com/go-redis/redis',
        },
        {
            name: 'go-sql-driver/mysql',
            description: 'Go SQL Driver for MySQL',
            importPath: 'github.com/go-sql-driver/mysql',
            usedByCount: '1.9k',
            license: 'MIT',
            version: 'v1.7.0',
            url: 'https://github.com/go-sql-driver/mysql',
        },
    ];

    let items = packageList.map((pkg) => ({
        label: formatPackageItemLable(pkg),
        description: formatPackageItemDescription(pkg),
        detail: formatPackageItemDetail(pkg),
        buttons: [
            {
                iconPath: new vscode.ThemeIcon("link"),
                tooltip: 'Open package web page',
            },
        ],
    }));

    return items;
}
