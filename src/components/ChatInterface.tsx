
import { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  query?: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  selectedConnection: string | null;
  selectedTable: string | null;
  onQueryExecute: (query: string) => void;
  isLoading: boolean;
}

const ChatInterface = ({ selectedConnection, selectedTable, onQueryExecute, isLoading }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '¡Hola! Soy tu asistente de análisis de datos. Puedes preguntarme sobre tus bases de datos usando lenguaje natural. Por ejemplo: "Muéstrame todos los usuarios creados este mes" o "¿Cuáles son los productos más vendidos?"',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedConnection) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI processing
    setTimeout(() => {
      const query = generateMockQuery(inputText, selectedTable);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `He interpretado tu consulta y generé la siguiente consulta SQL:`,
        query: query,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      onQueryExecute(query);
    }, 1000);
  };

  const generateMockQuery = (userInput: string, table: string | null) => {
    const input = userInput.toLowerCase();
    const targetTable = table || 'users';

    if (input.includes('todos') || input.includes('listar')) {
      return `SELECT * FROM ${targetTable} LIMIT 10;`;
    } else if (input.includes('contar') || input.includes('cuántos')) {
      return `SELECT COUNT(*) as total FROM ${targetTable};`;
    } else if (input.includes('últimos') || input.includes('recientes')) {
      return `SELECT * FROM ${targetTable} ORDER BY created_at DESC LIMIT 5;`;
    } else {
      return `SELECT * FROM ${targetTable} WHERE name LIKE '%${input.split(' ')[0]}%';`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'bot' && (
                <div className="bg-blue-600 p-2 rounded-full">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              
              <Card className={`p-4 max-w-2xl ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-200'
              }`}>
                <p className="text-sm">{message.content}</p>
                {message.query && (
                  <div className="mt-3 p-3 bg-gray-100 rounded-md">
                    <code className="text-sm text-gray-800">{message.query}</code>
                  </div>
                )}
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </Card>

              {message.type === 'user' && (
                <div className="bg-gray-600 p-2 rounded-full">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-full">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <Card className="p-4 bg-white border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <p className="text-sm text-gray-600">Ejecutando consulta...</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-4xl mx-auto">
          {!selectedConnection ? (
            <div className="text-center py-4">
              <p className="text-gray-500">Selecciona una conexión de base de datos para comenzar</p>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Input
                placeholder="Escribe tu pregunta sobre los datos aquí..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
