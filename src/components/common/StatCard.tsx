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
  { text: string; glow: string }
> = {
  primary: { text: 'text-teal-300', glow: 'shadow-glow' },
  success: { text: 'text-emerald-300', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.35)]' },
  warning: { text: 'text-amber-300', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.35)]' },
  danger: { text: 'text-rose-300', glow: 'shadow-[0_0_20px_rgba(244,114,182,0.35)]' },
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
    <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl p-6 shadow-glow hover:bg-white/15 transition-all">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">{title}</p>
          <p className="text-4xl font-semibold text-white mt-2">{value}</p>
          {trend && (
            <div
              className={`flex items-center gap-2 mt-2 text-sm ${
                trend.isPositive ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              <span>{trend.isPositive ? '▲' : '▼'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div
          className={`w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center ${colorClass.glow}`}
        >
          <Icon className={`${colorClass.text}`} size={28} />
        </div>
      </div>
    </div>
  );
};

