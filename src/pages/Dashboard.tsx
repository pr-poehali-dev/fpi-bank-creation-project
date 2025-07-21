import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { toast } from "@/hooks/use-toast";
import { AuthService, User, BankAccount, BankCard } from "@/lib/auth";

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferAccount, setTransferAccount] = useState("");
  const [transferDescription, setTransferDescription] = useState("");

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const refreshUser = () => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  };

  const handleCreateAccount = async (accountType: 'checking' | 'savings' | 'deposit') => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const newAccount = AuthService.createAccount(user.id, accountType);
      refreshUser();
      
      toast({
        title: "Счёт создан!",
        description: `${accountType === 'checking' ? 'Расчётный' : accountType === 'savings' ? 'Сберегательный' : 'Депозитный'} счёт успешно открыт`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCard = async (cardType: 'debit' | 'credit', linkedAccountId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const newCard = AuthService.createCard(user.id, cardType, linkedAccountId);
      refreshUser();
      
      toast({
        title: "Карта выпущена!",
        description: `${cardType === 'debit' ? 'Дебетовая' : 'Кредитная'} карта успешно оформлена`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!user || !transferAccount || !transferAmount) return;
    
    setIsLoading(true);
    try {
      const fromAccount = user.accounts.find(a => a.accountType === 'checking');
      if (!fromAccount) {
        throw new Error("У вас нет расчётного счёта для перевода");
      }

      AuthService.transfer(
        fromAccount.id,
        transferAccount,
        parseFloat(transferAmount),
        transferDescription || "Перевод средств"
      );
      
      refreshUser();
      setTransferAmount("");
      setTransferAccount("");
      setTransferDescription("");
      
      toast({
        title: "Перевод выполнен!",
        description: `Переведено ${transferAmount} ₽`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка перевода",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  const totalBalance = user.accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#8B5CF6] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ФПИ</span>
              </div>
              <span className="text-xl font-bold">ФПИ-Банк</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Добро пожаловать, {user.firstName}!</span>
              <Button onClick={onLogout} variant="outline">
                <Icon name="LogOut" className="mr-2" size={16} />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="Wallet" className="mr-2 text-[#8B5CF6]" size={20} />
                Общий баланс
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#8B5CF6]">{totalBalance.toLocaleString()} ₽</div>
              <p className="text-sm text-gray-600 mt-2">На всех счетах</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="CreditCard" className="mr-2 text-green-600" size={20} />
                Активные карты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{user.cards.length}</div>
              <p className="text-sm text-gray-600 mt-2">Дебетовые и кредитные</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="TrendingUp" className="mr-2 text-blue-600" size={20} />
                Счета
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{user.accounts.length}</div>
              <p className="text-sm text-gray-600 mt-2">Открытых счетов</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="accounts" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="accounts">Счета</TabsTrigger>
            <TabsTrigger value="cards">Карты</TabsTrigger>
            <TabsTrigger value="transfers">Переводы</TabsTrigger>
            <TabsTrigger value="crypto">Криптовалюты</TabsTrigger>
            <TabsTrigger value="loans">Кредиты</TabsTrigger>
          </TabsList>

          {/* Счета */}
          <TabsContent value="accounts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Мои счета</h2>
              <div className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Открыть счёт</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Открытие нового счёта</DialogTitle>
                      <DialogDescription>
                        Выберите тип счёта для открытия
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Button 
                        onClick={() => handleCreateAccount('checking')} 
                        className="w-full justify-start"
                        disabled={isLoading}
                      >
                        <Icon name="Wallet" className="mr-2" size={16} />
                        Расчётный счёт (для повседневных операций)
                      </Button>
                      <Button 
                        onClick={() => handleCreateAccount('savings')} 
                        className="w-full justify-start"
                        disabled={isLoading}
                      >
                        <Icon name="PiggyBank" className="mr-2" size={16} />
                        Сберегательный счёт (5.5% годовых)
                      </Button>
                      <Button 
                        onClick={() => handleCreateAccount('deposit')} 
                        className="w-full justify-start"
                        disabled={isLoading}
                      >
                        <Icon name="TrendingUp" className="mr-2" size={16} />
                        Депозитный счёт (8% годовых)
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid gap-4">
              {user.accounts.map((account) => (
                <Card key={account.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">
                          {account.accountType === 'checking' ? 'Расчётный счёт' : 
                           account.accountType === 'savings' ? 'Сберегательный счёт' : 'Депозитный счёт'}
                        </h3>
                        <p className="text-sm text-gray-600">№ {account.accountNumber}</p>
                        {account.interestRate && (
                          <Badge className="mt-2">
                            {account.interestRate}% годовых
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{account.balance.toLocaleString()} ₽</div>
                        <div className="text-sm text-gray-600">{account.currency}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Карты */}
          <TabsContent value="cards" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Мои карты</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Оформить карту</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Оформление новой карты</DialogTitle>
                    <DialogDescription>
                      Выберите тип карты и привяжите к счёту
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {user.accounts.length === 0 ? (
                      <p className="text-gray-600">Сначала откройте банковский счёт</p>
                    ) : (
                      user.accounts.map((account) => (
                        <div key={account.id} className="space-y-2">
                          <h4 className="font-medium">К счёту: {account.accountNumber}</h4>
                          <div className="flex space-x-2">
                            <Button 
                              onClick={() => handleCreateCard('debit', account.id)}
                              size="sm"
                              disabled={isLoading}
                            >
                              Дебетовая карта
                            </Button>
                            <Button 
                              onClick={() => handleCreateCard('credit', account.id)}
                              variant="outline"
                              size="sm"
                              disabled={isLoading}
                            >
                              Кредитная карта
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {user.cards.map((card) => (
                <Card key={card.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`p-6 text-white ${card.cardType === 'credit' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9]'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm opacity-90">
                            {card.cardType === 'debit' ? 'Дебетовая карта' : 'Кредитная карта'}
                          </p>
                          <p className="text-xs opacity-75">ФПИ-Банк</p>
                        </div>
                        <Icon name="CreditCard" size={32} className="opacity-75" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-lg font-mono tracking-wider">
                          {card.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
                        </p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs opacity-75">Действительна до</p>
                            <p className="text-sm">{card.expiryDate}</p>
                          </div>
                          <div>
                            <p className="text-xs opacity-75">CVV</p>
                            <p className="text-sm font-mono">{card.cvv}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Баланс</p>
                          <p className="text-xl font-bold">{card.balance.toLocaleString()} ₽</p>
                          {card.creditLimit && (
                            <p className="text-sm text-gray-600">
                              Кредитный лимит: {card.creditLimit.toLocaleString()} ₽
                            </p>
                          )}
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Кэшбэк {card.cashback}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Переводы */}
          <TabsContent value="transfers" className="space-y-6">
            <h2 className="text-2xl font-bold">Переводы</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Перевод средств</CardTitle>
                <CardDescription>
                  Переведите деньги на другой счёт
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="transferAccount">Номер счёта получателя</Label>
                  <Input
                    id="transferAccount"
                    placeholder="40817810123456789012"
                    value={transferAccount}
                    onChange={(e) => setTransferAccount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="transferAmount">Сумма перевода</Label>
                  <Input
                    id="transferAmount"
                    type="number"
                    placeholder="1000"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="transferDescription">Назначение платежа</Label>
                  <Input
                    id="transferDescription"
                    placeholder="За услуги"
                    value={transferDescription}
                    onChange={(e) => setTransferDescription(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleTransfer}
                  disabled={isLoading || !transferAccount || !transferAmount}
                  className="w-full"
                >
                  {isLoading ? "Перевод..." : "Выполнить перевод"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Криптовалюты */}
          <TabsContent value="crypto" className="space-y-6">
            <h2 className="text-2xl font-bold">Криптовалютный портфель</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Bitcoin" className="mr-2 text-orange-500" size={24} fallback="Coins" />
                  Мой кошелёк
                </CardTitle>
                <CardDescription>
                  Адрес: {user.cryptoWallet.address}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-4">
                  {user.cryptoWallet.totalValue.toLocaleString()} ₽
                </div>
                {user.cryptoWallet.holdings.length === 0 ? (
                  <p className="text-gray-600">Криптовалютные активы отсутствуют</p>
                ) : (
                  <div className="space-y-2">
                    {user.cryptoWallet.holdings.map((holding, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{holding.name}</p>
                          <p className="text-sm text-gray-600">{holding.amount} {holding.symbol}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{holding.totalValue.toLocaleString()} ₽</p>
                          <p className="text-sm text-gray-600">{holding.currentPrice.toLocaleString()} ₽</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Кредиты */}
          <TabsContent value="loans" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Кредитные продукты</h2>
              <Button>Подать заявку на кредит</Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Потребительский кредит</CardTitle>
                  <CardDescription>Для любых целей</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Ставка:</strong> от 6.9% годовых</p>
                    <p><strong>Сумма:</strong> до 5 000 000 ₽</p>
                    <p><strong>Срок:</strong> до 7 лет</p>
                  </div>
                  <Button className="w-full mt-4">Подать заявку</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ипотечный кредит</CardTitle>
                  <CardDescription>На покупку недвижимости</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Ставка:</strong> от 5.9% годовых</p>
                    <p><strong>Сумма:</strong> до 30 000 000 ₽</p>
                    <p><strong>Срок:</strong> до 30 лет</p>
                  </div>
                  <Button className="w-full mt-4">Подать заявку</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Dashboard;