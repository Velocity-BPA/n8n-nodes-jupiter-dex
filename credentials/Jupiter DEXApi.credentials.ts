import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class JupiterDEXApi implements ICredentialType {
	name = 'jupiterDEXApi';
	displayName = 'Jupiter DEX API';
	documentationUrl = 'https://station.jup.ag/api-v6';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://quote-api.jup.ag/v6',
			required: true,
			description: 'The base URL for Jupiter DEX API',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Optional API key for higher rate limits and priority routing',
		},
		{
			displayName: 'Solana Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Solana wallet private key (base58 encoded) for signing swap transactions',
		},
		{
			displayName: 'Wallet Public Key',
			name: 'publicKey',
			type: 'string',
			default: '',
			description: 'Solana wallet public key (base58 encoded)',
		},
	];
}