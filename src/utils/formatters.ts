import { PackageInfo } from '../models/package_info';


export function formatPackageItemLable(PackageInfo: PackageInfo) {
    return PackageInfo.name;
}

export function formatPackageItemDescription(PackageInfo: PackageInfo) {
    return `🌐 (${PackageInfo.url}) | 📌 ${PackageInfo.version} | 📈 ${PackageInfo.usedByCount} | 📃 ${PackageInfo.license}`;
}

export function formatPackageItemDetail(PackageInfo: PackageInfo) {
    return PackageInfo.description;
}
