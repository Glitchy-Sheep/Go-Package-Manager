import * as vscode from 'vscode';
import { PkgGoDevHTTPError, PkgGoDevUnexpectedError } from '../services/pkg_go_dev_api';

const reportErrorButtonText = "Report Error";

export function notifyAboutNetworkConnectionError() {
    vscode.window.showErrorMessage(
        "Network error: Please check your connection and try again."
    );
}
export function notifyAboutUnexpectedError(error: PkgGoDevUnexpectedError | Error) {
    vscode.window.showErrorMessage(
        `Something unexpected happened during fetching, please report this.`,
        reportErrorButtonText
    ).then(
        (selection) => {
            if (selection === reportErrorButtonText) {
                let problemDetails = `

**Unexpected Error** during fetching packages. 

**Cause**:
${error.cause}

**Error message**: 
${error.message}

**Stack Trace**: 
${error.stack}

`;

                createBugReportFile(problemDetails);
            }
        }
    );
}
export function notifyAboutHttpError(error: PkgGoDevHTTPError) {
    vscode.window.showErrorMessage(
        `Unexpected Response Error: ${error.status} - ${error.statusText}.`,
        reportErrorButtonText
    ).then(
        (selection) => {
            if (selection === reportErrorButtonText) {
                let problemDetails = `

**HTTP Error** during fetching packages. 

**Status Code**: 
${error.status}

**Status Text**: 
${error.statusText}

**Error message**: 
${error.message}

**Response Data**: 
${error.responseData}

**Stack Trace**: 
${error.stack}

`;

                createBugReportFile(problemDetails);
            }
        }
    );
}


async function createBugReportFile(reportContent: string) {
    const greetings = `

🔧🐈 **Hey there! This is the Dev extension.** 🐈🔧

🛑 **It looks like something went wrong.**

Apologies for the inconvenience! 
I'm here to help and fix it for you.

🐛 **Please report the issue on the GitHub Issues page:**
https://github.com/Glitchy-Sheep/Go-Package-Manager/issues

To help me resolve the problem, 
please include the following details in your report:

`;

    const fullContent = greetings + reportContent;

    // Create a new untitled document with the content
    const document = await vscode.workspace.openTextDocument({
        content: fullContent,
        language: 'markdown',
    });

    await vscode.window.showTextDocument(document);
}
