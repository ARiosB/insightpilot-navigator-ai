
import { Download, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResultsPanelProps {
  results: any[];
}

const ResultsPanel = ({ results }: ResultsPanelProps) => {
  const exportToCSV = () => {
    if (results.length === 0) return;

    const headers = Object.keys(results[0]);
    const csvContent = [
      headers.join(','),
      ...results.map(row => 
        headers.map(header => `"${row[header]}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (results.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <BarChart2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin resultados</h3>
          <p className="text-gray-500">Ejecuta una consulta para ver los resultados aquí</p>
        </div>
      </div>
    );
  }

  const headers = Object.keys(results[0]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Results Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">
            {results.length} registro{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
          </h4>
          <p className="text-sm text-gray-500">{headers.length} columnas</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToCSV}
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>

      {/* Results Table */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header) => (
                    <TableHead key={header} className="font-semibold">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    {headers.map((header) => (
                      <TableCell key={header} className="font-mono text-sm">
                        {row[header]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </ScrollArea>

      {/* Quick Stats */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{results.length}</p>
            <p className="text-xs text-gray-600">Registros</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{headers.length}</p>
            <p className="text-xs text-gray-600">Campos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
