
import { useState } from 'react';
import { Database, Table, ChevronDown, ChevronRight, Server, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useConfig } from '@/contexts/ConfigContext';

interface SidebarProps {
  selectedConnection: string | null;
  selectedTable: string | null;
  onConnectionSelect: (connection: string) => void;
  onTableSelect: (table: string) => void;
}

const Sidebar = ({ selectedConnection, selectedTable, onConnectionSelect, onTableSelect }: SidebarProps) => {
  const { connections } = useConfig();
  const [expandedConnections, setExpandedConnections] = useState<string[]>([]);

  // Mock tables for each connection
  const getTablesForConnection = (connectionId: string) => {
    return [
      { name: 'users', description: 'Tabla de usuarios del sistema', fields: 5 },
      { name: 'orders', description: 'Pedidos y transacciones', fields: 8 },
      { name: 'products', description: 'Catálogo de productos', fields: 12 },
    ];
  };

  const toggleConnection = (connectionId: string) => {
    setExpandedConnections(prev => 
      prev.includes(connectionId) 
        ? prev.filter(id => id !== connectionId)
        : [...prev, connectionId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'postgresql': return 'PostgreSQL';
      case 'mysql': return 'MySQL';
      case 'sqlserver': return 'SQL Server';
      default: return type.toUpperCase();
    }
  };

  if (connections.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin conexiones</h3>
          <p className="text-gray-500 text-sm mb-4">
            Configura tu primera conexión de base de datos usando el botón de configuración
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Conexiones de Base de Datos</h3>
        
        <div className="space-y-2">
          {connections.map((connection) => {
            const tables = getTablesForConnection(connection.id);
            
            return (
              <div key={connection.id} className="border border-gray-200 rounded-lg">
                <Collapsible
                  open={expandedConnections.includes(connection.id)}
                  onOpenChange={() => toggleConnection(connection.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`w-full justify-between p-3 h-auto ${
                        selectedConnection === connection.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => onConnectionSelect(connection.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Server className={`h-4 w-4 ${
                          connection.status === 'connected' ? 'text-green-600' : 'text-red-600'
                        }`} />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">{connection.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-xs text-gray-500">{getTypeDisplayName(connection.type)}</p>
                            <Badge className={`text-xs ${getStatusColor(connection.status)}`}>
                              {connection.status === 'testing' ? 'probando...' : connection.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {connection.status === 'connected' && (
                        expandedConnections.includes(connection.id) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  
                  {connection.status === 'connected' && (
                    <CollapsibleContent className="pb-2">
                      <div className="px-3 space-y-1">
                        {tables.map((table) => (
                          <div
                            key={table.name}
                            className={`p-2 rounded hover:bg-gray-50 cursor-pointer border-l-2 ${
                              selectedTable === table.name ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                            }`}
                            onClick={() => onTableSelect(table.name)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Table className="h-3 w-3 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">{table.name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-500">{table.fields} campos</span>
                                <Edit3 className="h-3 w-3 text-gray-400 hover:text-blue-600" />
                              </div>
                            </div>
                            {table.description && (
                              <p className="text-xs text-gray-500 mt-1 ml-5">{table.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
