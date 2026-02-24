import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class JupiterDEXApi implements ICredentialType {
	name = 'jupiterDEXApi';
	displayName = 'Jupiter DEX API';
	documentationUrl = 'https://station.jup.ag/docs/apis/swap-api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://quote-api.jup.ag/v6',
			description: 'Base URL for the Jupiter DEX API',
			required: true,
		},
		{
			displayName: 'Note',
			name: 'notice',
			type: 'notice',
			default: '',
			displayOptions: {
				show: {},
			},
		},
	];
}