
import { useState } from 'react';
import { Settings as SettingsIcon, Database, Key, Plus, Trash2, TestTube, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useConfig, DatabaseConnection } from '@/contexts/ConfigContext';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { connections, openaiApiKey, addConnection, updateConnection, deleteConnection, testConnection, setOpenaiApiKey } = useConfig();
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<DatabaseConnection | null>(null);
  
  const [formData, setFormData] = useState<{
    name: string;
    type: 'postgresql' | 'mysql' | 'sqlserver';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  }>({
    name: '',
    type: 'postgresql',
    host: '',
    port: 5432,
    database: '',
    username: '',
    password: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'postgresql',
      host: '',
      port: 5432,
      database: '',
      username: '',
      password: ''
    });
    setEditingConnection(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingConnection) {
      updateConnection(editingConnection.id, formData);
      toast({
        title: "Conexión actualizada",
        description: "La conexión se ha actualizado correctamente.",
      });
    } else {
      addConnection(formData);
      toast({
        title: "Conexión agregada",
        description: "La nueva conexión se ha agregado correctamente.",
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (connection: DatabaseConnection) => {
    setFormData({
      name: connection.name,
      type: connection.type,
      host: connection.host,
      port: connection.port,
      database: connection.database,
      username: connection.username,
      password: connection.password
    });
    setEditingConnection(connection);
    setIsDialogOpen(true);
  };

  const handleTest = async (id: string) => {
    const success = await testConnection(id);
    toast({
      title: success ? "Conexión exitosa" : "Error de conexión",
      description: success 
        ? "La conexión a la base de datos fue exitosa." 
        : "No se pudo conectar a la base de datos.",
      variant: success ? "default" : "destructive"
    });
  };

  const handleDelete = (id: string, name: string) => {
    deleteConnection(id);
    toast({
      title: "Conexión eliminada",
      description: `La conexión "${name}" ha sido eliminada.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPortByType = (type: 'postgresql' | 'mysql' | 'sqlserver') => {
    switch (type) {
      case 'postgresql': return 5432;
      case 'mysql': return 3306;
      case 'sqlserver': return 1433;
      default: return 5432;
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5" />
            <span>Configuración de InsightPilot</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* OpenAI API Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>OpenAI API Key</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      placeholder="Ingresa tu API Key de OpenAI"
                      value={openaiApiKey}
                      onChange={(e) => setOpenaiApiKey(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Necesaria para las funciones de análisis con IA
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Database Connections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Conexiones de Base de Datos</span>
                </div>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {connections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay conexiones configuradas</p>
                  <p className="text-sm">Agrega tu primera conexión de base de datos</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {connections.map((connection) => (
                    <div key={connection.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium">{connection.name}</h4>
                          <Badge className={getStatusColor(connection.status)}>
                            {connection.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {connection.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTest(connection.id)}
                            disabled={connection.status === 'testing'}
                          >
                            <TestTube className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(connection)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(connection.id, connection.name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {connection.host}:{connection.port} / {connection.database}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Connection Form */}
              {(editingConnection || !connections.length) && (
                <div className="mt-6 border-t pt-6">
                  <h4 className="font-medium mb-4">
                    {editingConnection ? 'Editar Conexión' : 'Nueva Conexión'}
                  </h4>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Mi Base de Datos"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Tipo</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value: 'postgresql' | 'mysql' | 'sqlserver') => {
                            setFormData(prev => ({ 
                              ...prev, 
                              type: value,
                              port: getPortByType(value)
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="postgresql">PostgreSQL</SelectItem>
                            <SelectItem value="mysql">MySQL</SelectItem>
                            <SelectItem value="sqlserver">SQL Server</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="host">Host</Label>
                        <Input
                          id="host"
                          value={formData.host}
                          onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
                          placeholder="localhost"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="port">Puerto</Label>
                        <Input
                          id="port"
                          type="number"
                          value={formData.port}
                          onChange={(e) => setFormData(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="database">Base de Datos</Label>
                      <Input
                        id="database"
                        value={formData.database}
                        onChange={(e) => setFormData(prev => ({ ...prev, database: e.target.value }))}
                        placeholder="nombre_bd"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username">Usuario</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                          placeholder="usuario"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="contraseña"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit">
                        {editingConnection ? 'Actualizar' : 'Agregar'} Conexión
                      </Button>
                      {editingConnection && (
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
