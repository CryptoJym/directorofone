interface MetricCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  icon?: string;
  trend?: {
    value: number;
    suffix?: string;
  } | null;
  trendLabel?: string;
}

export default function MetricCard({
  title,
  value,
  suffix = '',
  icon,
  trend,
  trendLabel
}: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              {value}{suffix}
            </span>
          </div>
          {trend && (
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                {trendLabel || 'Trend'}: 
              </span>
              <span className={`text-sm font-medium ml-1 ${
                trend.value > 50 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {trend.value.toFixed(1)}{trend.suffix || ''}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-3xl ml-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}