import { PackageInfo } from '../../models/package_info';


export function formatPackageItemLable(PackageInfo: PackageInfo) {
    const url = `🌐 ${PackageInfo.url}`;
    const name = `📦 ${PackageInfo.name}`;
    return `${name} | ${url}`;
}

export function formatPackageItemDescription(PackageInfo: PackageInfo) {
    const version = `📌 ${PackageInfo.version}`;
    return `${version} `;
}

export function formatPackageItemDetail(PackageInfo: PackageInfo) {
    const usedByCount = `📈 ${PackageInfo.usedByCount} `;
    const license = `📃 ${PackageInfo.license} `;

    return `${usedByCount} | ${license} | ${PackageInfo.description} `;
}
