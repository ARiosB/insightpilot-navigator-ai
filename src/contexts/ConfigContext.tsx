
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

  const validateConnectionData = (connection: DatabaseConnection): { isValid: boolean; error?: string } => {
    console.log('Validando conexión:', {
      name: connection.name,
      type: connection.type,
      host: connection.host,
      port: connection.port,
      database: connection.database,
      username: connection.username
    });

    if (!connection.host || connection.host.trim() === '') {
      return { isValid: false, error: 'Host es requerido' };
    }

    if (!connection.database || connection.database.trim() === '') {
      return { isValid: false, error: 'Nombre de base de datos es requerido' };
    }

    if (!connection.username || connection.username.trim() === '') {
      return { isValid: false, error: 'Usuario es requerido' };
    }

    if (!connection.password || connection.password.trim() === '') {
      return { isValid: false, error: 'Contraseña es requerida' };
    }

    // Validar puertos típicos por tipo de BD
    const expectedPorts = {
      mysql: 3306,
      postgresql: 5432,
      sqlserver: 1433
    };

    if (connection.port <= 0 || connection.port > 65535) {
      return { isValid: false, error: `Puerto debe estar entre 1 y 65535` };
    }

    // Advertir si el puerto no es el típico para ese tipo de BD
    if (connection.port !== expectedPorts[connection.type]) {
      console.warn(`Puerto ${connection.port} no es típico para ${connection.type}. Puerto esperado: ${expectedPorts[connection.type]}`);
    }

    return { isValid: true };
  };

  const testConnection = async (id: string): Promise<boolean> => {
    const connection = connections.find(conn => conn.id === id);
    if (!connection) {
      console.error('Conexión no encontrada');
      return false;
    }

    console.log('Iniciando prueba de conexión para:', connection.name);
    updateConnection(id, { status: 'testing' });
    
    // Simular tiempo de conexión
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Validar datos de conexión
    const validation = validateConnectionData(connection);
    
    if (!validation.isValid) {
      console.error('Error de validación:', validation.error);
      updateConnection(id, { status: 'disconnected' });
      return false;
    }

    // Simular conexión con mejor lógica
    // En un entorno real, aquí se haría la conexión real a través de una API backend
    const success = Math.random() > 0.2; // 80% de éxito para pruebas
    
    console.log(`Resultado de conexión para ${connection.name}:`, success ? 'EXITOSA' : 'FALLIDA');
    
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
