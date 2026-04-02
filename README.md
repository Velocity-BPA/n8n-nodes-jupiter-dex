# n8n-nodes-jupiter-dex

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for Jupiter DEX, Solana's leading decentralized exchange aggregator. This node provides 6 resources enabling comprehensive DeFi operations including price quotes, token swaps, limit orders, and dollar-cost averaging strategies on the Solana blockchain.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Solana](https://img.shields.io/badge/Solana-DeFi-9945ff)
![Jupiter DEX](https://img.shields.io/badge/Jupiter-DEX-00d4aa)
![Web3](https://img.shields.io/badge/Web3-Trading-orange)

## Features

- **Price Quotes** - Get real-time pricing data and optimal routes across multiple Solana DEXs
- **Token Swaps** - Execute trades with automatic route optimization and slippage protection
- **Price Monitoring** - Track token prices and market data across Jupiter's aggregated liquidity
- **Token Information** - Retrieve comprehensive token metadata and market statistics
- **Limit Orders** - Create and manage conditional orders that execute when price conditions are met
- **Dollar-Cost Averaging** - Set up automated DCA strategies for systematic token accumulation
- **Multi-DEX Routing** - Access liquidity from Raydium, Serum, Orca, and other Solana DEXs
- **MEV Protection** - Built-in protection against maximum extractable value attacks

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-jupiter-dex`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-jupiter-dex
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-jupiter-dex.git
cd n8n-nodes-jupiter-dex
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-jupiter-dex
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Jupiter DEX API key for authentication | Yes |
| Environment | API environment (mainnet-beta, testnet, devnet) | Yes |
| RPC Endpoint | Custom Solana RPC endpoint (optional) | No |

## Resources & Operations

### 1. Quote

| Operation | Description |
|-----------|-------------|
| Get Quote | Get price quote and route information for a token swap |
| Compare Routes | Compare multiple routing options for optimal pricing |
| Get Route Info | Retrieve detailed information about a specific route |

### 2. Swap

| Operation | Description |
|-----------|-------------|
| Execute Swap | Perform a token swap transaction |
| Get Swap Status | Check the status of a swap transaction |
| Cancel Swap | Cancel a pending swap transaction |
| Get Swap History | Retrieve historical swap transactions |

### 3. Price

| Operation | Description |
|-----------|-------------|
| Get Current Price | Get current market price for a token |
| Get Price History | Retrieve historical price data |
| Get OHLCV Data | Get open, high, low, close, volume data |
| Compare Prices | Compare prices across different DEXs |

### 4. Token

| Operation | Description |
|-----------|-------------|
| Get Token Info | Retrieve token metadata and information |
| List Tokens | Get list of available tokens |
| Search Tokens | Search for tokens by name or symbol |
| Get Token Markets | Get market data for a specific token |

### 5. Limit Order

| Operation | Description |
|-----------|-------------|
| Create Limit Order | Place a new limit order |
| Cancel Limit Order | Cancel an existing limit order |
| Get Order Status | Check the status of a limit order |
| List Orders | Get all limit orders for an account |
| Update Order | Modify an existing limit order |

### 6. DCA

| Operation | Description |
|-----------|-------------|
| Create DCA Strategy | Set up a new dollar-cost averaging strategy |
| Get DCA Status | Check the status of a DCA strategy |
| Update DCA | Modify an existing DCA strategy |
| Cancel DCA | Stop a DCA strategy |
| Get DCA History | Retrieve DCA execution history |

## Usage Examples

```javascript
// Get a price quote for swapping SOL to USDC
{
  "inputMint": "So11111111111111111111111111111111111111112",
  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "amount": "1000000000",
  "slippageBps": 50
}
```

```javascript
// Execute a token swap
{
  "route": "{{$node['Get Quote'].json['routes'][0]}}",
  "userPublicKey": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  "feeAccount": "{{$node['Get Quote'].json['feeAccount']}}",
  "computeUnitPriceMicroLamports": 1000
}
```

```javascript
// Create a limit order
{
  "maker": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  "inputMint": "So11111111111111111111111111111111111111112",
  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "inAmount": "100000000",
  "outAmount": "2000000000",
  "expiredAt": 1735689600
}
```

```javascript
// Set up a DCA strategy
{
  "user": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  "inToken": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "outToken": "So11111111111111111111111111111111111111112",
  "inAmount": "10000000",
  "cycleSecondsApart": 86400,
  "minOutAmount": "90000000"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided API key | Verify API key is correct and active |
| Insufficient Funds | Wallet has insufficient balance for transaction | Check wallet balance and reduce transaction amount |
| Route Not Found | No valid routing path found for token pair | Try different token pair or adjust slippage tolerance |
| Transaction Failed | Swap transaction failed on blockchain | Check network status and retry with higher priority fee |
| Price Impact Too High | Transaction would cause significant price impact | Reduce transaction size or increase slippage tolerance |
| Rate Limit Exceeded | API rate limit has been exceeded | Implement delays between requests or upgrade API plan |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-jupiter-dex/issues)
- **Jupiter API Docs**: [docs.jup.ag](https://docs.jup.ag)
- **Solana Developer Hub**: [solana.com/developers](https://solana.com/developers)