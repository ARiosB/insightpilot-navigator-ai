
import { useState } from 'react';
import { Database, Table, ChevronDown, ChevronRight, Server, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SidebarProps {
  selectedConnection: string | null;
  selectedTable: string | null;
  onConnectionSelect: (connection: string) => void;
  onTableSelect: (table: string) => void;
}

const Sidebar = ({ selectedConnection, selectedTable, onConnectionSelect, onTableSelect }: SidebarProps) => {
  const [expandedConnections, setExpandedConnections] = useState<string[]>(['prod-db']);

  // Mock database connections
  const connections = [
    {
      id: 'prod-db',
      name: 'Base Producción',
      type: 'PostgreSQL',
      status: 'connected',
      tables: [
        { name: 'users', description: 'Tabla de usuarios del sistema', fields: 5 },
        { name: 'orders', description: 'Pedidos y transacciones', fields: 8 },
        { name: 'products', description: 'Catálogo de productos', fields: 12 },
      ]
    },
    {
      id: 'analytics-db',
      name: 'Analytics',
      type: 'MySQL',
      status: 'connected',
      tables: [
        { name: 'page_views', description: 'Vistas de página web', fields: 6 },
        { name: 'user_sessions', description: 'Sesiones de usuario', fields: 4 },
      ]
    },
    {
      id: 'legacy-db',
      name: 'Sistema Legacy',
      type: 'SQL Server',
      status: 'disconnected',
      tables: []
    }
  ];

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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Conexiones de Base de Datos</h3>
        
        <div className="space-y-2">
          {connections.map((connection) => (
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
                          <p className="text-xs text-gray-500">{connection.type}</p>
                          <Badge className={`text-xs ${getStatusColor(connection.status)}`}>
                            {connection.status}
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
                      {connection.tables.map((table) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
