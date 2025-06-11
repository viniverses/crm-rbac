'use client';

import { motion } from 'framer-motion';

import { Progress } from '@/components/ui/progress';

export function SalesChart() {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between text-sm"
      >
        <span className="text-gray-600">Janeiro</span>
        <span className="font-medium">R$ 18.500</span>
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ originX: 0 }}
      >
        <Progress value={75} className="h-2" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-between text-sm"
      >
        <span className="text-gray-600">Fevereiro</span>
        <span className="font-medium">R$ 22.300</span>
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{ originX: 0 }}
      >
        <Progress value={90} className="h-2" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex items-center justify-between text-sm"
      >
        <span className="text-gray-600">Março</span>
        <span className="font-medium">R$ 19.800</span>
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        style={{ originX: 0 }}
      >
        <Progress value={80} className="h-2" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="flex items-center justify-between text-sm"
      >
        <span className="text-gray-600">Abril</span>
        <span className="font-medium">R$ 24.500</span>
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        style={{ originX: 0 }}
      >
        <Progress value={100} className="h-2" />
      </motion.div>
    </div>
  );
}
