
import { useState } from 'react';
import { LogOut, Database, MessageSquare, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from './Sidebar';
import ChatInterface from './ChatInterface';
import ResultsPanel from './ResultsPanel';
import Settings from './Settings';
import { ConfigProvider } from '@/contexts/ConfigContext';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryExecute = async (query: string) => {
    setIsLoading(true);
    
    // Simulate query execution
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock results
    const mockResults = [
      { id: 1, name: 'Usuario A', email: 'usuario.a@empresa.com', created_at: '2024-01-15' },
      { id: 2, name: 'Usuario B', email: 'usuario.b@empresa.com', created_at: '2024-01-20' },
      { id: 3, name: 'Usuario C', email: 'usuario.c@empresa.com', created_at: '2024-02-01' },
    ];
    
    setQueryResults(mockResults);
    setIsLoading(false);
  };

  return (
    <ConfigProvider>
      <div className="min-h-screen flex bg-gray-50">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">InsightPilot</h1>
                  <p className="text-sm text-gray-500">Análisis de Datos</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Settings />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-gray-500 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <Sidebar
            selectedConnection={selectedConnection}
            selectedTable={selectedTable}
            onConnectionSelect={setSelectedConnection}
            onTableSelect={setSelectedTable}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Análisis con IA - {selectedConnection || 'Selecciona una conexión'}
              </h2>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex">
            {/* Chat Interface */}
            <div className="flex-1 flex flex-col">
              <ChatInterface
                selectedConnection={selectedConnection}
                selectedTable={selectedTable}
                onQueryExecute={handleQueryExecute}
                isLoading={isLoading}
              />
            </div>

            {/* Results Panel */}
            <div className="w-1/2 border-l border-gray-200">
              <div className="bg-white p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Resultados</h3>
                </div>
              </div>
              <ResultsPanel results={queryResults} />
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Dashboard;
