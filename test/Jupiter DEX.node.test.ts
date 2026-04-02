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
describe('Quote Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        baseUrl: 'https://quote-api.jup.ag/v6'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getQuote operation', () => {
    it('should get quote successfully', async () => {
      const mockQuoteResponse = {
        inputMint: 'So11111111111111111111111111111111111111112',
        inAmount: '1000000',
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        outAmount: '999000',
        otherAmountThreshold: '989010',
        swapMode: 'ExactIn',
        slippageBps: 50,
        platformFee: null,
        priceImpactPct: '0.01',
        routePlan: []
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getQuote')
        .mockReturnValueOnce('So11111111111111111111111111111111111111112')
        .mockReturnValueOnce('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
        .mockReturnValueOnce('1000000')
        .mockReturnValueOnce(50)
        .mockReturnValueOnce('ExactIn');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockQuoteResponse);

      const items = [{ json: {} }];
      const result = await executeQuoteOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockQuoteResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: expect.stringContaining('/quote?'),
        headers: { 'Content-Type': 'application/json' },
        json: true
      });
    });

    it('should handle getQuote error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getQuote');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeQuoteOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getQuoteByInputAmount operation', () => {
    it('should get quote by input amount successfully', async () => {
      const mockQuoteResponse = {
        inputMint: 'So11111111111111111111111111111111111111112',
        inputAmount: '1000000',
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        outAmount: '999000'
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getQuoteByInputAmount')
        .mockReturnValueOnce('So11111111111111111111111111111111111111112')
        .mockReturnValueOnce('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
        .mockReturnValueOnce('1000000')
        .mockReturnValueOnce(50)
        .mockReturnValueOnce('ExactIn');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockQuoteResponse);

      const items = [{ json: {} }];
      const result = await executeQuoteOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockQuoteResponse);
    });
  });

  describe('getQuoteByOutputAmount operation', () => {
    it('should get quote by output amount successfully', async () => {
      const mockQuoteResponse = {
        inputMint: 'So11111111111111111111111111111111111111112',
        inAmount: '1001000',
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        outputAmount: '1000000'
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getQuoteByOutputAmount')
        .mockReturnValueOnce('So11111111111111111111111111111111111111112')
        .mockReturnValueOnce('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
        .mockReturnValueOnce('1000000')
        .mockReturnValueOnce(50)
        .mockReturnValueOnce('ExactOut');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockQuoteResponse);

      const items = [{ json: {} }];
      const result = await executeQuoteOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockQuoteResponse);
    });
  });
});

describe('Swap Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				baseUrl: 'https://quote-api.jup.ag/v6'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('executeSwap operation', () => {
		it('should execute swap successfully', async () => {
			const mockQuoteResponse = { route: 'test-route' };
			const mockSwapResponse = { swapTransaction: 'base64-transaction' };

			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: any = {
					operation: 'executeSwap',
					quoteResponse: mockQuoteResponse,
					userPublicKey: 'test-public-key',
					wrapAndUnwrapSol: true,
					useSharedAccounts: true,
					feeAccount: '',
					computeUnitPriceMicroLamports: 0,
					asLegacyTransaction: false,
					useTokenLedger: false,
					destinationTokenAccount: '',
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockSwapResponse);

			const result = await executeSwapOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://quote-api.jup.ag/v6/swap',
				headers: { 'Content-Type': 'application/json' },
				body: {
					quoteResponse: mockQuoteResponse,
					userPublicKey: 'test-public-key',
					wrapAndUnwrapSol: true,
					useSharedAccounts: true,
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockSwapResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle swap execution error', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: any = {
					operation: 'executeSwap',
					quoteResponse: {},
					userPublicKey: 'test-public-key',
					wrapAndUnwrapSol: true,
					useSharedAccounts: true,
					feeAccount: '',
					computeUnitPriceMicroLamports: 0,
					asLegacyTransaction: false,
					useTokenLedger: false,
					destinationTokenAccount: '',
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Swap failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeSwapOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Swap failed' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getSwapInstructions operation', () => {
		it('should get swap instructions successfully', async () => {
			const mockQuoteResponse = { route: 'test-route' };
			const mockInstructionsResponse = { instructions: ['instruction1', 'instruction2'] };

			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: any = {
					operation: 'getSwapInstructions',
					quoteResponse: mockQuoteResponse,
					userPublicKey: 'test-public-key',
					wrapAndUnwrapSol: true,
					useSharedAccounts: true,
					feeAccount: '',
					computeUnitPriceMicroLamports: 0,
				};
				return params[name];
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockInstructionsResponse);

			const result = await executeSwapOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://quote-api.jup.ag/v6/swap-instructions',
				headers: { 'Content-Type': 'application/json' },
				body: {
					quoteResponse: mockQuoteResponse,
					userPublicKey: 'test-public-key',
					wrapAndUnwrapSol: true,
					useSharedAccounts: true,
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockInstructionsResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle get swap instructions error', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				const params: any = {
					operation: 'getSwapInstructions',
					quoteResponse: {},
					userPublicKey: 'test-public-key',
					wrapAndUnwrapSol: true,
					useSharedAccounts: true,
					feeAccount: '',
					computeUnitPriceMicroLamports: 0,
				};
				return params[name];
			});

			const error = new Error('Instructions failed');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

			await expect(executeSwapOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Instructions failed');
		});
	});
});

describe('Price Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://quote-api.jup.ag/v6'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getPrice operation', () => {
    it('should get price for a token successfully', async () => {
      const mockResponse = {
        data: {
          'So11111111111111111111111111111112': {
            id: 'So11111111111111111111111111111112',
            price: '102.5',
            symbol: 'SOL'
          }
        }
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPrice')
        .mockReturnValueOnce('So11111111111111111111111111111112')
        .mockReturnValueOnce('USDC')
        .mockReturnValueOnce(false);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePriceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://quote-api.jup.ag/v6/price?ids=So11111111111111111111111111111112&vsToken=USDC',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer test-key'
        },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle getPrice operation error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPrice')
        .mockReturnValueOnce('invalid-token')
        .mockReturnValueOnce('USDC')
        .mockReturnValueOnce(false);

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Token not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executePriceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Token not found' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getAllPrices operation', () => {
    it('should get prices for multiple tokens successfully', async () => {
      const mockResponse = {
        data: {
          'So11111111111111111111111111111112': {
            id: 'So11111111111111111111111111111112',
            price: '102.5',
            symbol: 'SOL'
          },
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
            id: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            price: '1.0',
            symbol: 'USDC'
          }
        }
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllPrices')
        .mockReturnValueOnce('So11111111111111111111111111111112,EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
        .mockReturnValueOnce('USDC')
        .mockReturnValueOnce(true);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePriceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://quote-api.jup.ag/v6/prices?ids=So11111111111111111111111111111112%2CEPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&vsToken=USDC&showExtraInfo=true',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer test-key'
        },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle getAllPrices operation error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllPrices')
        .mockReturnValueOnce('invalid-tokens')
        .mockReturnValueOnce('USDC')
        .mockReturnValueOnce(false);

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid token addresses'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executePriceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Invalid token addresses' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(executePriceOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Token Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
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

	describe('getAllTokens operation', () => {
		it('should get all tokens successfully', async () => {
			const mockTokens = [
				{ symbol: 'SOL', mint: 'So11111111111111111111111111111111111111112' },
				{ symbol: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
			];

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllTokens')
				.mockReturnValueOnce('verified');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTokens);

			const result = await executeTokenOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://quote-api.jup.ag/v6/tokens?tags=verified',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer test-key',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockTokens,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle getAllTokens error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllTokens')
				.mockReturnValueOnce('');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeTokenOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getProgramIdToLabel operation', () => {
		it('should get program ID to label mappings successfully', async () => {
			const mockMappings = {
				'9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM': 'Jupiter Aggregator',
				'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB': 'Jupiter Token',
			};

			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getProgramIdToLabel');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockMappings);

			const result = await executeTokenOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://quote-api.jup.ag/v6/program-id-to-label',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer test-key',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockMappings,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle getProgramIdToLabel error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getProgramIdToLabel');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(false);

			await expect(
				executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('Network Error');
		});
	});

	describe('getIndexedRouteMap operation', () => {
		it('should get indexed route map successfully', async () => {
			const mockRouteMap = {
				mintKeys: ['So11111111111111111111111111111111111111112', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'],
				indexedRouteMap: { '0': [1], '1': [0] },
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getIndexedRouteMap')
				.mockReturnValueOnce(true)
				.mockReturnValueOnce(false);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockRouteMap);

			const result = await executeTokenOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://quote-api.jup.ag/v6/indexed-route-map?onlyDirectRoutes=true',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer test-key',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockRouteMap,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle getIndexedRouteMap error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getIndexedRouteMap')
				.mockReturnValueOnce(false)
				.mockReturnValueOnce(false);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Service Unavailable'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeTokenOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: { error: 'Service Unavailable' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});

describe('LimitOrder Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://quote-api.jup.ag/v6' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should create a limit order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createLimitOrder')
      .mockReturnValueOnce('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
      .mockReturnValueOnce('So11111111111111111111111111111111111111112')
      .mockReturnValueOnce('1000000')
      .mockReturnValueOnce('50000000')
      .mockReturnValueOnce('1640995200')
      .mockReturnValueOnce('base123')
      .mockReturnValueOnce('user123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      success: true,
      orderKey: 'order123',
      txid: 'transaction123'
    });

    const items = [{ json: {} }];
    const result = await executeLimitOrderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://quote-api.jup.ag/v6/limit-order',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json'
      },
      body: {
        inputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        outputMint: 'So11111111111111111111111111111111111111112',
        inAmount: '1000000',
        outAmount: '50000000',
        expiredAt: '1640995200',
        base: 'base123',
        userPublicKey: 'user123'
      },
      json: true
    });
  });

  it('should get limit orders successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getLimitOrders')
      .mockReturnValueOnce('wallet123')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(1);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      orders: [{ id: 'order1' }, { id: 'order2' }]
    });

    const items = [{ json: {} }];
    const result = await executeLimitOrderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.orders).toHaveLength(2);
  });

  it('should cancel limit order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cancelLimitOrder')
      .mockReturnValueOnce('user123')
      .mockReturnValueOnce('order123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      success: true,
      txid: 'cancel_transaction123'
    });

    const items = [{ json: {} }];
    const result = await executeLimitOrderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
  });

  it('should get limit order history successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getLimitOrderHistory')
      .mockReturnValueOnce('wallet123')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(10);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      history: [{ id: 'history1' }, { id: 'history2' }]
    });

    const items = [{ json: {} }];
    const result = await executeLimitOrderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.history).toHaveLength(2);
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createLimitOrder');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];
    const result = await executeLimitOrderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createLimitOrder');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];
    await expect(
      executeLimitOrderOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('API Error');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    const items = [{ json: {} }];
    await expect(
      executeLimitOrderOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('DCA Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://quote-api.jup.ag/v6' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should create DCA order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createDCA')
      .mockReturnValueOnce('user123')
      .mockReturnValueOnce('input_mint')
      .mockReturnValueOnce('output_mint')
      .mockReturnValueOnce('1000000')
      .mockReturnValueOnce('100000')
      .mockReturnValueOnce(3600);

    const mockResponse = { dcaPublicKey: 'dca123', status: 'created' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDCAOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://quote-api.jup.ag/v6/dca',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: expect.objectContaining({
        userPublicKey: 'user123',
        inputMint: 'input_mint',
        outputMint: 'output_mint',
      }),
      json: true,
    });
  });

  it('should get DCA orders successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getDCAOrders')
      .mockReturnValueOnce('user123')
      .mockReturnValueOnce(1);

    const mockResponse = { orders: [], totalPages: 1 };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDCAOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should close DCA order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('closeDCA')
      .mockReturnValueOnce('user123')
      .mockReturnValueOnce('dca123');

    const mockResponse = { status: 'closed', transaction: 'tx123' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDCAOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get DCA history successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getDCAHistory')
      .mockReturnValueOnce('user123')
      .mockReturnValueOnce(1);

    const mockResponse = { history: [], totalPages: 1 };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDCAOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createDCA');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeDCAOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createDCA');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executeDCAOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('API Error');
  });
});
});
