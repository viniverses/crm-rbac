'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Database, DollarSign, Users } from 'lucide-react';
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type Metric = {
  id: string;
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: {
    value: string;
    percentage: number;
  };
  progress?: number;
};

const metrics: Metric[] = [
  {
    id: '1',
    title: 'Total de Contatos',
    value: '42',
    icon: <Users className="text-muted-foreground h-4 w-4" />,
    change: {
      value: '+12% desde o mês passado',
      percentage: 12,
    },
  },
  {
    id: '2',
    title: 'Receita Mensal',
    value: 'R$ 24.500',
    icon: <DollarSign className="text-muted-foreground h-4 w-4" />,
    change: {
      value: '+8% desde o mês passado',
      percentage: 8,
    },
  },
  {
    id: '3',
    title: 'Usuários Ativos',
    value: '1,248',
    icon: <Users className="text-muted-foreground h-4 w-4" />,
    change: {
      value: '+12% desde o mês passado',
      percentage: 12,
    },
  },
  {
    id: '4',
    title: 'Uso de Armazenamento',
    value: '68%',
    icon: <Database className="text-muted-foreground h-4 w-4" />,
    progress: 68,
  },
];

function CountUp({ value, prefix = '', suffix = '' }: { value: string; prefix?: string; suffix?: string }) {
  const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const displayValue = useTransform(spring, (latest) => {
    if (value.includes('R$')) {
      return `R$ ${latest.toFixed(2).replace('.', ',')}`;
    }
    if (value.includes('%')) {
      return `${latest.toFixed(0)}%`;
    }
    return latest.toFixed(0);
  });

  React.useEffect(() => {
    spring.set(numericValue);
  }, [numericValue, spring]);

  return (
    <motion.span>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </motion.span>
  );
}

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card className="gap-0" key={metric.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="text-2xl font-bold"
            >
              <CountUp value={metric.value} />

              {metric.change && (
                <div className="flex items-center text-xs font-normal text-green-600">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  {metric.change.value}
                </div>
              )}
              {metric.progress && <Progress value={metric.progress} className="mt-2 h-2" />}
            </motion.div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
