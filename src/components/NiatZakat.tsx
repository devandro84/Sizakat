import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui';
import { ChevronRight } from 'lucide-react';

const NiatZakat = () => {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      onClick={() => navigate('/niat-zakat')}
    >
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <span className="text-2xl text-green-600 dark:text-green-300">🤲</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Niat & Ijab Kabul Zakat</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Panduan niat dan ijab kabul dalam berzakat</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </CardContent>
    </Card>
  );
};

export default NiatZakat;