
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql' | 'sqlserver';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  status: 'connected' | 'disconnected' | 'testing';
}

export interface ConfigContextType {
  connections: DatabaseConnection[];
  openaiApiKey: string;
  addConnection: (connection: Omit<DatabaseConnection, 'id' | 'status'>) => void;
  updateConnection: (id: string, connection: Partial<DatabaseConnection>) => void;
  deleteConnection: (id: string) => void;
  testConnection: (id: string) => Promise<boolean>;
  setOpenaiApiKey: (key: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [openaiApiKey, setOpenaiApiKeyState] = useState<string>('');

  // Cargar configuraciones del localStorage al iniciar
  useEffect(() => {
    const savedConnections = localStorage.getItem('insightpilot_connections');
    const savedApiKey = localStorage.getItem('insightpilot_openai_key');
    
    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    }
    
    if (savedApiKey) {
      setOpenaiApiKeyState(savedApiKey);
    }
  }, []);

  // Guardar conexiones en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('insightpilot_connections', JSON.stringify(connections));
  }, [connections]);

  const addConnection = (connectionData: Omit<DatabaseConnection, 'id' | 'status'>) => {
    const newConnection: DatabaseConnection = {
      ...connectionData,
      id: crypto.randomUUID(),
      status: 'disconnected'
    };
    setConnections(prev => [...prev, newConnection]);
  };

  const updateConnection = (id: string, updates: Partial<DatabaseConnection>) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.id === id ? { ...conn, ...updates } : conn
      )
    );
  };

  const deleteConnection = (id: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== id));
  };

  const testConnection = async (id: string): Promise<boolean> => {
    // Simular test de conexión
    updateConnection(id, { status: 'testing' });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular éxito/fallo aleatorio
    const success = Math.random() > 0.3;
    updateConnection(id, { status: success ? 'connected' : 'disconnected' });
    
    return success;
  };

  const setOpenaiApiKey = (key: string) => {
    setOpenaiApiKeyState(key);
    localStorage.setItem('insightpilot_openai_key', key);
  };

  return (
    <ConfigContext.Provider value={{
      connections,
      openaiApiKey,
      addConnection,
      updateConnection,
      deleteConnection,
      testConnection,
      setOpenaiApiKey
    }}>
      {children}
    </ConfigContext.Provider>
  );
};
