import React from 'react';
import { Goal, Target, Percent, Shield } from 'lucide-react';

interface Props {
  title: string;
  value: string;
  type: 'goals' | 'percentage';
}

export function StatsCard({ title, value, type }: Props) {
  const Icon = type === 'goals' ? Goal : Percent;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Icon className="w-5 h-5 text-blue-500" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}