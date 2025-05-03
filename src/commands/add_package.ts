import { handlePackagePickerAction } from '../features/package-manager/pick_and_handle';
import { PkgGoDevAPI } from '../services/pkgGoDevSearchService';
import { goGetPackage } from '../utils/go_get_package';


export async function add_package_command() {
    handlePackagePickerAction(new PkgGoDevAPI(), goGetPackage);
}
