// Симуляция блокчейна Московской биржи
export interface Block {
  index: number;
  timestamp: Date;
  data: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  symbol: string;
  type: 'buy' | 'sell' | 'transfer';
  fee: number;
  timestamp: Date;
  signature: string;
}

export interface CryptoAsset {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  supply: number;
}

export class BlockchainService {
  private static BLOCKCHAIN_KEY = 'fpi_bank_blockchain';
  private static CRYPTO_PRICES_KEY = 'fpi_bank_crypto_prices';
  
  // Криптовалютные активы Московской биржи
  private static cryptoAssets: CryptoAsset[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      currentPrice: 2485321,
      priceChange24h: 5.2,
      volume24h: 28500000000,
      marketCap: 48500000000000,
      supply: 19500000
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      currentPrice: 186432,
      priceChange24h: 3.1,
      volume24h: 12800000000,
      marketCap: 22400000000000,
      supply: 120280000
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      currentPrice: 91.35,
      priceChange24h: -0.1,
      volume24h: 45200000000,
      marketCap: 87600000000000,
      supply: 95800000000
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      currentPrice: 24876,
      priceChange24h: 2.8,
      volume24h: 890000000,
      marketCap: 3890000000000,
      supply: 156400000
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      currentPrice: 38.42,
      priceChange24h: -1.5,
      volume24h: 456000000,
      marketCap: 1320000000000,
      supply: 34380000000
    }
  ];

  static sha256(message: string): string {
    // Простая имитация SHA-256 хеширования
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Преобразование в 32-битное целое
    }
    return Math.abs(hash).toString(16);
  }

  static calculateHash(index: number, previousHash: string, timestamp: Date, data: Transaction[], nonce: number): string {
    return this.sha256(index + previousHash + timestamp + JSON.stringify(data) + nonce);
  }

  static mineBlock(index: number, previousHash: string, timestamp: Date, data: Transaction[]): Block {
    let nonce = 0;
    let hash = '';
    
    // Proof of Work (упрощенная версия)
    do {
      nonce++;
      hash = this.calculateHash(index, previousHash, timestamp, data, nonce);
    } while (!hash.startsWith('00')); // Требуем, чтобы хеш начинался с "00"

    return {
      index,
      timestamp,
      data,
      previousHash,
      hash,
      nonce
    };
  }

  static getBlockchain(): Block[] {
    const blockchain = localStorage.getItem(this.BLOCKCHAIN_KEY);
    if (!blockchain) {
      // Создаем генезис блок
      const genesisBlock = this.mineBlock(0, '0', new Date(), []);
      const initialBlockchain = [genesisBlock];
      this.saveBlockchain(initialBlockchain);
      return initialBlockchain;
    }
    return JSON.parse(blockchain);
  }

  static saveBlockchain(blockchain: Block[]): void {
    localStorage.setItem(this.BLOCKCHAIN_KEY, JSON.stringify(blockchain));
  }

  static addBlock(transactions: Transaction[]): Block {
    const blockchain = this.getBlockchain();
    const previousBlock = blockchain[blockchain.length - 1];
    const newBlock = this.mineBlock(
      blockchain.length,
      previousBlock.hash,
      new Date(),
      transactions
    );
    
    blockchain.push(newBlock);
    this.saveBlockchain(blockchain);
    return newBlock;
  }

  static createTransaction(from: string, to: string, amount: number, symbol: string, type: 'buy' | 'sell' | 'transfer'): Transaction {
    const fee = amount * 0.001; // 0.1% комиссия
    
    return {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      from,
      to,
      amount,
      symbol,
      type,
      fee,
      timestamp: new Date(),
      signature: this.sha256(from + to + amount + symbol + Date.now())
    };
  }

  static executeTransaction(transaction: Transaction): boolean {
    try {
      // Добавляем транзакцию в блокчейн
      this.addBlock([transaction]);
      return true;
    } catch (error) {
      console.error('Ошибка выполнения транзакции:', error);
      return false;
    }
  }

  static getCryptoAssets(): CryptoAsset[] {
    return this.cryptoAssets;
  }

  static getCryptoPrice(symbol: string): number {
    const asset = this.cryptoAssets.find(a => a.symbol === symbol);
    return asset ? asset.currentPrice : 0;
  }

  static updatePrices(): void {
    // Симуляция изменения цен (случайные колебания)
    this.cryptoAssets.forEach(asset => {
      const changePercent = (Math.random() - 0.5) * 10; // ±5% изменение
      asset.currentPrice *= (1 + changePercent / 100);
      asset.priceChange24h = changePercent;
    });
    
    localStorage.setItem(this.CRYPTO_PRICES_KEY, JSON.stringify(this.cryptoAssets));
  }

  static buyCrypto(userWalletAddress: string, symbol: string, amountRub: number): Transaction | null {
    const asset = this.cryptoAssets.find(a => a.symbol === symbol);
    if (!asset) return null;

    const cryptoAmount = amountRub / asset.currentPrice;
    const transaction = this.createTransaction(
      'FPI_BANK_EXCHANGE',
      userWalletAddress,
      cryptoAmount,
      symbol,
      'buy'
    );

    if (this.executeTransaction(transaction)) {
      return transaction;
    }
    return null;
  }

  static sellCrypto(userWalletAddress: string, symbol: string, cryptoAmount: number): Transaction | null {
    const asset = this.cryptoAssets.find(a => a.symbol === symbol);
    if (!asset) return null;

    const rubAmount = cryptoAmount * asset.currentPrice;
    const transaction = this.createTransaction(
      userWalletAddress,
      'FPI_BANK_EXCHANGE',
      cryptoAmount,
      symbol,
      'sell'
    );

    if (this.executeTransaction(transaction)) {
      return transaction;
    }
    return null;
  }

  static getTransactionHistory(walletAddress: string): Transaction[] {
    const blockchain = this.getBlockchain();
    const transactions: Transaction[] = [];

    blockchain.forEach(block => {
      block.data.forEach(tx => {
        if (tx.from === walletAddress || tx.to === walletAddress) {
          transactions.push(tx);
        }
      });
    });

    return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  static validateBlockchain(): boolean {
    const blockchain = this.getBlockchain();
    
    for (let i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const previousBlock = blockchain[i - 1];

      // Проверяем хеш текущего блока
      if (currentBlock.hash !== this.calculateHash(
        currentBlock.index,
        currentBlock.previousHash,
        currentBlock.timestamp,
        currentBlock.data,
        currentBlock.nonce
      )) {
        return false;
      }

      // Проверяем связь с предыдущим блоком
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    
    return true;
  }

  static getBlockchainStats() {
    const blockchain = this.getBlockchain();
    const totalTransactions = blockchain.reduce((sum, block) => sum + block.data.length, 0);
    
    return {
      totalBlocks: blockchain.length,
      totalTransactions,
      isValid: this.validateBlockchain(),
      lastBlockTime: blockchain[blockchain.length - 1]?.timestamp || new Date()
    };
  }
}

// Автоматическое обновление цен каждые 30 секунд
setInterval(() => {
  BlockchainService.updatePrices();
}, 30000);