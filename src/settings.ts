import { workspace, window } from 'vscode';


export async function getAndSetSettings() {
	const settings = await getSettings()
	
	if (settings.devopsOrg === '') {
		const org = await window.showInputBox({
			placeHolder: 'Name of your Azure DevOps Organisation'
		});
		settings.devopsOrg = org;
		workspace.getConfiguration('azurePipelinesRender').update('devopsOrganisation', org);
	};
	if (settings.devopsProject === '') {
		const project = await window.showInputBox({
			placeHolder: 'Name of your Azure DevOps Project'
		});
		settings.devopsProject = project;
		workspace.getConfiguration('azurePipelinesRender').update('devopsProject', project);
	};
	if (settings.devopsPatToken === '') {
		const token = await window.showInputBox({
			placeHolder: 'Your Azure DevOps PAT Token'
		});
		settings.devopsPatToken = token
		workspace.getConfiguration('azurePipelinesRender').update('devopsPatToken', token);
	};
	if (settings.pipelineId === '') {
		const id = await window.showInputBox({
			placeHolder: 'Your Azure DevOps Pipeline ID'
		});
		settings.pipelineId = id
		workspace.getConfiguration('azurePipelinesRender').update('pipelineId', id);
	};

	return {
		devopsOrg: settings.devopsOrg,
		devopsProject: settings.devopsProject,
		devopsPatToken: settings.devopsPatToken,
		pipelineId: settings.pipelineId,
	}

}

export async function getSettings() {
	const devopsOrg = workspace.getConfiguration('azurePipelinesRender').get<string>('devopsOrganisation');
	const devopsProject = workspace.getConfiguration('azurePipelinesRender').get<string>('devopsProject');
	const devopsPatToken = workspace.getConfiguration('azurePipelinesRender').get<string>('devopsPatToken');
	const pipelineId = workspace.getConfiguration('azurePipelinesRender').get<string>('pipelineId');
	

	return {
		devopsOrg: devopsOrg,
		devopsProject: devopsProject,
		devopsPatToken: devopsPatToken,
		pipelineId: pipelineId,
	}
}