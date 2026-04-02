/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-jupiterdex/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class JupiterDEX implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Jupiter DEX',
    name: 'jupiterdex',
    icon: 'file:jupiterdex.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Jupiter DEX API',
    defaults: {
      name: 'Jupiter DEX',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'jupiterdexApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Quote',
            value: 'quote',
          },
          {
            name: 'Swap',
            value: 'swap',
          },
          {
            name: 'Price',
            value: 'price',
          },
          {
            name: 'Token',
            value: 'token',
          },
          {
            name: 'LimitOrder',
            value: 'limitOrder',
          },
          {
            name: 'DCA',
            value: 'dCA',
          },
          {
            name: 'SwapQuotes',
            value: 'swapQuotes',
          },
          {
            name: 'TokenPrices',
            value: 'tokenPrices',
          },
          {
            name: 'LimitOrders',
            value: 'limitOrders',
          },
          {
            name: 'DcaOrders',
            value: 'dcaOrders',
          },
          {
            name: 'PerpetualPositions',
            value: 'perpetualPositions',
          },
          {
            name: 'JlpOperations',
            value: 'jlpOperations',
          }
        ],
        default: 'quote',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['quote'] } },
  options: [
    { name: 'Get Quote', value: 'getQuote', description: 'Get swap quote between two tokens', action: 'Get swap quote' },
    { name: 'Get Quote By Input Amount', value: 'getQuoteByInputAmount', description: 'Get quote specifying exact input amount', action: 'Get quote by input amount' },
    { name: 'Get Quote By Output Amount', value: 'getQuoteByOutputAmount', description: 'Get quote specifying exact output amount', action: 'Get quote by output amount' }
  ],
  default: 'getQuote',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['swap'] } },
	options: [
		{ name: 'Execute Swap', value: 'executeSwap', description: 'Create and execute token swap transaction', action: 'Execute swap' },
		{ name: 'Get Swap Instructions', value: 'getSwapInstructions', description: 'Get swap instructions without executing', action: 'Get swap instructions' }
	],
	default: 'executeSwap',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['price'] } },
  options: [
    { name: 'Get Price', value: 'getPrice', description: 'Get current price for tokens', action: 'Get current price for tokens' },
    { name: 'Get All Prices', value: 'getAllPrices', description: 'Get prices for multiple tokens', action: 'Get prices for multiple tokens' }
  ],
  default: 'getPrice',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['token'] } },
	options: [
		{ name: 'Get All Tokens', value: 'getAllTokens', description: 'Get list of all supported tokens', action: 'Get all tokens' },
		{ name: 'Get Program ID to Label', value: 'getProgramIdToLabel', description: 'Get program ID to label mappings', action: 'Get program ID to label mappings' },
		{ name: 'Get Indexed Route Map', value: 'getIndexedRouteMap', description: 'Get route map for supported token pairs', action: 'Get indexed route map' },
	],
	default: 'getAllTokens',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['limitOrder'] } },
  options: [
    { name: 'Create Limit Order', value: 'createLimitOrder', description: 'Create a new limit order', action: 'Create limit order' },
    { name: 'Get Limit Orders', value: 'getLimitOrders', description: 'Get limit orders for user', action: 'Get limit orders' },
    { name: 'Cancel Limit Order', value: 'cancelLimitOrder', description: 'Cancel existing limit order', action: 'Cancel limit order' },
    { name: 'Get Limit Order History', value: 'getLimitOrderHistory', description: 'Get limit order history', action: 'Get limit order history' }
  ],
  default: 'createLimitOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['dCA'] } },
  options: [
    { name: 'Create DCA Order', value: 'createDCA', description: 'Create a new Dollar Cost Averaging order', action: 'Create DCA order' },
    { name: 'Get DCA Orders', value: 'getDCAOrders', description: 'Get DCA orders for a user', action: 'Get DCA orders' },
    { name: 'Close DCA Order', value: 'closeDCA', description: 'Close an existing DCA order', action: 'Close DCA order' },
    { name: 'Get DCA History', value: 'getDCAHistory', description: 'Get DCA order history for a user', action: 'Get DCA history' }
  ],
  default: 'createDCA',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['swapQuotes'],
    },
  },
  options: [
    {
      name: 'Get Quote',
      value: 'getQuote',
      description: 'Get swap quote for token pair',
      action: 'Get swap quote',
    },
    {
      name: 'Get Swap Instructions',
      value: 'getSwapInstructions',
      description: 'Get serialized swap transaction',
      action: 'Get swap instructions',
    },
    {
      name: 'Execute Swap',
      value: 'executeSwap',
      description: 'Execute swap transaction',
      action: 'Execute swap transaction',
    },
  ],
  default: 'getQuote',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['tokenPrices'],
    },
  },
  options: [
    {
      name: 'Get Token Price',
      value: 'getTokenPrice',
      description: 'Get current token price',
      action: 'Get token price',
    },
    {
      name: 'Get All Tokens',
      value: 'getAllTokens',
      description: 'Get list of all supported tokens',
      action: 'Get all tokens',
    },
    {
      name: 'Get Program Labels',
      value: 'getProgramLabels',
      description: 'Get program ID to label mappings',
      action: 'Get program labels',
    },
  ],
  default: 'getTokenPrice',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['limitOrders'],
    },
  },
  options: [
    {
      name: 'Create Limit Order',
      value: 'createLimitOrder',
      description: 'Create a new limit order',
      action: 'Create limit order',
    },
    {
      name: 'Get Limit Order',
      value: 'getLimitOrder',
      description: 'Get specific limit order details',
      action: 'Get limit order',
    },
    {
      name: 'Get All Limit Orders',
      value: 'getAllLimitOrders',
      description: 'Get all limit orders for wallet',
      action: 'Get all limit orders',
    },
    {
      name: 'Cancel Limit Order',
      value: 'cancelLimitOrder',
      description: 'Cancel existing limit order',
      action: 'Cancel limit order',
    },
    {
      name: 'Get Limit Order History',
      value: 'getLimitOrderHistory',
      description: 'Get limit order execution history',
      action: 'Get limit order history',
    },
  ],
  default: 'createLimitOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['dcaOrders'],
    },
  },
  options: [
    {
      name: 'Create DCA Order',
      value: 'createDcaOrder',
      description: 'Create a new Dollar Cost Averaging order',
      action: 'Create DCA order',
    },
    {
      name: 'Get DCA Order',
      value: 'getDcaOrder',
      description: 'Get a specific DCA order by public key',
      action: 'Get DCA order',
    },
    {
      name: 'Get All DCA Orders',
      value: 'getAllDcaOrders',
      description: 'Get all DCA orders for a wallet',
      action: 'Get all DCA orders',
    },
    {
      name: 'Close DCA Order',
      value: 'closeDcaOrder',
      description: 'Close or cancel an existing DCA order',
      action: 'Close DCA order',
    },
    {
      name: 'Get DCA History',
      value: 'getDcaHistory',
      description: 'Get DCA execution history for a wallet',
      action: 'Get DCA history',
    },
  ],
  default: 'createDcaOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['perpetualPositions'],
    },
  },
  options: [
    {
      name: 'Get Perpetual Markets',
      value: 'getPerpMarkets',
      description: 'Get all available perpetual markets',
      action: 'Get perpetual markets',
    },
    {
      name: 'Create Perpetual Order',
      value: 'createPerpOrder',
      description: 'Create a new perpetual futures order',
      action: 'Create perpetual order',
    },
    {
      name: 'Get Perpetual Positions',
      value: 'getPerpPositions',
      description: 'Get current perpetual positions for a wallet',
      action: 'Get perpetual positions',
    },
    {
      name: 'Get Perpetual Orders',
      value: 'getPerpOrders',
      description: 'Get open perpetual orders for a wallet',
      action: 'Get perpetual orders',
    },
    {
      name: 'Cancel Perpetual Order',
      value: 'cancelPerpOrder',
      description: 'Cancel an open perpetual order',
      action: 'Cancel perpetual order',
    },
  ],
  default: 'getPerpMarkets',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['jlpOperations'],
    },
  },
  options: [
    {
      name: 'Get JLP Price',
      value: 'getJlpPrice',
      description: 'Get current JLP token price',
      action: 'Get JLP price',
    },
    {
      name: 'Deposit to JLP',
      value: 'depositToJlp',
      description: 'Deposit tokens to JLP pool',
      action: 'Deposit to JLP pool',
    },
    {
      name: 'Withdraw from JLP',
      value: 'withdrawFromJlp',
      description: 'Withdraw from JLP pool',
      action: 'Withdraw from JLP pool',
    },
    {
      name: 'Get JLP Positions',
      value: 'getJlpPositions',
      description: 'Get JLP pool positions for a wallet',
      action: 'Get JLP positions',
    },
    {
      name: 'Get JLP Stats',
      value: 'getJlpStats',
      description: 'Get JLP pool statistics',
      action: 'Get JLP stats',
    },
  ],
  default: 'getJlpPrice',
},
{
  displayName: 'Input Mint',
  name: 'inputMint',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['quote'],
      operation: ['getQuote', 'getQuoteByInputAmount', 'getQuoteByOutputAmount']
    }
  },
  default: '',
  description: 'The mint address of the input token'
},
{
  displayName: 'Output Mint',
  name: 'outputMint',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['quote'],
      operation: ['getQuote', 'getQuoteByInputAmount', 'getQuoteByOutputAmount']
    }
  },
  default: '',
  description: 'The mint address of the output token'
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['quote'],
      operation: ['getQuote']
    }
  },
  default: '',
  description: 'The amount to swap'
},
{
  displayName: 'Input Amount',
  name: 'inputAmount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['quote'],
      operation: ['getQuoteByInputAmount']
    }
  },
  default: '',
  description: 'The exact input amount to swap'
},
{
  displayName: 'Output Amount',
  name: 'outputAmount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['quote'],
      operation: ['getQuoteByOutputAmount']
    }
  },
  default: '',
  description: 'The exact output amount to receive'
},
{
  displayName: 'Slippage BPS',
  name: 'slippageBps',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['quote'],
      operation: ['getQuote', 'getQuoteByInputAmount', 'getQuoteByOutputAmount']
    }
  },
  default: 50,
  description: 'Slippage tolerance in basis points (e.g., 50 = 0.5%)'
},
{
  displayName: 'Swap Mode',
  name: 'swapMode',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['quote'],
      operation: ['getQuote', 'getQuoteByInputAmount', 'getQuoteByOutputAmount']
    }
  },
  options: [
    { name: 'Exact In', value: 'ExactIn' },
    { name: 'Exact Out', value: 'ExactOut' }
  ],
  default: 'ExactIn',
  description: 'The swap mode to use'
},
{
  displayName: 'Dexes',
  name: 'dexes',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['quote'],
      operation: ['getQuote']
    }
  },
  default: '',
  description: 'Comma-separated list of DEXes to include (optional)'
},
{
  displayName: 'Exclude Dexes',
  name: 'excludeDexes',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['quote'],
      operation: ['getQuote']
    }
  },
  default: '',
  description: 'Comma-separated list of DEXes to exclude (optional)'
},
{
  displayName: 'Restrict Intermediate Tokens',
  name: 'restrictIntermediateTokens',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['quote'],
      operation: ['getQuote']
    }
  },
  default: false,
  description: 'Whether to restrict intermediate tokens'
},
{
  displayName: 'Only Direct Routes',
  name: 'onlyDirectRoutes',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['quote'],
      operation: ['getQuote']
    }
  },
  default: false,
  description: 'Whether to only use direct routes'
},
{
  displayName: 'As Legacy Transaction',
  name: 'asLegacyTransaction',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['quote'],
      operation: ['getQuote']
    }
  },
  default: false,
  description: 'Whether to use legacy transaction format'
},
{
  displayName: 'Platform Fee BPS',
  name: 'platformFeeBps',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['quote'],
      operation: ['getQuote']
    }
  },
  default: 0,
  description: 'Platform fee in basis points'
},
{
  displayName: 'Max Accounts',
  name: 'maxAccounts',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['quote'],
      operation: ['getQuote']
    }
  },
  default: 64,
  description: 'Maximum number of accounts in the transaction'
},
{
  displayName: 'Quote Mint',
  name: 'quoteMint',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['quote'],
      operation: ['getQuote']
    }
  },
  default: '',
  description: 'Quote mint address (optional)'
},
{
	displayName: 'Quote Response',
	name: 'quoteResponse',
	type: 'json',
	required: true,
	displayOptions: { show: { resource: ['swap'], operation: ['executeSwap', 'getSwapInstructions'] } },
	description: 'The quote response object from a previous quote request',
	default: '{}',
},
{
	displayName: 'User Public Key',
	name: 'userPublicKey',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['swap'], operation: ['executeSwap', 'getSwapInstructions'] } },
	description: 'The public key of the user executing the swap',
	default: '',
},
{
	displayName: 'Wrap and Unwrap SOL',
	name: 'wrapAndUnwrapSol',
	type: 'boolean',
	displayOptions: { show: { resource: ['swap'], operation: ['executeSwap', 'getSwapInstructions'] } },
	description: 'Whether to wrap/unwrap SOL in the transaction',
	default: true,
},
{
	displayName: 'Use Shared Accounts',
	name: 'useSharedAccounts',
	type: 'boolean',
	displayOptions: { show: { resource: ['swap'], operation: ['executeSwap', 'getSwapInstructions'] } },
	description: 'Whether to use shared accounts for optimization',
	default: true,
},
{
	displayName: 'Fee Account',
	name: 'feeAccount',
	type: 'string',
	displayOptions: { show: { resource: ['swap'], operation: ['executeSwap', 'getSwapInstructions'] } },
	description: 'Optional fee account for referral fees',
	default: '',
},
{
	displayName: 'Compute Unit Price (Micro Lamports)',
	name: 'computeUnitPriceMicroLamports',
	type: 'number',
	displayOptions: { show: { resource: ['swap'], operation: ['executeSwap', 'getSwapInstructions'] } },
	description: 'Compute unit price in micro lamports for priority fees',
	default: 0,
},
{
	displayName: 'As Legacy Transaction',
	name: 'asLegacyTransaction',
	type: 'boolean',
	displayOptions: { show: { resource: ['swap'], operation: ['executeSwap'] } },
	description: 'Whether to create a legacy transaction instead of versioned transaction',
	default: false,
},
{
	displayName: 'Use Token Ledger',
	name: 'useTokenLedger',
	type: 'boolean',
	displayOptions: { show: { resource: ['swap'], operation: ['executeSwap'] } },
	description: 'Whether to use token ledger for hardware wallet compatibility',
	default: false,
},
{
	displayName: 'Destination Token Account',
	name: 'destinationTokenAccount',
	type: 'string',
	displayOptions: { show: { resource: ['swap'], operation: ['executeSwap'] } },
	description: 'Optional destination token account address',
	default: '',
},
{
  displayName: 'Token IDs',
  name: 'ids',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['price'],
      operation: ['getPrice', 'getAllPrices']
    }
  },
  default: '',
  placeholder: 'So11111111111111111111111112',
  description: 'Comma-separated list of token mint addresses'
},
{
  displayName: 'VS Token',
  name: 'vsToken',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['price'],
      operation: ['getPrice', 'getAllPrices']
    }
  },
  default: 'USDC',
  description: 'Token to quote price against (default: USDC)'
},
{
  displayName: 'Show Extra Info',
  name: 'showExtraInfo',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['price'],
      operation: ['getPrice', 'getAllPrices']
    }
  },
  default: false,
  description: 'Whether to include additional token information in the response'
},
{
	displayName: 'Tags',
	name: 'tags',
	type: 'string',
	default: '',
	placeholder: 'verified,community',
	description: 'Filter tokens by tags (comma-separated)',
	displayOptions: {
		show: {
			resource: ['token'],
			operation: ['getAllTokens'],
		},
	},
},
{
	displayName: 'Only Direct Routes',
	name: 'onlyDirectRoutes',
	type: 'boolean',
	default: false,
	description: 'Whether to return only direct routes',
	displayOptions: {
		show: {
			resource: ['token'],
			operation: ['getIndexedRouteMap'],
		},
	},
},
{
	displayName: 'As Legacy Transaction',
	name: 'asLegacyTransaction',
	type: 'boolean',
	default: false,
	description: 'Whether to format for legacy transactions',
	displayOptions: {
		show: {
			resource: ['token'],
			operation: ['getIndexedRouteMap'],
		},
	},
},
{
  displayName: 'Input Mint',
  name: 'inputMint',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['limitOrder'], operation: ['createLimitOrder'] } },
  default: '',
  description: 'The mint address of the input token',
},
{
  displayName: 'Output Mint',
  name: 'outputMint',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['limitOrder'], operation: ['createLimitOrder'] } },
  default: '',
  description: 'The mint address of the output token',
},
{
  displayName: 'Input Amount',
  name: 'inAmount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['limitOrder'], operation: ['createLimitOrder'] } },
  default: '',
  description: 'The amount of input tokens (in smallest units)',
},
{
  displayName: 'Output Amount',
  name: 'outAmount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['limitOrder'], operation: ['createLimitOrder'] } },
  default: '',
  description: 'The amount of output tokens expected (in smallest units)',
},
{
  displayName: 'Expired At',
  name: 'expiredAt',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['limitOrder'], operation: ['createLimitOrder'] } },
  default: '',
  description: 'Expiration timestamp for the limit order',
},
{
  displayName: 'Base',
  name: 'base',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['limitOrder'], operation: ['createLimitOrder'] } },
  default: '',
  description: 'Base address for the limit order',
},
{
  displayName: 'User Public Key',
  name: 'userPublicKey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['limitOrder'], operation: ['createLimitOrder', 'cancelLimitOrder'] } },
  default: '',
  description: 'The public key of the user placing the order',
},
{
  displayName: 'Wallet',
  name: 'wallet',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['limitOrder'], operation: ['getLimitOrders', 'getLimitOrderHistory'] } },
  default: '',
  description: 'The wallet address to query orders for',
},
{
  displayName: 'Input Mint (Filter)',
  name: 'inputMintFilter',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['limitOrder'], operation: ['getLimitOrders'] } },
  default: '',
  description: 'Filter by input mint address (optional)',
},
{
  displayName: 'Output Mint (Filter)',
  name: 'outputMintFilter',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['limitOrder'], operation: ['getLimitOrders'] } },
  default: '',
  description: 'Filter by output mint address (optional)',
},
{
  displayName: 'Order Public Key',
  name: 'orderPublicKey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['limitOrder'], operation: ['cancelLimitOrder'] } },
  default: '',
  description: 'The public key of the order to cancel',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['limitOrder'], operation: ['getLimitOrders', 'getLimitOrderHistory'] } },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Take',
  name: 'take',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['limitOrder'], operation: ['getLimitOrderHistory'] } },
  default: 10,
  description: 'Number of records to retrieve per page',
},
{
  displayName: 'User Public Key',
  name: 'userPublicKey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['dCA'], operation: ['createDCA', 'getDCAOrders', 'closeDCA', 'getDCAHistory'] } },
  default: '',
  description: 'The public key of the user wallet',
},
{
  displayName: 'Input Mint',
  name: 'inputMint',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['dCA'], operation: ['createDCA'] } },
  default: '',
  description: 'Token mint address of the input token',
},
{
  displayName: 'Output Mint',
  name: 'outputMint',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['dCA'], operation: ['createDCA'] } },
  default: '',
  description: 'Token mint address of the output token',
},
{
  displayName: 'Total Amount',
  name: 'inAmount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['dCA'], operation: ['createDCA'] } },
  default: '',
  description: 'Total amount of input token to be used for DCA (in smallest unit)',
},
{
  displayName: 'Amount Per Cycle',
  name: 'inAmountPerCycle',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['dCA'], operation: ['createDCA'] } },
  default: '',
  description: 'Amount of input token to swap per cycle (in smallest unit)',
},
{
  displayName: 'Cycle Frequency',
  name: 'cycleFrequency',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['dCA'], operation: ['createDCA'] } },
  default: 3600,
  description: 'Frequency of DCA cycles in seconds',
},
{
  displayName: 'Minimum Output Amount Per Cycle',
  name: 'minOutAmountPerCycle',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['dCA'], operation: ['createDCA'] } },
  default: '',
  description: 'Minimum amount of output token per cycle (slippage protection)',
},
{
  displayName: 'Maximum Output Amount Per Cycle',
  name: 'maxOutAmountPerCycle',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['dCA'], operation: ['createDCA'] } },
  default: '',
  description: 'Maximum amount of output token per cycle',
},
{
  displayName: 'Start Time',
  name: 'startAt',
  type: 'dateTime',
  required: false,
  displayOptions: { show: { resource: ['dCA'], operation: ['createDCA'] } },
  default: '',
  description: 'When to start the DCA order (Unix timestamp)',
},
{
  displayName: 'DCA Public Key',
  name: 'dcaPublicKey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['dCA'], operation: ['closeDCA'] } },
  default: '',
  description: 'The public key of the DCA order to close',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['dCA'], operation: ['getDCAOrders', 'getDCAHistory'] } },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Input Mint Address',
  name: 'inputMint',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['swapQuotes'],
      operation: ['getQuote'],
    },
  },
  default: '',
  description: 'The mint address of the input token',
},
{
  displayName: 'Output Mint Address',
  name: 'outputMint',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['swapQuotes'],
      operation: ['getQuote'],
    },
  },
  default: '',
  description: 'The mint address of the output token',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['swapQuotes'],
      operation: ['getQuote'],
    },
  },
  default: '',
  description: 'The amount to swap in smallest unit of the token',
},
{
  displayName: 'Slippage (Basis Points)',
  name: 'slippageBps',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['swapQuotes'],
      operation: ['getQuote'],
    },
  },
  default: 50,
  description: 'Slippage tolerance in basis points (1 basis point = 0.01%)',
},
{
  displayName: 'Only Direct Routes',
  name: 'onlyDirectRoutes',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['swapQuotes'],
      operation: ['getQuote'],
    },
  },
  default: false,
  description: 'Whether to only return direct routes',
},
{
  displayName: 'As Legacy Transaction',
  name: 'asLegacyTransaction',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['swapQuotes'],
      operation: ['getQuote'],
    },
  },
  default: false,
  description: 'Whether to return legacy transaction format',
},
{
  displayName: 'Quote Response',
  name: 'quoteResponse',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['swapQuotes'],
      operation: ['getSwapInstructions'],
    },
  },
  default: '{}',
  description: 'The quote response object from getQuote operation',
},
{
  displayName: 'User Public Key',
  name: 'userPublicKey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['swapQuotes'],
      operation: ['getSwapInstructions'],
    },
  },
  default: '',
  description: 'The user wallet public key',
},
{
  displayName: 'Wrap and Unwrap SOL',
  name: 'wrapAndUnwrapSol',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['swapQuotes'],
      operation: ['getSwapInstructions'],
    },
  },
  default: true,
  description: 'Whether to automatically wrap and unwrap SOL',
},
{
  displayName: 'Use Shared Accounts',
  name: 'useSharedAccounts',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['swapQuotes'],
      operation: ['getSwapInstructions'],
    },
  },
  default: true,
  description: 'Whether to use shared token accounts',
},
{
  displayName: 'Fee Account',
  name: 'feeAccount',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['swapQuotes'],
      operation: ['getSwapInstructions'],
    },
  },
  default: '',
  description: 'Optional fee account for collecting fees',
},
{
  displayName: 'Swap Transaction',
  name: 'swapTransaction',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['swapQuotes'],
      operation: ['executeSwap'],
    },
  },
  default: '',
  description: 'The serialized swap transaction from getSwapInstructions',
},
{
  displayName: 'Wallet Private Key',
  name: 'wallet',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['swapQuotes'],
      operation: ['executeSwap'],
    },
  },
  default: '',
  description: 'The wallet private key for signing the transaction',
},
{
  displayName: 'Transaction Options',
  name: 'options',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['swapQuotes'],
      operation: ['executeSwap'],
    },
  },
  default: '{}',
  description: 'Additional transaction options',
},
{
  displayName: 'Token IDs',
  name: 'ids',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokenPrices'],
      operation: ['getTokenPrice'],
    },
  },
  default: '',
  description: 'Comma-separated list of token mint addresses to get prices for',
  placeholder: 'So11111111111111111111111111111111111111112,EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
},
{
  displayName: 'Versus Token',
  name: 'vsToken',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['tokenPrices'],
      operation: ['getTokenPrice'],
    },
  },
  default: 'USDC',
  description: 'The token to price against (default: USDC)',
  placeholder: 'USDC',
},
{
  displayName: 'Tags',
  name: 'tags',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['tokenPrices'],
      operation: ['getAllTokens'],
    },
  },
  default: '',
  description: 'Comma-separated list of tags to filter tokens by',
  placeholder: 'verified,community',
},
{
  displayName: 'Input Token Mint',
  name: 'inputMint',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrders'],
      operation: ['createLimitOrder'],
    },
  },
  default: '',
  description: 'The mint address of the input token',
},
{
  displayName: 'Output Token Mint',
  name: 'outputMint',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrders'],
      operation: ['createLimitOrder'],
    },
  },
  default: '',
  description: 'The mint address of the output token',
},
{
  displayName: 'Input Amount',
  name: 'inAmount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrders'],
      operation: ['createLimitOrder'],
    },
  },
  default: 0,
  description: 'Amount of input token (in smallest unit)',
},
{
  displayName: 'Output Amount',
  name: 'outAmount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrders'],
      operation: ['createLimitOrder'],
    },
  },
  default: 0,
  description: 'Amount of output token expected (in smallest unit)',
},
{
  displayName: 'Expiration Date',
  name: 'expiredAt',
  type: 'dateTime',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrders'],
      operation: ['createLimitOrder'],
    },
  },
  default: '',
  description: 'Expiration timestamp for the limit order',
},
{
  displayName: 'Base Token',
  name: 'base',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrders'],
      operation: ['createLimitOrder'],
    },
  },
  default: '',
  description: 'Base token mint address',
},
{
  displayName: 'Public Key',
  name: 'publicKey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrders'],
      operation: ['getLimitOrder'],
    },
  },
  default: '',
  description: 'Public key of the limit order',
},
{
  displayName: 'Wallet Address',
  name: 'wallet',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrders'],
      operation: ['getAllLimitOrders', 'cancelLimitOrder', 'getLimitOrderHistory'],
    },
  },
  default: '',
  description: 'Solana wallet address',
},
{
  displayName: 'Input Token Mint',
  name: 'inputMint',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrders'],
      operation: ['getAllLimitOrders'],
    },
  },
  default: '',
  description: 'Filter by input token mint address',
},
{
  displayName: 'Output Token Mint',
  name: 'outputMint',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrders'],
      operation: ['getAllLimitOrders'],
    },
  },
  default: '',
  description: 'Filter by output token mint address',
},
{
  displayName: 'Limit Order',
  name: 'limitOrder',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrders'],
      operation: ['cancelLimitOrder'],
    },
  },
  default: '',
  description: 'The limit order address to cancel',
},
{
  displayName: 'Take Count',
  name: 'take',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrders'],
      operation: ['getLimitOrderHistory'],
    },
  },
  default: 20,
  description: 'Number of records to retrieve',
},
{
  displayName: 'Last Cursor',
  name: 'lastCursor',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrders'],
      operation: ['getLimitOrderHistory'],
    },
  },
  default: '',
  description: 'Cursor for pagination',
},
{
  displayName: 'Input Mint',
  name: 'inputMint',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dcaOrders'],
      operation: ['createDcaOrder'],
    },
  },
  default: '',
  description: 'The mint address of the input token',
},
{
  displayName: 'Output Mint',
  name: 'outputMint',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dcaOrders'],
      operation: ['createDcaOrder'],
    },
  },
  default: '',
  description: 'The mint address of the output token',
},
{
  displayName: 'Input Amount',
  name: 'inAmount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['dcaOrders'],
      operation: ['createDcaOrder'],
    },
  },
  default: 0,
  description: 'Total amount of input token to DCA',
},
{
  displayName: 'Input Amount Per Cycle',
  name: 'inAmountPerCycle',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['dcaOrders'],
      operation: ['createDcaOrder'],
    },
  },
  default: 0,
  description: 'Amount of input token to use per DCA cycle',
},
{
  displayName: 'Cycle Seconds Apart',
  name: 'cycleSecondsApart',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['dcaOrders'],
      operation: ['createDcaOrder'],
    },
  },
  default: 3600,
  description: 'Time interval in seconds between DCA cycles',
},
{
  displayName: 'Min Output Amount Per Cycle',
  name: 'minOutAmountPerCycle',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['dcaOrders'],
      operation: ['createDcaOrder'],
    },
  },
  default: 0,
  description: 'Minimum output amount per cycle (slippage protection)',
},
{
  displayName: 'Max Output Amount Per Cycle',
  name: 'maxOutAmountPerCycle',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['dcaOrders'],
      operation: ['createDcaOrder'],
    },
  },
  default: 0,
  description: 'Maximum output amount per cycle',
},
{
  displayName: 'Public Key',
  name: 'publicKey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dcaOrders'],
      operation: ['getDcaOrder'],
    },
  },
  default: '',
  description: 'The public key of the DCA order',
},
{
  displayName: 'Wallet Address',
  name: 'wallet',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dcaOrders'],
      operation: ['getAllDcaOrders', 'closeDcaOrder', 'getDcaHistory'],
    },
  },
  default: '',
  description: 'The wallet address',
},
{
  displayName: 'DCA Address',
  name: 'dca',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dcaOrders'],
      operation: ['closeDcaOrder'],
    },
  },
  default: '',
  description: 'The DCA order address to close',
},
{
  displayName: 'Take',
  name: 'take',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['dcaOrders'],
      operation: ['getDcaHistory'],
    },
  },
  default: 50,
  description: 'Number of records to retrieve',
},
{
  displayName: 'Last Cursor',
  name: 'lastCursor',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['dcaOrders'],
      operation: ['getDcaHistory'],
    },
  },
  default: '',
  description: 'Pagination cursor for retrieving next set of records',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['perpetualPositions'],
      operation: ['createPerpOrder'],
    },
  },
  default: '',
  description: 'The perpetual market to trade on',
},
{
  displayName: 'Side',
  name: 'side',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['perpetualPositions'],
      operation: ['createPerpOrder'],
    },
  },
  options: [
    {
      name: 'Buy',
      value: 'buy',
    },
    {
      name: 'Sell',
      value: 'sell',
    },
  ],
  default: 'buy',
  description: 'Order side - buy or sell',
},
{
  displayName: 'Size',
  name: 'size',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['perpetualPositions'],
      operation: ['createPerpOrder'],
    },
  },
  default: 0,
  description: 'Order size/quantity',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['perpetualPositions'],
      operation: ['createPerpOrder'],
    },
  },
  default: 0,
  description: 'Order price (optional for market orders)',
},
{
  displayName: 'Order Type',
  name: 'orderType',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['perpetualPositions'],
      operation: ['createPerpOrder'],
    },
  },
  options: [
    {
      name: 'Market',
      value: 'market',
    },
    {
      name: 'Limit',
      value: 'limit',
    },
  ],
  default: 'market',
  description: 'Type of order to place',
},
{
  displayName: 'Reduce Only',
  name: 'reduceOnly',
  type: 'boolean',
  required: false,
  displayOptions: {
    show: {
      resource: ['perpetualPositions'],
      operation: ['createPerpOrder'],
    },
  },
  default: false,
  description: 'Whether the order should only reduce existing positions',
},
{
  displayName: 'Wallet Address',
  name: 'wallet',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['perpetualPositions'],
      operation: ['getPerpPositions', 'getPerpOrders', 'cancelPerpOrder'],
    },
  },
  default: '',
  description: 'The Solana wallet address',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['perpetualPositions'],
      operation: ['getPerpPositions', 'getPerpOrders'],
    },
  },
  default: '',
  description: 'Filter by specific market (optional)',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['perpetualPositions'],
      operation: ['cancelPerpOrder'],
    },
  },
  default: '',
  description: 'The ID of the order to cancel',
},
{
  displayName: 'Input Mint',
  name: 'inputMint',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['jlpOperations'],
      operation: ['depositToJlp'],
    },
  },
  default: '',
  description: 'The mint address of the input token to deposit',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['jlpOperations'],
      operation: ['depositToJlp', 'withdrawFromJlp'],
    },
  },
  default: '',
  description: 'The amount to deposit or withdraw (in base units)',
},
{
  displayName: 'Wallet Address',
  name: 'wallet',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['jlpOperations'],
      operation: ['depositToJlp', 'withdrawFromJlp', 'getJlpPositions'],
    },
  },
  default: '',
  description: 'The wallet address for the operation',
},
{
  displayName: 'Output Mint',
  name: 'outputMint',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['jlpOperations'],
      operation: ['withdrawFromJlp'],
    },
  },
  default: '',
  description: 'The mint address of the output token to receive',
},
{
  displayName: 'Slippage Tolerance (%)',
  name: 'slippageBps',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['jlpOperations'],
      operation: ['depositToJlp', 'withdrawFromJlp'],
    },
  },
  default: 50,
  description: 'Maximum slippage tolerance in basis points (50 = 0.5%)',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'quote':
        return [await executeQuoteOperations.call(this, items)];
      case 'swap':
        return [await executeSwapOperations.call(this, items)];
      case 'price':
        return [await executePriceOperations.call(this, items)];
      case 'token':
        return [await executeTokenOperations.call(this, items)];
      case 'limitOrder':
        return [await executeLimitOrderOperations.call(this, items)];
      case 'dCA':
        return [await executeDCAOperations.call(this, items)];
      case 'swapQuotes':
        return [await executeSwapQuotesOperations.call(this, items)];
      case 'tokenPrices':
        return [await executeTokenPricesOperations.call(this, items)];
      case 'limitOrders':
        return [await executeLimitOrdersOperations.call(this, items)];
      case 'dcaOrders':
        return [await executeDcaOrdersOperations.call(this, items)];
      case 'perpetualPositions':
        return [await executePerpetualPositionsOperations.call(this, items)];
      case 'jlpOperations':
        return [await executeJlpOperationsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeQuoteOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('jupiterdexApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getQuote': {
          const inputMint = this.getNodeParameter('inputMint', i) as string;
          const outputMint = this.getNodeParameter('outputMint', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const slippageBps = this.getNodeParameter('slippageBps', i, 50) as number;
          const swapMode = this.getNodeParameter('swapMode', i, 'ExactIn') as string;
          const dexes = this.getNodeParameter('dexes', i, '') as string;
          const excludeDexes = this.getNodeParameter('excludeDexes', i, '') as string;
          const restrictIntermediateTokens = this.getNodeParameter('restrictIntermediateTokens', i, false) as boolean;
          const onlyDirectRoutes = this.getNodeParameter('onlyDirectRoutes', i, false) as boolean;
          const asLegacyTransaction = this.getNodeParameter('asLegacyTransaction', i, false) as boolean;
          const platformFeeBps = this.getNodeParameter('platformFeeBps', i, 0) as number;
          const maxAccounts = this.getNodeParameter('maxAccounts', i, 64) as number;
          const quoteMint = this.getNodeParameter('quoteMint', i, '') as string;

          const params = new URLSearchParams({
            inputMint,
            outputMint,
            amount,
            slippageBps: slippageBps.toString(),
            swapMode
          });

          if (dexes) params.append('dexes', dexes);
          if (excludeDexes) params.append('excludeDexes', excludeDexes);
          if (restrictIntermediateTokens) params.append('restrictIntermediateTokens', 'true');
          if (onlyDirectRoutes) params.append('onlyDirectRoutes', 'true');
          if (asLegacyTransaction) params.append('asLegacyTransaction', 'true');
          if (platformFeeBps > 0) params.append('platformFeeBps', platformFeeBps.toString());
          if (maxAccounts !== 64) params.append('maxAccounts', maxAccounts.toString());
          if (quoteMint) params.append('quoteMint', quoteMint);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/quote?${params.toString()}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getQuoteByInputAmount': {
          const inputMint = this.getNodeParameter('inputMint', i) as string;
          const outputMint = this.getNodeParameter('outputMint', i) as string;
          const inputAmount = this.getNodeParameter('inputAmount', i) as string;
          const slippageBps = this.getNodeParameter('slippageBps', i, 50) as number;
          const swapMode = this.getNodeParameter('swapMode', i, 'ExactIn') as string;

          const params = new URLSearchParams({
            inputMint,
            outputMint,
            inputAmount,
            slippageBps: slippageBps.toString(),
            swapMode
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/quote-by-input-amount?${params.toString()}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getQuoteByOutputAmount': {
          const inputMint = this.getNodeParameter('inputMint', i) as string;
          const outputMint = this.getNodeParameter('outputMint', i) as string;
          const outputAmount = this.getNodeParameter('outputAmount', i) as string;
          const slippageBps = this.getNodeParameter('slippageB