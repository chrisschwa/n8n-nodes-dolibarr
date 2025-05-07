import {
	IDataObject,
	IRequestOptions,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

export class DolibarrNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Example Node',
		name: 'dolibarr',
		group: ['transform'],
		version: 1,
		description: 'Basic Example Node',
		defaults: {
			name: 'Example Node',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'dolibarrApi',
				required: true,
			},
		],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'API Key',
				name: 'apikey',
				type: 'string',
				typeOptions: { password: true },
				default: '',
			},
			{
				displayName: 'API URL',
				name: 'baseurl',
				type: 'string',
				default: '',
				required: true,
			},
			{
				displayName: 'Third Party ID',
				name: 'thidpartyid',
				type: 'string',
				default: '',
				required: true,
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Thirdparty',
						value: 'thirdparties',
						description: 'Geschäftspartner in Dolibarr',
					},
				],
				default: 'thirdparties',
				required: true,
				noDataExpression: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['thirdparties'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a thirdparty',
						action: 'Get a thirdparty',
					},
				],
				default: 'get',
				noDataExpression: true,
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		let responseData;
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// For each item, make an API call to create a contact
		for (let i = 0; i < items.length; i++) {
			if (resource === 'contact') {
				if (operation === 'create') {
					// Get email input
					const email = this.getNodeParameter('email', i) as string;
					// Get additional fields input
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
					const data: IDataObject = {
						email,
					};

					Object.assign(data, additionalFields);

					const options: IRequestOptions = {
						headers: {
							Accept: 'application/json',
						},
						method: 'GET',
						uri: `${this.getNodeParameter('baseurl', i)}/${this.getNodeParameter('thirdpartyid', i)}`,
						json: true,
					};
					responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'dolibarrApi',
						options,
					);
					returnData.push(responseData);
				}
			}
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
