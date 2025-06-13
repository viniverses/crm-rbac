'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  color: string;
};

const activities: ActivityItem[] = [
  {
    id: '1',
    title: 'Novo contato adicionado',
    description: 'João Silva - há 2 horas',
    color: 'bg-blue-500',
  },
  {
    id: '2',
    title: 'Proposta enviada',
    description: 'Projeto Mobile App - há 4 horas',
    color: 'bg-green-500',
  },
  {
    id: '3',
    title: 'Reunião agendada',
    description: 'Cliente ABC - amanhã 14h',
    color: 'bg-orange-500',
  },
  {
    id: '4',
    title: 'Pagamento recebido',
    description: 'R$ 5.500 - há 1 dia',
    color: 'bg-purple-500',
  },
];

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
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex items-start space-x-3"
          >
            <div className={`mt-2 h-2 w-2 rounded-full ${activity.color}`}></div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-gray-600">{activity.description}</p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
