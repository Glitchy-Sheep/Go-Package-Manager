/**
 * Metadata about a Go package parsed from pkg.go.dev.
 * @see https://pkg.go.dev for examples
 */
export interface PackageInfo {
    /** Package name (usually matches last segment of import path). */
    name: string;

    /** Short description or synopsis from pkg.go.dev. */
    description: string;

    /** Number of other packages that depend on this one. */
    usedByCount: string;

    /** License identifier (e.g., MIT, BSD-3-Clause). */
    license: string;

    /**
     * Latest version string with publish date,
     * e.g., "v1.2.3 • Jan 2025".
     */
    version: string;

    /**
     * Canonical import path used in `import` and `go get` statements.
     * e.g., "github.com/user/repo/pkg"
     */
    importPath: string;

    /** Direct URL to the package page on pkg.go.dev. */
    url: string;
}
