/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from 'vscode';
import axios from 'axios';
import { getSettings } from './settings';

export default class RenderedPipelineDocument {

	get value() {
		return this.renderPipeline();
	}

	async renderPipeline(): Promise<any> {
		if (!vscode.window.activeTextEditor){
			return "Unable to render"
		}
	
		const settings = await getSettings();
	
		const yamlToRender: string = vscode.window.activeTextEditor.document.getText()
	
		const url = `https://dev.azure.com/${settings.devopsOrg}/${settings.devopsProject}/_apis/pipelines/${settings.pipelineId}/preview?api-version=6.1-preview.1`
		const response = await axios.post(url, {previewRun: true, yamlOverride: yamlToRender}, {
			auth: {
				username: '',
				password: `${settings.devopsPatToken}`
			}
		}).then(response => response.data).catch(error => {
			let message;
			if (error.response.data !== '') {
				message = `Failed: ${JSON.stringify(error.response.data)}`
			} else {
				message = `Failed: ${error['message']}`
			}
			vscode.window.showErrorMessage(message);
		});
		return response['finalYaml']
	}
}



