import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { AuthService } from "@/lib/auth";
import Auth from "./Auth";
import Dashboard from "./Dashboard";

function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated) {
    return <Dashboard onLogout={() => {
      AuthService.logout();
      setIsAuthenticated(false);
    }} />;
  }

  if (showAuth) {
    return <Auth onAuthSuccess={() => {
      setIsAuthenticated(true);
      setShowAuth(false);
    }} />;
  }

  const handleLogin = () => {
    setShowAuth(true);
  };

  const handleDownloadApp = () => {
    toast({
      title: "Скачивание приложения",
      description: "Начинается загрузка ФПИ-Банк Мобайл...",
    });
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = 'data:text/plain;charset=utf-8,ФПИ-Банк Мобайл - Приложение для управления финансами';
      link.download = 'fpi-bank-mobile.txt';
      link.click();
    }, 1000);
  };

  const handleOpenAccount = () => {
    setShowAuth(true);
  };

  const handleApplyCard = () => {
    setShowAuth(true);
  };

  const handleApplyCredit = () => {
    setShowAuth(true);
  };

  const handleOpenDeposit = () => {
    setShowAuth(true);
  };

  const handleOpenWallet = () => {
    setShowAuth(true);
  };

  const handleCryptoTrade = (crypto: string) => {
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#8B5CF6] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ФПИ</span>
              </div>
              <span className="text-xl font-bold text-[#1E293B]">ФПИ-Банк</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-[#0052CC] transition-colors">Карты</a>
              <a href="#" className="text-gray-600 hover:text-[#0052CC] transition-colors">Кредиты</a>
              <a href="#" className="text-gray-600 hover:text-[#0052CC] transition-colors">Депозиты</a>
              <a href="#" className="text-gray-600 hover:text-[#0052CC] transition-colors">Инвестиции</a>
              <a href="#" className="text-gray-600 hover:text-[#8B5CF6] transition-colors flex items-center">
                <Icon name="Bitcoin" size={16} className="mr-1" fallback="Coins" />
                Криптовалюты
              </a>
              <a href="#" className="text-gray-600 hover:text-[#0052CC] transition-colors">Бизнес</a>
            </nav>
            <Button onClick={handleLogin} className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90">
              Войти в банк
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0052CC] to-[#1E293B] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-4">
                  Новое поколение банкинга
                </Badge>
                <h1 className="text-5xl font-bold mb-6 leading-tight">
                  Банк будущего<br />
                  <span className="text-[#10B981]">уже сегодня</span>
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  ФПИ-Банк — это технологичные решения для современной жизни. 
                  Мобильные платежи, инвестиции и инновационные банковские продукты.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleDownloadApp} size="lg" className="bg-white text-[#0052CC] hover:bg-gray-100">
                  <Icon name="Smartphone" className="mr-2" size={20} />
                  Скачать приложение
                </Button>
                <Button onClick={handleOpenAccount} size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Открыть счёт
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100">Баланс</span>
                    <Icon name="Eye" size={16} className="text-blue-100" />
                  </div>
                  <div className="text-3xl font-bold">1 234 567,89 ₽</div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 rounded-lg p-4">
                      <Icon name="CreditCard" className="mb-2 text-[#10B981]" size={24} />
                      <div className="text-sm text-blue-100">Карты</div>
                      <div className="font-semibold">3 активные</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <Icon name="TrendingUp" className="mb-2 text-[#10B981]" size={24} />
                      <div className="text-sm text-blue-100">Доходность</div>
                      <div className="font-semibold">+12.5%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { icon: "CreditCard", title: "Карты", desc: "Дебетовые и кредитные" },
              { icon: "Banknote", title: "Переводы", desc: "Быстро и безопасно" },
              { icon: "PiggyBank", title: "Депозиты", desc: "До 8% годовых" },
              { icon: "TrendingUp", title: "Инвестиции", desc: "Готовые портфели" },
              { icon: "Bitcoin", title: "Криптовалюты", desc: "Bitcoin, Ethereum", fallback: "Coins" },
              { icon: "Building", title: "Бизнес", desc: "Решения для МСБ" }
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${item.title === 'Криптовалюты' ? 'bg-[#8B5CF6]/10' : 'bg-[#0052CC]/10'} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <Icon name={item.icon} className={item.title === 'Криптовалюты' ? 'text-[#8B5CF6]' : 'text-[#0052CC]'} size={24} fallback={item.fallback} />
                  </div>
                  <h3 className="font-semibold text-[#1E293B] mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E293B] mb-4">Банковские продукты</h2>
            <p className="text-xl text-gray-600">Всё для вашего финансового благополучия</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Карты */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-[#0052CC] to-[#1E293B] p-6 text-white">
                <Icon name="CreditCard" size={32} className="mb-4" />
                <h3 className="text-xl font-bold mb-2">Банковские карты</h3>
                <p className="text-blue-100">Дебетовые и кредитные карты с выгодными условиями</p>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Icon name="Check" className="text-[#10B981] mr-2" size={16} />
                    <span className="text-sm">Кэшбэк до 5%</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="Check" className="text-[#10B981] mr-2" size={16} />
                    <span className="text-sm">Бесплатное обслуживание</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="Check" className="text-[#10B981] mr-2" size={16} />
                    <span className="text-sm">Мгновенная выпуск</span>
                  </li>
                </ul>
                <Button onClick={handleApplyCard} className="w-full bg-[#0052CC] hover:bg-[#0052CC]/90">
                  Оформить карту
                </Button>
              </CardContent>
            </Card>

            {/* Кредиты */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-[#10B981] to-[#059669] p-6 text-white">
                <Icon name="Banknote" size={32} className="mb-4" />
                <h3 className="text-xl font-bold mb-2">Кредитные продукты</h3>
                <p className="text-green-100">Выгодные условия кредитования для любых целей</p>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Icon name="Check" className="text-[#10B981] mr-2" size={16} />
                    <span className="text-sm">Ставка от 6.9%</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="Check" className="text-[#10B981] mr-2" size={16} />
                    <span className="text-sm">Сумма до 5 млн ₽</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="Check" className="text-[#10B981] mr-2" size={16} />
                    <span className="text-sm">Онлайн-одобрение</span>
                  </li>
                </ul>
                <Button onClick={handleApplyCredit} className="w-full bg-[#10B981] hover:bg-[#10B981]/90">
                  Подать заявку
                </Button>
              </CardContent>
            </Card>

            {/* Депозиты */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] p-6 text-white">
                <Icon name="PiggyBank" size={32} className="mb-4" />
                <h3 className="text-xl font-bold mb-2">Депозиты</h3>
                <p className="text-red-100">Надёжные вклады с высокой доходностью</p>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Icon name="Check" className="text-[#10B981] mr-2" size={16} />
                    <span className="text-sm">До 8% годовых</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="Check" className="text-[#10B981] mr-2" size={16} />
                    <span className="text-sm">Страхование АСВ</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="Check" className="text-[#10B981] mr-2" size={16} />
                    <span className="text-sm">Пополнение и снятие</span>
                  </li>
                </ul>
                <Button onClick={handleOpenDeposit} className="w-full bg-[#EF4444] hover:bg-[#EF4444]/90">
                  Открыть депозит
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Crypto Section */}
      <section className="py-16 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              Криптовалюты
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Торговля цифровыми активами</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              ФПИ-Банк поддерживает операции с криптовалютами. Покупайте, продавайте и храните Bitcoin, Ethereum и другие популярные монеты.
            </p>
          </div>

          {/* Crypto Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { symbol: "BTC", name: "Bitcoin", price: "2,485,321 ₽", change: "+5.2%", color: "bg-orange-500" },
              { symbol: "ETH", name: "Ethereum", price: "186,432 ₽", change: "+3.1%", color: "bg-blue-500" },
              { symbol: "USDT", name: "Tether", price: "91.35 ₽", change: "-0.1%", color: "bg-green-500" }
            ].map((crypto, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${crypto.color} rounded-full flex items-center justify-center`}>
                        <span className="font-bold text-sm">{crypto.symbol}</span>
                      </div>
                      <div>
                        <h3 className="font-bold">{crypto.name}</h3>
                        <p className="text-purple-200 text-sm">{crypto.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{crypto.price}</div>
                      <div className={`text-sm ${crypto.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {crypto.change}
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => handleCryptoTrade(crypto.name)} size="sm" className="w-full bg-white/20 hover:bg-white/30 border-white/30">
                    Торговать
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Crypto Features */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Криптокошелёк ФПИ-Банк</h3>
              <div className="space-y-4 mb-8">
                {[
                  "Безопасное хранение криптовалют",
                  "Мгновенная покупка и продажа",
                  "Низкие комиссии за операции",
                  "Поддержка 50+ криптовалют",
                  "P2P переводы между пользователями"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Icon name="Shield" className="text-yellow-400 mr-3" size={20} />
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleOpenWallet} size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  <Icon name="Wallet" className="mr-2" size={20} />
                  Открыть кошелёк
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Узнать больше
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="Bitcoin" size={32} className="text-white" fallback="Coins" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Портфель</h3>
                    <p className="text-purple-200">Общая стоимость активов</p>
                    <div className="text-3xl font-bold mt-2">478,932 ₽</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "BTC", amount: "0.15", value: "372,798 ₽" },
                      { name: "ETH", amount: "0.57", value: "106,286 ₽" }
                    ].map((holding, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4">
                        <div className="font-semibold">{holding.name}</div>
                        <div className="text-sm text-purple-200">{holding.amount}</div>
                        <div className="text-sm font-bold mt-1">{holding.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Payments Section */}
      <section className="py-16 bg-gradient-to-r from-[#1E293B] to-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-[#10B981] text-white mb-4">
                Инновации
              </Badge>
              <h2 className="text-4xl font-bold mb-6">Мобильные платежи нового поколения</h2>
              <p className="text-xl text-gray-300 mb-8">
                Переводы и платежи через приложение ФПИ-Банк. Быстро, безопасно, удобно.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Переводы по номеру телефона",
                  "QR-код платежи",
                  "Бесконтактные платежи",
                  "Мгновенные переводы 24/7"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Icon name="Zap" className="text-[#10B981] mr-3" size={20} />
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
              <Button onClick={handleDownloadApp} size="lg" className="bg-[#10B981] hover:bg-[#10B981]/90">
                <Icon name="Download" className="mr-2" size={20} />
                Скачать приложение
              </Button>
            </div>
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="Smartphone" size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">ФПИ-Банк Мобайл</h3>
                    <p className="text-gray-300">Все банковские операции в одном приложении</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: "CreditCard", title: "Карты" },
                      { icon: "Send", title: "Переводы" },
                      { icon: "QrCode", title: "QR-платежи" },
                      { icon: "TrendingUp", title: "Инвестиции" }
                    ].map((item, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 text-center">
                        <Icon name={item.icon} className="text-[#10B981] mx-auto mb-2" size={24} />
                        <div className="text-sm">{item.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "2.5M+", label: "Клиентов" },
              { number: "50+", label: "Городов России" },
              { number: "24/7", label: "Поддержка" },
              { number: "№1", label: "По инновациям" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[#0052CC] mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E293B] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[#8B5CF6] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ФПИ</span>
                </div>
                <span className="text-xl font-bold">ФПИ-Банк</span>
              </div>
              <p className="text-gray-400 mb-4">Банк нового поколения с инновационными решениями</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Продукты</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Карты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Кредиты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Депозиты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Инвестиции</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Переводы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ипотека</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Бизнес</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Поддержка</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Icon name="Phone" className="mr-2" size={16} />
                  <span>8 800 555-35-35</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Mail" className="mr-2" size={16} />
                  <span>info@fpi-bank.ru</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ФПИ-Банк. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;