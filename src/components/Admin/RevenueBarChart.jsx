import { formatPrice } from "../../utils/formatPrice";

// Plain SVG bar chart - deliberately dependency-free (no recharts/chart.js)
// so the admin panel doesn't add an install step on top of everything else.
// `data` is [{ label, value }], oldest first.
const RevenueBarChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  const chartHeight = 160;
  const barWidth = 32;
  const gap = 20;
  const width = data.length * (barWidth + gap);

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${Math.max(width, 280)} ${chartHeight + 40}`}
        className="h-48 w-full min-w-[280px]"
      >
        {data.map((d, i) => {
          const barHeight = (d.value / max) * chartHeight;
          const x = i * (barWidth + gap) + gap / 2;
          const y = chartHeight - barHeight;

          return (
            <g key={d.label}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={6}
                className="fill-orange-500"
              />
              <text
                x={x + barWidth / 2}
                y={chartHeight + 18}
                textAnchor="middle"
                className="fill-gray-500 text-[10px] dark:fill-gray-400"
              >
                {d.label}
              </text>
              {d.value > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="fill-gray-700 text-[9px] font-semibold dark:fill-gray-300"
                >
                  {formatPrice(d.value)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default RevenueBarChart;