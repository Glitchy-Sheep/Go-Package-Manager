import axios from "axios";
import * as cheerio from "cheerio";
import { PackageInfo } from "../models/package_info";

export class GoAPI {
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

            $(".SearchSnippet").each((_, el) => {
                const anchor = $(el).find("h2 a").first();
                const url = anchor.attr("href") ?? "";
                const fullUrl = url.startsWith("/") ? url.substring(1) : url;


                const importPathMatch = RegExp(/\((.*?)\)/).exec(anchor.text());
                const name = anchor.clone().children().remove().end().text().trim();
                const importPath = importPathMatch ? importPathMatch[1].trim() : "";

                const description = $(el).find(".SearchSnippet-synopsis").text().trim();

                const usedByCount = $(el)
                    .find(".SearchSnippet-infoLabel a strong")
                    .first()
                    .text()
                    .trim();

                const version = $(el)
                    .find(".SearchSnippet-infoLabel strong")
                    .eq(1)
                    .text()
                    .trim();
                const publishedDate = $(el)
                    .find('[data-test-id="snippet-published"] strong')
                    .text()
                    .trim();

                const license = $(el)
                    .find('[data-test-id="snippet-license"] a')
                    .text()
                    .trim();

                packages.push({
                    name,
                    importPath,
                    description,
                    usedByCount,
                    license,
                    version: `${version} published on ${publishedDate}`,
                    url: fullUrl,
                });
            });

            return packages;
        } catch (err: any) {
            throw new Error(`Search failed: ${err.message}`);
        }
    }

}
