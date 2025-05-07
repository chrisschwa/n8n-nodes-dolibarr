import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

export class DolibarrCredentialsApi implements ICredentialType {
	name = 'dolibarrApi';
	displayName = 'Dolibarr API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apikey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];

	// This credential is currently not used by any node directly
	// but the HTTP Request node can use it to make requests.
	// The credential is also testable due to the `test` property below
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				DOLAPIKEY: '{{ $credentials.apikey }}',
			},
		},
	};
}
