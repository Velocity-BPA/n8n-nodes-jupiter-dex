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
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
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
        default: 'swapQuotes',
      },
      // Operation dropdowns per resource
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
      // Parameter definitions
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

async function executeSwapQuotesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getQuote': {
          const inputMint = this.getNodeParameter('inputMint', i) as string;
          const outputMint = this.getNodeParameter('outputMint', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const slippageBps = this.getNodeParameter('slippageBps', i) as number;
          const onlyDirectRoutes = this.getNodeParameter('onlyDirectRoutes', i) as boolean;
          const asLegacyTransaction = this.getNodeParameter('asLegacyTransaction', i) as boolean;

          const params: any = {
            inputMint,
            outputMint,
            amount,
            slippageBps: slippageBps.toString(),
          };

          if (onlyDirectRoutes) {
            params.onlyDirectRoutes = 'true';
          }

          if (asLegacyTransaction) {
            params.asLegacyTransaction = 'true';
          }

          const queryString = new URLSearchParams(params).toString();

          const options: any = {
            method: 'GET',
            url: `https://quote-api.jup.ag/v6/quote?${queryString}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSwapInstructions': {
          const quoteResponse = this.getNodeParameter('quoteResponse', i) as any;
          const userPublicKey = this.getNodeParameter('userPublicKey', i) as string;
          const wrapAndUnwrapSol = this.getNodeParameter('wrapAndUnwrapSol', i) as boolean;
          const useSharedAccounts = this.getNodeParameter('useSharedAccounts', i) as boolean;
          const feeAccount = this.getNodeParameter('feeAccount', i) as string;

          const requestBody: any = {
            quoteResponse: typeof quoteResponse === 'string' ? JSON.parse(quoteResponse) : quoteResponse,
            userPublicKey,
            wrapAndUnwrapSol,
            useSharedAccounts,
          };

          if (feeAccount) {
            requestBody.feeAccount = feeAccount;
          }

          const options: any = {
            method: 'POST',
            url: 'https://quote-api.jup.ag/v6/swap-instructions',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'executeSwap': {
          const swapTransaction = this.getNodeParameter('swapTransaction', i) as string;
          const wallet = this.getNodeParameter('wallet', i) as string;
          const options = this.getNodeParameter('options', i) as any;

          const requestBody: any = {
            swapTransaction,
            wallet,
            options: typeof options === 'string' ? JSON.parse(options) : options,
          };

          const httpOptions: any = {
            method: 'POST',
            url: 'https://quote-api.jup.ag/v6/swap',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(httpOptions) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.response) {
          throw new NodeApiError(this.getNode(), error.response.body || error.response, {
            message: error.message,
            httpCode: error.statusCode?.toString(),
          });
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeTokenPricesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const baseUrl = 'https://quote-api.jup.ag/v6';

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getTokenPrice': {
          const ids = this.getNodeParameter('ids', i) as string;
          const vsToken = this.getNodeParameter('vsToken', i) as string;
          
          if (!ids) {
            throw new NodeOperationError(this.getNode(), 'Token IDs parameter is required');
          }
          
          const queryParams = new URLSearchParams();
          queryParams.append('ids', ids);
          if (vsToken) {
            queryParams.append('vsToken', vsToken);
          }
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/price?${queryParams.toString()}`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAllTokens': {
          const tags = this.getNodeParameter('tags', i) as string;
          
          let url = `${baseUrl}/tokens`;
          if (tags) {
            const queryParams = new URLSearchParams();
            queryParams.append('tags', tags);
            url += `?${queryParams.toString()}`;
          }
          
          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getProgramLabels': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/program-id-to-label`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ 
        json: result, 
        pairedItem: { item: i } 
      });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }
  
  return returnData;
}

async function executeLimitOrdersOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createLimitOrder': {
          const inputMint = this.getNodeParameter('inputMint', i) as string;
          const outputMint = this.getNodeParameter('outputMint', i) as string;
          const inAmount = this.getNodeParameter('inAmount', i) as number;
          const outAmount = this.getNodeParameter('outAmount', i) as number;
          const expiredAt = this.getNodeParameter('expiredAt', i) as string;
          const base = this.getNodeParameter('base', i) as string;

          const body: any = {
            inputMint,
            outputMint,
            inAmount: inAmount.toString(),
            outAmount: outAmount.toString(),
          };

          if (expiredAt) {
            body.expiredAt = new Date(expiredAt).getTime();
          }

          if (base) {
            body.base = base;
          }

          const options: any = {
            method: 'POST',
            url: 'https://quote-api.jup.ag/v6/limit-order',
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getLimitOrder': {
          const publicKey = this.getNodeParameter('publicKey', i) as string;

          const options: any = {
            method: 'GET',
            url: `https://quote-api.jup.ag/v6/limit-order/${publicKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllLimitOrders': {
          const wallet = this.getNodeParameter('wallet', i) as string;
          const inputMint = this.getNodeParameter('inputMint', i) as string;
          const outputMint = this.getNodeParameter('outputMint', i) as string;

          const params: any = { wallet };

          if (inputMint) {
            params.inputMint = inputMint;
          }

          if (outputMint) {
            params.outputMint = outputMint;
          }

          const queryString = new URLSearchParams(params).toString();

          const options: any = {
            method: 'GET',
            url: `https://quote-api.jup.ag/v6/limit-orders?${queryString}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelLimitOrder': {
          const limitOrder = this.getNodeParameter('limitOrder', i) as string;
          const wallet = this.getNodeParameter('wallet', i) as string;

          const body: any = {
            limitOrder,
            wallet,
          };

          const options: any = {
            method: 'POST',
            url: 'https://quote-api.jup.ag/v6/limit-order/cancel',
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getLimitOrderHistory': {
          const wallet = this.getNodeParameter('wallet', i) as string;
          const take = this.getNodeParameter('take', i) as number;
          const lastCursor = this.getNodeParameter('lastCursor', i) as string;

          const params: any = { wallet };

          if (take) {
            params.take = take.toString();
          }

          if (lastCursor) {
            params.lastCursor = lastCursor;
          }

          const queryString = new URLSearchParams(params).toString();

          const options: any = {
            method: 'GET',
            url: `https://quote-api.jup.ag/v6/limit-order/history?${queryString}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeDcaOrdersOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'createDcaOrder': {
          const inputMint = this.getNodeParameter('inputMint', i) as string;
          const outputMint = this.getNodeParameter('outputMint', i) as string;
          const inAmount = this.getNodeParameter('inAmount', i) as number;
          const inAmountPerCycle = this.getNodeParameter('inAmountPerCycle', i) as number;
          const cycleSecondsApart = this.getNodeParameter('cycleSecondsApart', i) as number;
          const minOutAmountPerCycle = this.getNodeParameter('minOutAmountPerCycle', i, 0) as number;
          const maxOutAmountPerCycle = this.getNodeParameter('maxOutAmountPerCycle', i, 0) as number;

          const body: any = {
            inputMint,
            outputMint,
            inAmount: inAmount.toString(),
            inAmountPerCycle: inAmountPerCycle.toString(),
            cycleSecondsApart,
          };

          if (minOutAmountPerCycle > 0) {
            body.minOutAmountPerCycle = minOutAmountPerCycle.toString();
          }

          if (maxOutAmountPerCycle > 0) {
            body.maxOutAmountPerCycle = maxOutAmountPerCycle.toString();
          }

          const options: any = {
            method: 'POST',
            url: 'https://quote-api.jup.ag/v6/dca',
            headers: {
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDcaOrder': {
          const publicKey = this.getNodeParameter('publicKey', i) as string;

          const options: any = {
            method: 'GET',
            url: `https://quote-api.jup.ag/v6/dca/${publicKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllDcaOrders': {
          const wallet = this.getNodeParameter('wallet', i) as string;

          const options: any = {
            method: 'GET',
            url: `https://quote-api.jup.ag/v6/dca`,
            qs: {
              wallet,
            },
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'closeDcaOrder': {
          const dca = this.getNodeParameter('dca', i) as string;
          const wallet = this.getNodeParameter('wallet', i) as string;

          const options: any = {
            method: 'POST',
            url: 'https://quote-api.jup.ag/v6/dca/close',
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              dca,
              wallet,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDcaHistory': {
          const wallet = this.getNodeParameter('wallet', i) as string;
          const take = this.getNodeParameter('take', i, 50) as number;
          const lastCursor = this.getNodeParameter('lastCursor', i, '') as string;

          const qs: any = {
            wallet,
            take,
          };

          if (lastCursor) {
            qs.lastCursor = lastCursor;
          }

          const options: any = {
            method: 'GET',
            url: 'https://quote-api.jup.ag/v6/dca/history',
            qs,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executePerpetualPositionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getPerpMarkets': {
          const options: any = {
            method: 'GET',
            url: 'https://quote-api.jup.ag/v6/perp/markets',
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createPerpOrder': {
          const market = this.getNodeParameter('market', i) as string;
          const side = this.getNodeParameter('side', i) as string;
          const size = this.getNodeParameter('size', i) as number;
          const price = this.getNodeParameter('price', i) as number;
          const orderType = this.getNodeParameter('orderType', i) as string;
          const reduceOnly = this.getNodeParameter('reduceOnly', i) as boolean;

          const requestBody: any = {
            market,
            side,
            size,
            orderType,
            reduceOnly,
          };

          if (orderType === 'limit' && price) {
            requestBody.price = price;
          }

          const options: any = {
            method: 'POST',
            url: 'https://quote-api.jup.ag/v6/perp/order',
            body: requestBody,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getPerpPositions': {
          const wallet = this.getNodeParameter('wallet', i) as string;
          const market = this.getNodeParameter('market', i) as string;

          const queryParams: any = { wallet };
          if (market) {
            queryParams.market = market;
          }

          const queryString = new URLSearchParams(queryParams).toString();
          
          const options: any = {
            method: 'GET',
            url: `https://quote-api.jup.ag/v6/perp/positions?${queryString}`,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getPerpOrders': {
          const wallet = this.getNodeParameter('wallet', i) as string;
          const market = this.getNodeParameter('market', i) as string;

          const queryParams: any = { wallet };
          if (market) {
            queryParams.market = market;
          }

          const queryString = new URLSearchParams(queryParams).toString();
          
          const options: any = {
            method: 'GET',
            url: `https://quote-api.jup.ag/v6/perp/orders?${queryString}`,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'cancelPerpOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const wallet = this.getNodeParameter('wallet', i) as string;

          const options: any = {
            method: 'POST',
            url: 'https://quote-api.jup.ag/v6/perp/cancel-order',
            body: {
              orderId,
              wallet,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }
  
  return returnData;
}

async function executeJlpOperationsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getJlpPrice': {
          const options: any = {
            method: 'GET',
            url: 'https://quote-api.jup.ag/v6/jlp/price',
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'depositToJlp': {
          const inputMint = this.getNodeParameter('inputMint', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const wallet = this.getNodeParameter('wallet', i) as string;
          const slippageBps = this.getNodeParameter('slippageBps', i, 50) as number;

          const requestBody: any = {
            inputMint,
            amount,
            userPublicKey: wallet,
            slippageBps,
          };

          const options: any = {
            method: 'POST',
            url: 'https://quote-api.jup.ag/v6/jlp/deposit',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'withdrawFromJlp': {
          const amount = this.getNodeParameter('amount', i) as string;
          const outputMint = this.getNodeParameter('outputMint', i) as string;
          const wallet = this.getNodeParameter('wallet', i) as string;
          const slippageBps = this.getNodeParameter('slippageBps', i, 50) as number;

          const requestBody: any = {
            amount,
            outputMint,
            userPublicKey: wallet,
            slippageBps,
          };

          const options: any = {
            method: 'POST',
            url: 'https://quote-api.jup.ag/v6/jlp/withdraw',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getJlpPositions': {
          const wallet = this.getNodeParameter('wallet', i) as string;

          const options: any = {
            method: 'GET',
            url: `https://quote-api.jup.ag/v6/jlp/positions?wallet=${encodeURIComponent(wallet)}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getJlpStats': {
          const options: any = {
            method: 'GET',
            url: 'https://quote-api.jup.ag/v6/jlp/stats',
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}
