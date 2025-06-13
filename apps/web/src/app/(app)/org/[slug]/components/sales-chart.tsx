'use client';

import { motion } from 'framer-motion';

import { Progress } from '@/components/ui/progress';

type SalesData = {
  id: string;
  month: string;
  value: string;
  progress: number;
};

const salesData: SalesData[] = [
  {
    id: '1',
    month: 'Janeiro',
    value: 'R$ 18.500',
    progress: 75,
  },
  {
    id: '2',
    month: 'Fevereiro',
    value: 'R$ 22.300',
    progress: 90,
  },
  {
    id: '3',
    month: 'Março',
    value: 'R$ 19.800',
    progress: 80,
  },
  {
    id: '4',
    month: 'Abril',
    value: 'R$ 24.500',
    progress: 100,
  },
];

export function SalesChart() {
  return (
    <div className="space-y-4">
      {salesData.map((sale, index) => (
        <div key={sale.id}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-gray-600">{sale.month}</span>
            <span className="font-medium">{sale.value}</span>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: index * 0.2 + 0.2 }}
            style={{ originX: 0 }}
          >
            <Progress value={sale.progress} className="h-2" />
          </motion.div>
        </div>
      ))}
    </div>
  );
}
