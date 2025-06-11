import { Activity } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function RecentActivity() {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
            <Activity className="h-4 w-4 text-blue-600" />
          </div>
          <span>Atividade Recente</span>
        </CardTitle>
        <Separator className="my-2 opacity-50" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="mt-2 h-2 w-2 rounded-full bg-blue-500"></div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Novo contato adicionado</p>
            <p className="text-xs text-gray-600">João Silva - há 2 horas</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="mt-2 h-2 w-2 rounded-full bg-green-500"></div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Proposta enviada</p>
            <p className="text-xs text-gray-600">Projeto Mobile App - há 4 horas</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="mt-2 h-2 w-2 rounded-full bg-orange-500"></div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Reunião agendada</p>
            <p className="text-xs text-gray-600">Cliente ABC - amanhã 14h</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="mt-2 h-2 w-2 rounded-full bg-purple-500"></div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Pagamento recebido</p>
            <p className="text-xs text-gray-600">R$ 5.500 - há 1 dia</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
