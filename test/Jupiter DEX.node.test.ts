/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { JupiterDEX } from '../nodes/Jupiter DEX/Jupiter DEX.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('JupiterDEX Node', () => {
  let node: JupiterDEX;

  beforeAll(() => {
    node = new JupiterDEX();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Jupiter DEX');
      expect(node.description.name).toBe('jupiterdex');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('SwapQuotes Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://quote-api.jup.ag/v6',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getQuote operation', () => {
    it('should get swap quote successfully', async () => {
      const mockQuoteResponse = {
        inputMint: 'So11111111111111111111111111111111111111112',
        inAmount: '100000000',
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        outAmount: '10095890',
        otherAmountThreshold: '10085802',
        swapMode: 'ExactIn',
        slippageBps: 50,
        platformFee: null,
        priceImpactPct: '0.008',
        routePlan: [],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getQuote';
          case 'inputMint': return 'So11111111111111111111111111111111111111112';
          case 'outputMint': return 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
          case 'amount': return '100000000';
          case 'slippageBps': return 50;
          case 'onlyDirectRoutes': return false;
          case 'asLegacyTransaction': return false;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockQuoteResponse);

      const items = [{ json: {} }];
      const result = await executeSwapQuotesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockQuoteResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: expect.stringContaining('https://quote-api.jup.ag/v6/quote'),
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle getQuote errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getQuote';
          case 'inputMint': return 'invalid-mint';
          case 'outputMint': return 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
          case 'amount': return '100000000';
          case 'slippageBps': return 50;
          case 'onlyDirectRoutes': return false;
          case 'asLegacyTransaction': return false;
          default: return undefined;
        }
      });

      const error = new Error('Invalid input mint');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const items = [{ json: {} }];
      await expect(executeSwapQuotesOperations.call(mockExecuteFunctions, items)).rejects.toThrow('Invalid input mint');
    });
  });

  describe('getSwapInstructions operation', () => {
    it('should get swap instructions successfully', async () => {
      const mockInstructionsResponse = {
        swapTransaction: 'base64-encoded-transaction',
        lastValidBlockHeight: 123456789,
      };

      const mockQuoteResponse = {
        inputMint: 'So11111111111111111111111111111111111111112',
        inAmount: '100000000',
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        outAmount: '10095890',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getSwapInstructions';
          case 'quoteResponse': return mockQuoteResponse;
          case 'userPublicKey': return '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
          case 'wrapAndUnwrapSol': return true;
          case 'useSharedAccounts': return true;
          case 'feeAccount': return '';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockInstructionsResponse);

      const items = [{ json: {} }];
      const result = await executeSwapQuotesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockInstructionsResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://quote-api.jup.ag/v6/swap-instructions',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.objectContaining({
          quoteResponse: mockQuoteResponse,
          userPublicKey: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        }),
        json: true,
      });
    });
  });

  describe('executeSwap operation', () => {
    it('should execute swap successfully', async () => {
      const mockSwapResponse = {
        txid: '5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW',
        success: true,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'executeSwap';
          case 'swapTransaction': return 'base64-encoded-transaction';
          case 'wallet': return 'base58-private-key';
          case 'options': return {};
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockSwapResponse);

      const items = [{ json: {} }];
      const result = await executeSwapQuotesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockSwapResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://quote-api.jup.ag/v6/swap',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.objectContaining({
          swapTransaction: 'base64-encoded-transaction',
          wallet: 'base58-private-key',
        }),
        json: true,
      });
    });
  });
});

describe('TokenPrices Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://quote-api.jup.ag/v6',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getTokenPrice', () => {
    it('should get token price successfully', async () => {
      const mockResponse = {
        data: {
          'So11111111111111111111111111111111111111112': {
            id: 'So11111111111111111111111111111111111111112',
            mintSymbol: 'SOL',
            vsToken: 'USDC',
            vsTokenSymbol: 'USDC',
            price: 23.45
          }
        }
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getTokenPrice';
        if (paramName === 'ids') return 'So11111111111111111111111111111111111111112';
        if (paramName === 'vsToken') return 'USDC';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTokenPricesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://quote-api.jup.ag/v6/price?ids=So11111111111111111111111111111111111111112&vsToken=USDC',
        headers: {
          'Accept': 'application/json',
        },
        json: true,
      });
    });

    it('should handle missing ids parameter', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getTokenPrice';
        if (paramName === 'ids') return '';
        return '';
      });

      const items = [{ json: {} }];

      await expect(executeTokenPricesOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('Token IDs parameter is required');
    });
  });

  describe('getAllTokens', () => {
    it('should get all tokens successfully', async () => {
      const mockResponse = [
        {
          address: 'So11111111111111111111111111111111111111112',
          name: 'Wrapped SOL',
          symbol: 'SOL',
          decimals: 9,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
          tags: ['verified']
        }
      ];

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAllTokens';
        if (paramName === 'tags') return 'verified';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTokenPricesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://quote-api.jup.ag/v6/tokens?tags=verified',
        headers: {
          'Accept': 'application/json',
        },
        json: true,
      });
    });

    it('should get all tokens without tags filter', async () => {
      const mockResponse = [];

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAllTokens';
        if (paramName === 'tags') return '';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTokenPricesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://quote-api.jup.ag/v6/tokens',
        headers: {
          'Accept': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getProgramLabels', () => {
    it('should get program labels successfully', async () => {
      const mockResponse = {
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': 'Token Program',
        'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': 'Associated Token Program'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getProgramLabels';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTokenPricesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://quote-api.jup.ag/v6/program-id-to-label',
        headers: {
          'Accept': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getTokenPrice';
        if (paramName === 'ids') return 'invalid-token';
        return '';
      });

      const apiError = new Error('API Error');
      (apiError as any).httpCode = '400';
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      const items = [{ json: {} }];

      await expect(executeTokenPricesOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('API Error');
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getTokenPrice';
        if (paramName === 'ids') return 'invalid-token';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const items = [{ json: {} }];
      const result = await executeTokenPricesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ error: 'API Error' });
    });

    it('should handle unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'unknownOperation';
        return '';
      });

      const items = [{ json: {} }];

      await expect(executeTokenPricesOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('Unknown operation: unknownOperation');
    });
  });
});

describe('LimitOrders Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://quote-api.jup.ag/v6',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createLimitOrder', () => {
    it('should create a limit order successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'createLimitOrder',
          inputMint: 'So11111111111111111111111111111111111111112',
          outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          inAmount: 1000000,
          outAmount: 2000000,
          expiredAt: '2024-12-31T23:59:59Z',
          base: 'So11111111111111111111111111111111111111112',
        };
        return params[param];
      });

      const mockResponse = {
        success: true,
        orderKey: 'ABC123',
        transaction: 'mockTransaction',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLimitOrdersOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://quote-api.jup.ag/v6/limit-order',
        headers: { 'Content-Type': 'application/json' },
        json: true,
        body: {
          inputMint: 'So11111111111111111111111111111111111111112',
          outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          inAmount: '1000000',
          outAmount: '2000000',
          expiredAt: expect.any(Number),
          base: 'So11111111111111111111111111111111111111112',
        },
      });
    });
  });

  describe('getLimitOrder', () => {
    it('should get limit order details successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'getLimitOrder',
          publicKey: 'ABC123',
        };
        return params[param];
      });

      const mockResponse = {
        publicKey: 'ABC123',
        inputMint: 'So11111111111111111111111111111111111111112',
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        status: 'open',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLimitOrdersOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://quote-api.jup.ag/v6/limit-order/ABC123',
        headers: { 'Content-Type': 'application/json' },
        json: true,
      });
    });
  });

  describe('getAllLimitOrders', () => {
    it('should get all limit orders for wallet successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'getAllLimitOrders',
          wallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
          inputMint: 'So11111111111111111111111111111111111111112',
          outputMint: '',
        };
        return params[param];
      });

      const mockResponse = {
        orders: [
          { publicKey: 'ABC123', status: 'open' },
          { publicKey: 'DEF456', status: 'filled' },
        ],
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLimitOrdersOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://quote-api.jup.ag/v6/limit-orders?wallet=9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM&inputMint=So11111111111111111111111111111111111111112',
        headers: { 'Content-Type': 'application/json' },
        json: true,
      });
    });
  });

  describe('cancelLimitOrder', () => {
    it('should cancel limit order successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'cancelLimitOrder',
          limitOrder: 'ABC123',
          wallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        };
        return params[param];
      });

      const mockResponse = {
        success: true,
        transaction: 'mockCancelTransaction',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLimitOrdersOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://quote-api.jup.ag/v6/limit-order/cancel',
        headers: { 'Content-Type': 'application/json' },
        json: true,
        body: {
          limitOrder: 'ABC123',
          wallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        },
      });
    });
  });

  describe('getLimitOrderHistory', () => {
    it('should get limit order history successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'getLimitOrderHistory',
          wallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
          take: 10,
          lastCursor: '',
        };
        return params[param];
      });

      const mockResponse = {
        history: [
          { orderId: 'ABC123', status: 'filled', timestamp: 1640995200 },
          { orderId: 'DEF456', status: 'cancelled', timestamp: 1640995100 },
        ],
        cursor: 'nextCursor123',
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLimitOrdersOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://quote-api.jup.ag/v6/limit-order/history?wallet=9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM&take=10',
        headers: { 'Content-Type': 'application/json' },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors when continueOnFail is true', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getLimitOrder');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeLimitOrdersOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        { json: { error: 'API Error' }, pairedItem: { item: 0 } }
      ]);
    });

    it('should throw error when continueOnFail is false', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getLimitOrder');
      mockExecuteFunctions.continueOnFail.mockReturnValue(false);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeLimitOrdersOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });
  });
});

describe('DcaOrders Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://quote-api.jup.ag/v6',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should create DCA order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'createDcaOrder';
        case 'inputMint': return 'So11111111111111111111111111111111111111112';
        case 'outputMint': return 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
        case 'inAmount': return 1000000;
        case 'inAmountPerCycle': return 100000;
        case 'cycleSecondsApart': return 3600;
        case 'minOutAmountPerCycle': return 0;
        case 'maxOutAmountPerCycle': return 0;
        default: return undefined;
      }
    });

    const mockResponse = {
      transaction: 'base64-encoded-transaction',
      dcaAddress: '8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeDcaOrdersOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://quote-api.jup.ag/v6/dca',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        inputMint: 'So11111111111111111111111111111111111111112',
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        inAmount: '1000000',
        inAmountPerCycle: '100000',
        cycleSecondsApart: 3600,
      },
      json: true,
    });
  });

  test('should get DCA order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getDcaOrder';
        case 'publicKey': return '8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj';
        default: return undefined;
      }
    });

    const mockResponse = {
      publicKey: '8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj',
      inputMint: 'So11111111111111111111111111111111111111112',
      outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      status: 'active',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeDcaOrdersOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://quote-api.jup.ag/v6/dca/8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj',
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get all DCA orders successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getAllDcaOrders';
        case 'wallet': return 'DCA7ePEUoNnx3mJTMF6TgHRZqiL7ynTfW3xwNNhFT8mC';
        default: return undefined;
      }
    });

    const mockResponse = {
      dcaOrders: [
        {
          publicKey: '8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj',
          status: 'active',
        },
      ],
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeDcaOrdersOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://quote-api.jup.ag/v6/dca',
      qs: {
        wallet: 'DCA7ePEUoNnx3mJTMF6TgHRZqiL7ynTfW3xwNNhFT8mC',
      },
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should close DCA order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'closeDcaOrder';
        case 'dca': return '8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj';
        case 'wallet': return 'DCA7ePEUoNnx3mJTMF6TgHRZqiL7ynTfW3xwNNhFT8mC';
        default: return undefined;
      }
    });

    const mockResponse = {
      transaction: 'base64-encoded-transaction',
      success: true,
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeDcaOrdersOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://quote-api.jup.ag/v6/dca/close',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        dca: '8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj',
        wallet: 'DCA7ePEUoNnx3mJTMF6TgHRZqiL7ynTfW3xwNNhFT8mC',
      },
      json: true,
    });
  });

  test('should get DCA history successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getDcaHistory';
        case 'wallet': return 'DCA7ePEUoNnx3mJTMF6TgHRZqiL7ynTfW3xwNNhFT8mC';
        case 'take': return 10;
        case 'lastCursor': return '';
        default: return undefined;
      }
    });

    const mockResponse = {
      history: [
        {
          signature: 'transaction-signature',
          timestamp: 1640995200,
          amount: 100000,
        },
      ],
      nextCursor: 'next-cursor-value',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeDcaOrdersOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://quote-api.jup.ag/v6/dca/history',
      qs: {
        wallet: 'DCA7ePEUoNnx3mJTMF6TgHRZqiL7ynTfW3xwNNhFT8mC',
        take: 10,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getDcaOrder';
        case 'publicKey': return 'invalid-key';
        default: return undefined;
      }
    });

    const apiError = new Error('DCA order not found');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    const items = [{ json: {} }];

    await expect(
      executeDcaOrdersOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('DCA order not found');
  });

  test('should continue on fail when configured', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getDcaOrder';
        case 'publicKey': return 'invalid-key';
        default: return undefined;
      }
    });

    const apiError = new Error('DCA order not found');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    const items = [{ json: {} }];
    const result = await executeDcaOrdersOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('DCA order not found');
  });
});

describe('PerpetualPositions Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://quote-api.jup.ag/v6',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getPerpMarkets', () => {
    it('should get all perpetual markets successfully', async () => {
      const mockResponse = {
        markets: [
          { symbol: 'SOL-PERP', baseToken: 'SOL', quoteToken: 'USDC' },
          { symbol: 'BTC-PERP', baseToken: 'BTC', quoteToken: 'USDC' }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getPerpMarkets';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePerpetualPositionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://quote-api.jup.ag/v6/perp/markets',
        json: true,
      });
    });
  });

  describe('createPerpOrder', () => {
    it('should create perpetual order successfully', async () => {
      const mockResponse = { orderId: '12345', status: 'created' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'createPerpOrder',
          market: 'SOL-PERP',
          side: 'buy',
          size: 1,
          price: 100,
          orderType: 'limit',
          reduceOnly: false,
        };
        return params[paramName];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePerpetualPositionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://quote-api.jup.ag/v6/perp/order',
        body: {
          market: 'SOL-PERP',
          side: 'buy',
          size: 1,
          price: 100,
          orderType: 'limit',
          reduceOnly: false,
        },
        json: true,
      });
    });
  });

  describe('getPerpPositions', () => {
    it('should get perpetual positions successfully', async () => {
      const mockResponse = {
        positions: [
          { market: 'SOL-PERP', size: 1.5, unrealizedPnl: 50 }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'getPerpPositions',
          wallet: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
          market: 'SOL-PERP',
        };
        return params[paramName];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePerpetualPositionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://quote-api.jup.ag/v6/perp/positions?wallet=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU&market=SOL-PERP',
        json: true,
      });
    });
  });

  describe('getPerpOrders', () => {
    it('should get perpetual orders successfully', async () => {
      const mockResponse = {
        orders: [
          { orderId: '12345', market: 'SOL-PERP', side: 'buy', size: 1 }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'getPerpOrders',
          wallet: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
          market: '',
        };
        return params[paramName];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePerpetualPositionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://quote-api.jup.ag/v6/perp/orders?wallet=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        json: true,
      });
    });
  });

  describe('cancelPerpOrder', () => {
    it('should cancel perpetual order successfully', async () => {
      const mockResponse = { success: true, orderId: '12345' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'cancelPerpOrder',
          orderId: '12345',
          wallet: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        };
        return params[paramName];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePerpetualPositionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } }
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://quote-api.jup.ag/v6/perp/cancel-order',
        body: {
          orderId: '12345',
          wallet: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getPerpMarkets');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executePerpetualPositionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        { json: { error: 'API Error' }, pairedItem: { item: 0 } }
      ]);
    });
  });
});

describe('JlpOperations Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://quote-api.jup.ag/v6',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getJlpPrice', () => {
    it('should successfully get JLP price', async () => {
      const mockResponse = {
        price: '1.25',
        timestamp: 1640995200000,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getJlpPrice';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeJlpOperationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://quote-api.jup.ag/v6/jlp/price',
        headers: { 'Content-Type': 'application/json' },
        json: true,
      });
    });

    it('should handle errors when getting JLP price', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getJlpPrice';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeJlpOperationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('depositToJlp', () => {
    it('should successfully deposit to JLP', async () => {
      const mockResponse = {
        swapTransaction: 'base64-encoded-transaction',
        lastValidBlockHeight: 123456789,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, defaultValue?: any) => {
        const params: any = {
          operation: 'depositToJlp',
          inputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          amount: '1000000',
          wallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
          slippageBps: 50,
        };
        return params[paramName] || defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeJlpOperationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://quote-api.jup.ag/v6/jlp/deposit',
        headers: { 'Content-Type': 'application/json' },
        body: {
          inputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          amount: '1000000',
          userPublicKey: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
          slippageBps: 50,
        },
        json: true,
      });
    });
  });

  describe('withdrawFromJlp', () => {
    it('should successfully withdraw from JLP', async () => {
      const mockResponse = {
        swapTransaction: 'base64-encoded-transaction',
        lastValidBlockHeight: 123456789,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, defaultValue?: any) => {
        const params: any = {
          operation: 'withdrawFromJlp',
          amount: '500000',
          outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          wallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
          slippageBps: 50,
        };
        return params[paramName] || defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeJlpOperationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://quote-api.jup.ag/v6/jlp/withdraw',
        headers: { 'Content-Type': 'application/json' },
        body: {
          amount: '500000',
          outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          userPublicKey: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
          slippageBps: 50,
        },
        json: true,
      });
    });
  });

  describe('getJlpPositions', () => {
    it('should successfully get JLP positions', async () => {
      const mockResponse = {
        positions: [
          {
            mint: 'JLPToken123',
            amount: '1000000',
            value: '1250.50',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        const params: any = {
          operation: 'getJlpPositions',
          wallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        };
        return params[paramName];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeJlpOperationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://quote-api.jup.ag/v6/jlp/positions?wallet=9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        headers: { 'Content-Type': 'application/json' },
        json: true,
      });
    });
  });

  describe('getJlpStats', () => {
    it('should successfully get JLP stats', async () => {
      const mockResponse = {
        totalLiquidity: '50000000.00',
        volume24h: '2500000.00',
        fees24h: '5000.00',
        apy: '12.5',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getJlpStats';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeJlpOperationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://quote-api.jup.ag/v6/jlp/stats',
        headers: { 'Content-Type': 'application/json' },
        json: true,
      });
    });
  });
});
});
