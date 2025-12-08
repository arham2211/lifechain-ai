import React from 'react';
import type { LucideProps } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<LucideProps>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

const colorClasses: Record<
  NonNullable<StatCardProps['color']>,
  { bg: string; text: string }
> = {
  primary: { bg: 'bg-gradient-to-br from-primary-500 to-secondary-500', text: 'text-white' },
  success: { bg: 'bg-gradient-to-br from-emerald-500 to-teal-500', text: 'text-white' },
  warning: { bg: 'bg-gradient-to-br from-amber-500 to-orange-500', text: 'text-white' },
  danger: { bg: 'bg-gradient-to-br from-rose-500 to-pink-500', text: 'text-white' },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
}) => {
  const colorClass = colorClasses[color];

  return (
    <div className="glass-card rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">{title}</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{value}</p>
          {trend && (
            <div
              className={`flex items-center gap-2 mt-2 text-sm font-medium ${
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              <span>{trend.isPositive ? '▲' : '▼'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div
          className={`w-14 h-14 rounded-2xl ${colorClass.bg} flex items-center justify-center shadow-lg shadow-primary-500/20`}
        >
          <Icon className={colorClass.text} size={28} />
        </div>
      </div>
    </div>
  );
};

