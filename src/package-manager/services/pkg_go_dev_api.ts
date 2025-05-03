import axios from "axios";
import * as cheerio from "cheerio";
import { parseGoPackageInfoFromHTML } from "../data/parse_html_package_info";
import { PackageInfo } from "../models/package_info";


/*
 * This module relies on web scraping to extract data from the site. As the HTML structure
 * of the site may change over time, the scraping mechanism may lack stability.
 * 
 * If an official API for https://pkg.go.dev becomes available in the future, this implementation
 * should be refactored to use the API for better stability and performance.
 *
 * But in general, the fetching mechanism is very efficient because 
 * it retrieves all the necessary data in a single request.
 */

/**
 * Fetches and parses information about the primary Go packages from https://pkg.go.dev.
 * 
 * @throws {PkgGoDevNetworkError} If a network error occurs (e.g., connection issues, timeouts).
 * @throws {PkgGoDevHTTPError} If the server responds with an HTTP error status (e.g., 404, 500).
 * @throws {PkgGoDevUnexpectedError} If an unexpected error or misconfiguration occurs.
 */
export class PkgGoDevAPI {
    private readonly baseUrl: string;

    constructor(baseUrl: string = "https://pkg.go.dev/") {
        this.baseUrl = baseUrl;
    }

    private generateUrl(resource: string): string {
        return this.baseUrl + resource;
    }

    public async searchPackage(query: string): Promise<PackageInfo[]> {
        // Example of the resulted page: 
        // https://pkg.go.dev/search?limit=100&q=mux
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
            if (!axios.isAxiosError(err)) {
                throw new PkgGoDevUnexpectedError("Something bad happened during package fetching\n");
            }

            if (!err.response) {
                throw new PkgGoDevNetworkError(err.code, err);
            }

            throw new PkgGoDevHTTPError(
                err.response.status,
                err.response.statusText,
                err.response.data,
                err,
            );
        }
    }
}

/**
 * Represents a general error when interacting with the GoDev API.
 * This is the base class for all specific API-related errors.
 * 
 * @class PkgGoDevAPIError
 * @extends {Error}
 */
export class PkgGoDevAPIError extends Error {
    constructor(
        message: string,
        public readonly cause?: Error
    ) {
        super(message);
        this.name = 'PkgGoDevAPIError';
    }
}

/**
 * Represents a network-related error, such as connection failures, timeouts, or DNS issues.
 * This error is thrown when the GoDev API request could not complete due to network issues.
 * 
 * @class PkgGoDevNetworkError
 * @extends {PkgGoDevAPIError}
 * @example
 * const error = new PkgGoDevNetworkError('ECONNREFUSED');
 * throw error;
 */
export class PkgGoDevNetworkError extends PkgGoDevAPIError {
    constructor(code?: string, cause?: Error) {
        const message = code ? 'Network error (' + code + ')' : 'Network error';
        super(message, cause);
        this.name = 'PkgGoDevNetworkError';
    }
}

/**
 * Represents an HTTP error encountered while interacting with the PkgGoDev API.
 * 
 * This error is thrown when the server responds with a non-success HTTP status code
 * (e.g., 4xx or 5xx). The error includes the status code, status text, and any
 * response data returned by the server, which can help in debugging or further error handling.
 * 
 * @extends {PkgGoDevAPIError}
 * 
 * @param {number} status - The HTTP status code returned by the server (e.g., 404, 500).
 * @param {string} statusText - The HTTP status text corresponding to the status code (e.g., "Not Found", "Internal Server Error").
 * @param {any} [responseData] - The response data returned by the server (optional). Can be useful for debugging or providing more context about the error.
 * @param {Error} [cause] - The underlying error, if any (optional). This can provide more context or an original error that caused this HTTP error.
 * 
 * @throws {PkgGoDevHTTPError} If the HTTP request results in an error with the provided status and statusText.
 */
export class PkgGoDevHTTPError extends PkgGoDevAPIError {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        public readonly responseData?: any,
        cause?: Error
    ) {
        super(`HTTP ${status}: ${statusText}`, cause);
        this.name = 'PkgGoDevHTTPError';
    }
}

/**
 * Represents an unexpected error encountered while interacting with the PkgGoDev API.
 * 
 * This error is thrown when an unforeseen error occurs that doesn't fall into specific
 * categories like network or HTTP errors. It is a general-purpose error used to capture
 * edge cases, misconfigurations, or unknown issues.
 * 
 * @extends {PkgGoDevAPIError}
 * 
 * @param {string} message - A detailed error message describing the issue.
 * @param {Error} [cause] - The underlying error, if any (optional). This can provide more context or an original error that caused the unexpected error.
 * 
 * @throws {PkgGoDevUnexpectedError} If an unexpected or unknown error occurs while processing the request.
 */
export class PkgGoDevUnexpectedError extends PkgGoDevAPIError {
    constructor(message: string, cause?: Error) {
        super(message, cause);
        this.name = 'PkgGoDevUnexpectedError';
    }
}
