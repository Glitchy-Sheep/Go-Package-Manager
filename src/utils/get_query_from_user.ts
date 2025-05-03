import * as vscode from 'vscode';

/**
 * Prompts the user to enter a query and returns it.
 *
 * The query is validated to ensure it is not empty.
 *
 * @returns The non-empty query entered by the user or undefined if cancelled.
 */
export async function getQueryFromUser(): Promise<string | undefined> {
    const query = await vscode.window.showInputBox({
        placeHolder: 'Type package name or other keywords',
        prompt: 'Please enter a query',
        validateInput: (input) => {
            if (input.trim().length === 0) {
                return "The query can't be empty!";
            }
            return null;
        }
    });

    if (query) {
        return query;
    } else {
        return undefined;
    }
}
