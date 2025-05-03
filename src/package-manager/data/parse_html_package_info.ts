import { Cheerio } from "cheerio";
import { Element } from "domhandler";
import { PackageInfo } from "../models/package_info";

/**
 * Parses a Cheerio<Element> representing an HTML block of a Go package from pkg.go.dev,
 * and transforms it into a PackageInfo object for convenience.
 * 
 * @param p - The HTML element to parse.
 * @param baseUrl - The base URL used for resolving relative links.
 * @returns A parsed PackageInfo object.
 */
export function parseGoPackageInfoFromHTML(
    packageElement: Cheerio<Element>,
    baseUrl: string
): PackageInfo {
    const pe = packageElement;

    // Anchor and URL parsing
    const anchor = pe.find("h2 a").first();
    const rawPackageUrl = anchor.attr("href") ?? "";
    const relativeUrl = rawPackageUrl.startsWith("/") ? rawPackageUrl.slice(1) : rawPackageUrl;
    const fullUrl = baseUrl + relativeUrl;

    // Extract name and import path
    const importPathMatch = /\((.*?)\)/.exec(anchor.text());
    const name = anchor.clone().children().remove().end().text().trim();
    const importPath = importPathMatch ? importPathMatch[1].trim() : "";

    // Other metadata
    const description = pe.find(".SearchSnippet-synopsis").text().trim();
    const usedByCount = pe.find(".SearchSnippet-infoLabel a strong").first().text().trim();
    const version = pe.find(".SearchSnippet-infoLabel strong").eq(1).text().trim();
    const publishedDate = pe.find('[data-test-id="snippet-published"] strong').text().trim();
    const license = pe.find('[data-test-id="snippet-license"] a').text().trim();

    return {
        name,
        importPath,
        description,
        usedByCount,
        license,
        version: `${version} published on ${publishedDate}`,
        url: fullUrl,
    };
}
