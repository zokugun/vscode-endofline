import * as vscode from 'vscode';
import { debounceWithMaxWait } from './debounce-with-max-wait.js';
import { Disposable } from './utils/disposable.js';
import { CONFIG_KEY } from './utils/settings.js';

const EOL_REGEXP = /\r\n|\n|\r/g;
const OUTPUT_NAME_REGEXP = /extension-output-zokugun\.endofline-#\d+-EndOfLine/;

export class DocumentManager implements vscode.Disposable {
	private active: vscode.TextDocument | null = null;
	private decorationType: vscode.TextEditorDecorationType | null = null;
	private readonly disposable: Disposable = new Disposable();
	private enabled: boolean = false;
	private renderOptions: Record<string, Record<number, vscode.DecorationInstanceRenderOptions>> = {};

	public activate(context: vscode.ExtensionContext) {
		this.configure();

		vscode.workspace.onDidChangeConfiguration((event) => {
			if(event.affectsConfiguration(CONFIG_KEY)) {
				this.configure();
			}
		});

		context.subscriptions.push(this);
	}

	public dispose(): void {
		this.disposable.dispose();
		this.decorationType?.dispose();
	}

	private configure(): void {
		const config = vscode.workspace.getConfiguration(CONFIG_KEY, null);
		const wasEnabled = this.enabled;

		this.enabled = config.get<boolean>('enabled') ?? true;

		if(!this.enabled) {
			this.disposable.dispose();
			this.decorationType?.dispose();

			this.decorationType = null;

			return;
		}

		if(!wasEnabled) {
			this.decorationType ??= vscode.window.createTextEditorDecorationType({});

			for(const editor of vscode.window.visibleTextEditors) {
				this.updateDecorations(editor);
			}

			this.disposable.push(
				vscode.window.onDidChangeActiveTextEditor((editor) => this.onDidChangeActiveTextEditor(editor)),
				vscode.window.onDidChangeTextEditorVisibleRanges(
					debounceWithMaxWait(
						(event) => this.onDidChangeTextEditorVisibleRanges(event),
						({ textEditor }) => this.active === textEditor.document,
						50,
						100,
					),
				),
				vscode.workspace.onDidChangeTextDocument(
					debounceWithMaxWait(
						(event) => this.onDidChangeTextDocument(event),
						(event) => this.active === event.document,
						50,
						100,
					),
				),
				vscode.window.onDidChangeVisibleTextEditors((event) => {
					for(const editor of event) {
						this.updateDecorations(editor);
					}
				}),
			);
		}
	}

	private configureOptions(config: vscode.WorkspaceConfiguration, languageId: string): void {
		const options = {};
		const style: {
			color: vscode.ThemeColor;
			opacity?: number | string;
		} = {
			color: new vscode.ThemeColor('editorWhitespace.foreground'),
			...config.get<object>('style'),
		};

		if(typeof style.opacity === 'number') {
			style.opacity = `${style.opacity}`;
		}

		for(const [configKey, optionHash] of [['cr', 1 + 13], ['crlf', 2 + 13], ['lf', 1 + 10]]) {
			const symbolStyle = { ...config.get<object>(`${configKey}.style`) };

			const symbolText = config.get<string>(`${configKey}.symbol`);
			const renderOptions: vscode.DecorationInstanceRenderOptions = {
				after: {
					contentText: symbolText,
					...style,
					...symbolStyle,
				},
			};

			options[optionHash] = renderOptions;
		}

		this.renderOptions[languageId] = options;
	}

	private onDidChangeActiveTextEditor(editor: vscode.TextEditor | undefined): void {
		if(!editor || this.active === editor.document || OUTPUT_NAME_REGEXP.test(editor.document.fileName)) {
			return;
		}

		this.active = editor.document;

		this.updateDecorations(editor);
	}

	private onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent): void {
		if(this.active === event.document) {
			this.updateDecorations(vscode.window.activeTextEditor!);
		}
	}

	private onDidChangeTextEditorVisibleRanges({ textEditor, visibleRanges }: vscode.TextEditorVisibleRangesChangeEvent): void {
		if(this.active === textEditor.document) {
			this.updateDecorations(textEditor, visibleRanges);
		}
	}

	private updateDecorations(editor: vscode.TextEditor, ranges?: readonly vscode.Range[]) {
		const document = editor.document;
		const { languageId } = document;

		if(!this.renderOptions[languageId]) {
			const config = vscode.workspace.getConfiguration(CONFIG_KEY, editor.document);

			this.configureOptions(config, languageId);
		}

		const options = this.renderOptions[languageId];
		const text = document.getText();
		const visibleRanges = ranges ?? editor.visibleRanges;

		let beginOffset = 0;
		let endOffset = text.length;

		for(const range of visibleRanges) {
			let offset = document.offsetAt(range.start);

			if(beginOffset > offset) {
				beginOffset = offset;
			}

			offset = document.offsetAt(range.end);
			if(endOffset < offset) {
				endOffset = offset;
			}
		}

		const rangeText = text.slice(beginOffset, endOffset);
		const decorations: Array<{ range: vscode.Range; renderOptions: vscode.DecorationInstanceRenderOptions }> = [];
		let match: RegExpExecArray | null;

		while((match = EOL_REGEXP.exec(rangeText))) {
			const renderOptions = options[match[0].length + match[0].codePointAt(0)!];
			const position = document.positionAt(match.index + beginOffset);
			const range = new vscode.Range(position, position);

			decorations.push({
				range,
				renderOptions,
			});
		}

		editor.setDecorations(this.decorationType!, decorations);
	}
}
