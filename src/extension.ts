/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { workspace, languages, window, commands, ExtensionContext, Disposable } from 'vscode';
import ContentProvider, { encodeLocation } from './provider';
import { getSettings, getAndSetSettings } from './settings';

export function activate(context: ExtensionContext) {

	const provider = new ContentProvider();

	const providerRegistrations = Disposable.from(
		workspace.registerTextDocumentContentProvider(ContentProvider.scheme, provider),
	);

	const commandRegistration = commands.registerTextEditorCommand('azurePipelines.render', async (editor) => {
		await getAndSetSettings();
		const uri = encodeLocation(editor.document.uri, editor.selection.active);
		return workspace.openTextDocument(uri).then(doc => window.showTextDocument(doc, editor.viewColumn! + 1));
	});

	context.subscriptions.push(
		provider,
		commandRegistration,
		providerRegistrations
	);
}
