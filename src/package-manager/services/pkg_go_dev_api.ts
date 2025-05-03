import axios from "axios";
import * as cheerio from "cheerio";
import { parseGoPackageInfoFromHTML } from "../data/parse_html_package_info";
import { PackageInfo } from "../models/package_info";

export class PkgGoDevAPI {
    private readonly baseUrl: string;

    constructor(baseUrl: string = "https://pkg.go.dev/") {
        this.baseUrl = baseUrl;
    }

    private generateUrl(resource: string): string {
        return this.baseUrl + resource;
    }

    public async searchPackage(query: string): Promise<PackageInfo[]> {
        const fullQuery = `search?limit=100&m=package&q=${encodeURIComponent(query)}#more-results`;
        const queryUrl = this.generateUrl(fullQuery);

        try {
            const { data: html } = await axios.get(queryUrl, {
                headers: { "User-Agent": "Mozilla/5.0" },
            });

            const $ = cheerio.load(html);
            const packages: PackageInfo[] = [];

            const rootPackagesHtmlContainer = $(".SearchSnippet");

            rootPackagesHtmlContainer.each((_, packageHtml) => {
                let packageCheerioElement = $(packageHtml);
                const packageInfo = parseGoPackageInfoFromHTML(packageCheerioElement, this.baseUrl);
                packages.push(packageInfo);
            });

            return packages;
        } catch (err: any) {
            throw new Error(`Search failed: ${err.message}`);
        }
    }

}
