import * as vscode from 'vscode';
import RenderedPipelineDocument from './renderedPipelineDocument';

export default class Provider implements vscode.TextDocumentContentProvider {

	static scheme = 'renderedPipeline';

	private _documents = new Map<string, RenderedPipelineDocument>();
	private _editorDecoration = vscode.window.createTextEditorDecorationType({ textDecoration: 'underline' });
	private _subscriptions: vscode.Disposable;
	

	constructor() {

		// Listen to the `closeTextDocument`-event which means we must
		// clear the corresponding model object - `RenderedPipelineDocument`
		this._subscriptions = vscode.workspace.onDidCloseTextDocument(doc => this._documents.delete(doc.uri.toString()));
	}

	dispose() {
		this._subscriptions.dispose();
		this._documents.clear();
		this._editorDecoration.dispose();
	}

	provideTextDocumentContent(uri: vscode.Uri): string | Thenable<string> {

		// already loaded?
		const document = this._documents.get(uri.toString());
		if (document) {
			return document.value;
		}

		const [target, pos] = decodeLocation(uri);
		return vscode.commands.executeCommand<vscode.Location[]>('vscode.executeReferenceProvider', target, pos).then(locations => {

			// create document and return its early state
			const document = new RenderedPipelineDocument();
			this._documents.set(uri.toString(), document);
			return document.value;
		});
	}
}

let seq = 0;

export function encodeLocation(uri: vscode.Uri, pos: vscode.Position): vscode.Uri {
	const query = JSON.stringify([uri.toString(), pos.line, pos.character]);
	return vscode.Uri.parse(`${Provider.scheme}:FinalYaml.yml?${query}#${seq++}`);
}

export function decodeLocation(uri: vscode.Uri): [vscode.Uri, vscode.Position] {
	const [target, line, character] = <[string, number, number]>JSON.parse(uri.query);
	return [vscode.Uri.parse(target), new vscode.Position(line, character)];
}
