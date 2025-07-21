export interface User {
  id: string;
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  accounts: BankAccount[];
  cards: BankCard[];
  cryptoWallet: CryptoWallet;
  createdAt: Date;
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'deposit';
  balance: number;
  currency: string;
  interestRate?: number;
  isActive: boolean;
  createdAt: Date;
}

export interface BankCard {
  id: string;
  cardNumber: string;
  cardType: 'debit' | 'credit';
  expiryDate: string;
  cvv: string;
  balance: number;
  creditLimit?: number;
  cashback: number;
  isActive: boolean;
  linkedAccountId: string;
  createdAt: Date;
}

export interface CryptoWallet {
  id: string;
  address: string;
  holdings: CryptoHolding[];
  totalValue: number;
}

export interface CryptoHolding {
  symbol: string;
  name: string;
  amount: number;
  currentPrice: number;
  totalValue: number;
}

export interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId?: string;
  type: 'transfer' | 'deposit' | 'withdrawal' | 'payment' | 'crypto_trade';
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}

// Локальное хранилище пользователей
export class AuthService {
  private static USERS_KEY = 'fpi_bank_users';
  private static CURRENT_USER_KEY = 'fpi_bank_current_user';
  private static TRANSACTIONS_KEY = 'fpi_bank_transactions';

  static getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static getCurrentUser(): User | null {
    const currentUser = localStorage.getItem(this.CURRENT_USER_KEY);
    return currentUser ? JSON.parse(currentUser) : null;
  }

  static setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static generateAccountNumber(): string {
    return '40817810' + Math.random().toString().slice(2, 12);
  }

  static generateCardNumber(): string {
    return '4274' + Math.random().toString().slice(2, 16).padEnd(12, '0');
  }

  static generateCVV(): string {
    return Math.floor(Math.random() * 900 + 100).toString();
  }

  static register(email: string, password: string, phone: string, firstName: string, lastName: string): User {
    const users = this.getUsers();
    
    if (users.find(u => u.email === email)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser: User = {
      id: this.generateId(),
      email,
      password,
      phone,
      firstName,
      lastName,
      isVerified: false,
      twoFactorEnabled: false,
      accounts: [],
      cards: [],
      cryptoWallet: {
        id: this.generateId(),
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        holdings: [],
        totalValue: 0
      },
      createdAt: new Date()
    };

    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  static login(email: string, password: string): User {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    this.setCurrentUser(user);
    return user;
  }

  static logout(): void {
    this.setCurrentUser(null);
  }

  static sendSMS(phone: string): string {
    // Симуляция отправки SMS с кодом
    const code = Math.floor(Math.random() * 900000 + 100000).toString();
    console.log(`SMS код для ${phone}: ${code}`);
    localStorage.setItem(`sms_code_${phone}`, code);
    return code;
  }

  static verifySMS(phone: string, code: string): boolean {
    const storedCode = localStorage.getItem(`sms_code_${phone}`);
    if (storedCode === code) {
      localStorage.removeItem(`sms_code_${phone}`);
      return true;
    }
    return false;
  }

  static createAccount(userId: string, accountType: 'checking' | 'savings' | 'deposit'): BankAccount {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Пользователь не найден');
    }

    const newAccount: BankAccount = {
      id: this.generateId(),
      accountNumber: this.generateAccountNumber(),
      accountType,
      balance: accountType === 'checking' ? 1000 : 0, // Начальный баланс
      currency: 'RUB',
      interestRate: accountType === 'savings' ? 5.5 : accountType === 'deposit' ? 8.0 : undefined,
      isActive: true,
      createdAt: new Date()
    };

    users[userIndex].accounts.push(newAccount);
    this.saveUsers(users);
    
    if (this.getCurrentUser()?.id === userId) {
      this.setCurrentUser(users[userIndex]);
    }

    return newAccount;
  }

  static createCard(userId: string, cardType: 'debit' | 'credit', linkedAccountId: string): BankCard {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Пользователь не найден');
    }

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 4);

    const newCard: BankCard = {
      id: this.generateId(),
      cardNumber: this.generateCardNumber(),
      cardType,
      expiryDate: expiryDate.toISOString().slice(0, 7), // YYYY-MM
      cvv: this.generateCVV(),
      balance: 0,
      creditLimit: cardType === 'credit' ? 300000 : undefined,
      cashback: 3.0,
      isActive: true,
      linkedAccountId,
      createdAt: new Date()
    };

    users[userIndex].cards.push(newCard);
    this.saveUsers(users);
    
    if (this.getCurrentUser()?.id === userId) {
      this.setCurrentUser(users[userIndex]);
    }

    return newCard;
  }

  static getTransactions(): Transaction[] {
    const transactions = localStorage.getItem(this.TRANSACTIONS_KEY);
    return transactions ? JSON.parse(transactions) : [];
  }

  static saveTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.push(transaction);
    localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions));
  }

  static transfer(fromAccountId: string, toAccountId: string, amount: number, description: string): Transaction {
    const users = this.getUsers();
    let fromUser = users.find(u => u.accounts.some(a => a.id === fromAccountId));
    let toUser = users.find(u => u.accounts.some(a => a.id === toAccountId));

    if (!fromUser || !toUser) {
      throw new Error('Счет не найден');
    }

    const fromAccount = fromUser.accounts.find(a => a.id === fromAccountId)!;
    const toAccount = toUser.accounts.find(a => a.id === toAccountId)!;

    if (fromAccount.balance < amount) {
      throw new Error('Недостаточно средств');
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    this.saveUsers(users);

    const transaction: Transaction = {
      id: this.generateId(),
      fromAccountId,
      toAccountId,
      type: 'transfer',
      amount,
      currency: 'RUB',
      description,
      status: 'completed',
      timestamp: new Date()
    };

    this.saveTransaction(transaction);
    return transaction;
  }
}