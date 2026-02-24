# n8n-nodes-jupiter-dex

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node integrates Jupiter DEX, Solana's premier decentralized exchange aggregator, providing access to 6 key resources for token swaps, pricing, DeFi operations, and portfolio management with comprehensive market data and automated trading capabilities.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Solana](https://img.shields.io/badge/Solana-DeFi-purple)
![Jupiter DEX](https://img.shields.io/badge/Jupiter-DEX-orange)
![DeFi](https://img.shields.io/badge/DeFi-Trading-green)

## Features

- **Token Swap Quotes** - Get real-time pricing and routing for optimal token swaps across Solana DEXs
- **Market Data Access** - Retrieve current and historical token prices with comprehensive market metrics  
- **Limit Order Management** - Create, monitor, and manage limit orders with advanced order parameters
- **DCA Automation** - Set up and control dollar-cost averaging strategies for automated investing
- **Perpetual Trading** - Access perpetual futures positions with margin trading and risk management
- **JLP Pool Operations** - Interact with Jupiter Liquidity Provider pools for yield farming and liquidity provision
- **Multi-DEX Aggregation** - Access liquidity from 20+ Solana DEXs through Jupiter's routing engine
- **Advanced Analytics** - Track performance metrics, slippage analysis, and trading statistics

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
| API Key | Jupiter DEX API key for authenticated requests and higher rate limits | Yes |
| Environment | API environment (mainnet-beta, devnet, testnet) | Yes |
| Wallet Address | Solana wallet public key for trading operations | Yes |
| Private Key | Wallet private key for transaction signing (encrypted) | Yes |

## Resources & Operations

### 1. Swap Quotes

| Operation | Description |
|-----------|-------------|
| Get Quote | Retrieve optimal swap route and pricing between two tokens |
| Get Routes | List all available swap routes with detailed path information |
| Validate Quote | Check quote validity and current market conditions |
| Compare Routes | Analyze multiple swap paths for best execution |

### 2. Token Prices

| Operation | Description |
|-----------|-------------|
| Get Current Price | Fetch real-time token price in USD or SOL |
| Get Historical Prices | Retrieve price history with customizable time ranges |
| Get Price Chart | Access OHLCV candlestick data for charting |
| Compare Prices | Compare token prices across multiple time periods |
| Get Market Cap | Retrieve market capitalization and trading volume |

### 3. Limit Orders

| Operation | Description |
|-----------|-------------|
| Create Order | Place a new limit order with specified parameters |
| Get Order | Retrieve details of a specific limit order |
| List Orders | Get all active limit orders for the wallet |
| Cancel Order | Cancel an existing limit order |
| Update Order | Modify order parameters like price or size |
| Get Order History | Retrieve completed and cancelled order history |

### 4. DCA Orders

| Operation | Description |
|-----------|-------------|
| Create DCA | Set up a new dollar-cost averaging schedule |
| Get DCA Status | Check current status and progress of DCA orders |
| List DCA Orders | Retrieve all active DCA strategies |
| Update DCA | Modify DCA parameters like frequency or amount |
| Pause DCA | Temporarily pause DCA execution |
| Cancel DCA | Permanently stop and cancel DCA strategy |
| Get DCA History | View historical DCA execution data |

### 5. Perpetual Positions

| Operation | Description |
|-----------|-------------|
| Open Position | Create a new leveraged perpetual position |
| Get Position | Retrieve current position details and PnL |
| List Positions | Get all open perpetual positions |
| Close Position | Close an existing perpetual position |
| Adjust Margin | Add or remove margin from positions |
| Set Stop Loss | Configure stop-loss orders for risk management |
| Get Funding Rates | Retrieve current and historical funding rates |

### 6. JLP Operations

| Operation | Description |
|-----------|-------------|
| Add Liquidity | Deposit tokens into Jupiter Liquidity Provider pools |
| Remove Liquidity | Withdraw liquidity and collect rewards |
| Get Pool Info | Retrieve pool statistics and current APY |
| List Pools | Get available JLP pools and their parameters |
| Claim Rewards | Collect accumulated liquidity provider rewards |
| Get Position | Check current LP position and earnings |
| Calculate APY | Estimate annual percentage yield for pools |

## Usage Examples

```javascript
// Get swap quote for SOL to USDC
{
  "inputToken": "So11111111111111111111111111111111111111112",
  "outputToken": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", 
  "amount": 1000000000,
  "slippageBps": 50
}

// Create a DCA order for weekly SOL purchases
{
  "inputToken": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "outputToken": "So11111111111111111111111111111111111111112",
  "amountPerOrder": 100000000,
  "frequency": "weekly",
  "totalOrders": 12
}

// Get current token price for Jupiter token
{
  "tokenAddress": "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  "currency": "USD",
  "includeMarketData": true
}

// Add liquidity to JLP pool
{
  "poolAddress": "5BUwFW4nRbftYTDMbgxykoFWqWHPzahFSNAaaaJtVKsq",
  "tokenAAmount": 1000000000,
  "tokenBAmount": 50000000,
  "minLPTokens": 900000000
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided API key | Verify API key in credentials and check permissions |
| Insufficient Balance | Wallet doesn't have enough tokens for operation | Check wallet balance and ensure sufficient funds |
| Slippage Exceeded | Price moved beyond acceptable slippage tolerance | Increase slippage tolerance or retry with fresh quote |
| Network Congestion | Solana network is experiencing high traffic | Wait for network conditions to improve or increase fees |
| Invalid Token Address | Token mint address is not recognized | Verify token address on Solana blockchain explorer |
| Order Not Found | Specified order ID doesn't exist | Check order ID and ensure it belongs to your wallet |

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
- **Jupiter API Documentation**: [Jupiter API Docs](https://station.jup.ag/docs/apis)
- **Jupiter Community**: [Jupiter Discord](https://discord.gg/jup)