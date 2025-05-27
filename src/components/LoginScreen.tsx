
import { useState } from 'react';
import { Shield, Database, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const MASTER_PASSWORD = 'insightpilot2024'; // Master password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (password === MASTER_PASSWORD) {
      toast({
        title: "Acceso autorizado",
        description: "Bienvenido a InsightPilot",
      });
      onLogin();
    } else {
      toast({
        title: "Acceso denegado",
        description: "Contraseña incorrecta",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">InsightPilot</h1>
            <p className="text-gray-600 mt-2">Plataforma de Análisis de Datos Interno</p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-gray-200">
            <Database className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700 font-medium">Múltiples BD SQL</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-gray-200">
            <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700 font-medium">Acceso Seguro</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-center">Acceso Autorizado</CardTitle>
            <CardDescription className="text-center">
              Ingresa la contraseña maestra para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Contraseña maestra"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/50"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Verificando...' : 'Acceder'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Hint for demo */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Demo: usa la contraseña <code className="bg-gray-100 px-2 py-1 rounded">insightpilot2024</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
