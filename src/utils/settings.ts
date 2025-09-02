import vscode from 'vscode';

export const CONFIG_KEY = 'endofline';

/* eslint-disable import/no-mutable-exports, @typescript-eslint/naming-convention */
export let EXTENSION_NAME: string = '';
/* eslint-enable */

let $channel: vscode.OutputChannel | null = null;
let $context: vscode.ExtensionContext | null = null;

export function getContext(): vscode.ExtensionContext {
	return $context!;
}

export function getDebugChannel(debug: boolean): vscode.OutputChannel | undefined { // {{{
	if(debug) {
		$channel ??= vscode.window.createOutputChannel(EXTENSION_NAME);

		return $channel;
	}

	return undefined;
} // }}}

export async function setupSettings(context: vscode.ExtensionContext) {
	EXTENSION_NAME = context.extension.packageJSON.displayName as string;

	$context = context;
}
