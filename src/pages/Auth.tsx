import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { toast } from "@/hooks/use-toast";
import { AuthService } from "@/lib/auth";

function Auth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSMSVerification, setShowSMSVerification] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [smsCode, setSmsCode] = useState("");
  
  // Форма регистрации
  const [regForm, setRegForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    firstName: "",
    lastName: ""
  });

  // Форма входа
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (regForm.password !== regForm.confirmPassword) {
        throw new Error("Пароли не совпадают");
      }

      if (regForm.password.length < 6) {
        throw new Error("Пароль должен быть не менее 6 символов");
      }

      const user = AuthService.register(
        regForm.email,
        regForm.password,
        regForm.phone,
        regForm.firstName,
        regForm.lastName
      );

      setPendingUser(user);
      
      // Отправка SMS кода
      AuthService.sendSMS(regForm.phone);
      setShowSMSVerification(true);
      
      toast({
        title: "Регистрация успешна!",
        description: `SMS код отправлен на номер ${regForm.phone}`,
      });

    } catch (error: any) {
      toast({
        title: "Ошибка регистрации",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = AuthService.login(loginForm.email, loginForm.password);
      
      if (user.twoFactorEnabled) {
        setPendingUser(user);
        AuthService.sendSMS(user.phone);
        setShowSMSVerification(true);
        toast({
          title: "Двухфакторная аутентификация",
          description: `SMS код отправлен на номер ${user.phone}`,
        });
      } else {
        toast({
          title: "Вход выполнен успешно!",
          description: `Добро пожаловать, ${user.firstName}!`,
        });
        onAuthSuccess();
      }

    } catch (error: any) {
      toast({
        title: "Ошибка входа",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSMSVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isValid = AuthService.verifySMS(pendingUser.phone, smsCode);
      
      if (!isValid) {
        throw new Error("Неверный SMS код");
      }

      // Активируем пользователя
      pendingUser.isVerified = true;
      pendingUser.twoFactorEnabled = true;
      
      const users = AuthService.getUsers();
      const userIndex = users.findIndex(u => u.id === pendingUser.id);
      if (userIndex !== -1) {
        users[userIndex] = pendingUser;
        AuthService.saveUsers(users);
      }

      AuthService.setCurrentUser(pendingUser);
      
      toast({
        title: "Верификация успешна!",
        description: "Добро пожаловать в ФПИ-Банк!",
      });

      onAuthSuccess();

    } catch (error: any) {
      toast({
        title: "Ошибка верификации",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showSMSVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#8B5CF6] rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={32} className="text-white" />
            </div>
            <CardTitle>SMS Верификация</CardTitle>
            <CardDescription>
              Введите код, отправленный на номер<br />
              <strong>{pendingUser?.phone}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSMSVerification} className="space-y-4">
              <div>
                <Label htmlFor="smsCode">SMS Код</Label>
                <Input
                  id="smsCode"
                  type="text"
                  placeholder="123456"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90" disabled={isLoading}>
                {isLoading ? "Проверка..." : "Подтвердить"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setShowSMSVerification(false)}
              >
                Назад
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-[#8B5CF6] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">ФПИ</span>
            </div>
            <span className="text-2xl font-bold">ФПИ-Банк</span>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Безопасный банкинг
          </Badge>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="loginEmail">Email</Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    placeholder="example@mail.ru"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="loginPassword">Пароль</Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90" disabled={isLoading}>
                  {isLoading ? "Вход..." : "Войти"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Имя</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Иван"
                      value={regForm.firstName}
                      onChange={(e) => setRegForm({...regForm, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Фамилия</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Иванов"
                      value={regForm.lastName}
                      onChange={(e) => setRegForm({...regForm, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="regEmail">Email</Label>
                  <Input
                    id="regEmail"
                    type="email"
                    placeholder="example@mail.ru"
                    value={regForm.email}
                    onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({...regForm, phone: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="regPassword">Пароль</Label>
                  <Input
                    id="regPassword"
                    type="password"
                    placeholder="••••••••"
                    value={regForm.password}
                    onChange={(e) => setRegForm({...regForm, password: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm({...regForm, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90" disabled={isLoading}>
                  {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default Auth;