import { generateWeeksForYear, getIntensityLevel } from "../utils/dates";
import { colors, typography, spacing, components, HEATMAP_COLORS, STREAK_COLORS, layout } from "./design-tokens";

interface HeatmapProps {
  dailyActivity: Map<string, number>;
  year: number;
  maxStreakDays?: Set<string>;
}

interface MonthLabel {
  month: number;
  x: number;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CELL_SIZE = components.heatmapCell.size;
const CELL_GAP = components.heatmapCell.gap;
const CELL_RADIUS = components.heatmapCell.borderRadius;

const LEGEND_CELL_SIZE = components.legend.cellSize;
const LEGEND_GAP = components.legend.gap;

export function ActivityHeatmap({ dailyActivity, year, maxStreakDays }: HeatmapProps) {
  const weeks = generateWeeksForYear(year);

  const counts = Array.from(dailyActivity.values());
  const maxCount = counts.length > 0 ? Math.max(...counts) : 0;

  const monthLabels = getMonthLabels(weeks, CELL_SIZE, CELL_GAP);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing[2],
      }}
    >
      <MonthLabelsRow labels={monthLabels} />
      <HeatmapGrid weeks={weeks} dailyActivity={dailyActivity} maxStreakDays={maxStreakDays} maxCount={maxCount} />
      <HeatmapLegend />
    </div>
  );
}

function MonthLabelsRow({ labels }: { labels: MonthLabel[] }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        position: "relative",
        height: 20,
        marginBottom: spacing[1],
      }}
    >
      {labels.map(({ month, x }) => (
        <div
          key={`${month}-${x}`}
          style={{
            display: "flex",
            position: "absolute",
            left: x,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.medium,
            color: colors.text.tertiary,
            fontFamily: typography.fontFamily.mono,
          }}
        >
          {MONTHS[month]}
        </div>
      ))}
    </div>
  );
}

interface HeatmapGridProps {
  weeks: (string | null)[][];
  dailyActivity: Map<string, number>;
  maxStreakDays?: Set<string>;
  maxCount: number;
}

function HeatmapGrid({ weeks, dailyActivity, maxStreakDays, maxCount }: HeatmapGridProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: CELL_GAP,
      }}
    >
      {weeks.map((week, weekIndex) => (
        <WeekColumn key={weekIndex} week={week} dailyActivity={dailyActivity} maxStreakDays={maxStreakDays} maxCount={maxCount} />
      ))}
    </div>
  );
}

interface WeekColumnProps {
  week: (string | null)[];
  dailyActivity: Map<string, number>;
  maxStreakDays?: Set<string>;
  maxCount: number;
}

function WeekColumn({ week, dailyActivity, maxStreakDays, maxCount }: WeekColumnProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: CELL_GAP,
      }}
    >
      {week.map((dateStr, dayIndex) => (
        <DayCell key={dayIndex} dateStr={dateStr} dailyActivity={dailyActivity} maxStreakDays={maxStreakDays} maxCount={maxCount} />
      ))}
    </div>
  );
}

interface DayCellProps {
  dateStr: string | null;
  dailyActivity: Map<string, number>;
  maxStreakDays?: Set<string>;
  maxCount: number;
}

function DayCell({ dateStr, dailyActivity, maxStreakDays, maxCount }: DayCellProps) {
  const count = dateStr ? dailyActivity.get(dateStr) || 0 : 0;
  const intensity = getIntensityLevel(count, maxCount) as keyof typeof HEATMAP_COLORS;
  const isStreakDay = dateStr && maxStreakDays?.has(dateStr);
  const colorPalette = isStreakDay ? STREAK_COLORS : HEATMAP_COLORS;
  // @ts-ignore
  const color = colorPalette[intensity];

  return (
    <div
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: dateStr ? color : "transparent",
        borderRadius: CELL_RADIUS,
        display: "flex",
      }}
    />
  );
}

function HeatmapLegend() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: spacing[2],
        marginTop: spacing[3],
      }}
    >
      <span
        style={{
          display: "flex",
          fontSize: components.legend.fontSize,
          fontWeight: typography.weight.medium,
          color: components.legend.color,
          fontFamily: typography.fontFamily.mono,
        }}
      >
        Less
      </span>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: LEGEND_GAP,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((intensity) => (
          <div
            key={intensity}
            style={{
              display: "flex",
              width: LEGEND_CELL_SIZE,
              height: LEGEND_CELL_SIZE,
              // @ts-ignore
              backgroundColor: HEATMAP_COLORS[intensity],
              borderRadius: 3,
            }}
          />
        ))}
      </div>

      <span
        style={{
          display: "flex",
          fontSize: components.legend.fontSize,
          fontWeight: typography.weight.medium,
          color: components.legend.color,
          fontFamily: typography.fontFamily.mono,
        }}
      >
        More
      </span>
    </div>
  );
}

function getMonthLabels(weeks: (string | null)[][], cellSize: number, gap: number): MonthLabel[] {
  const labels: MonthLabel[] = [];
  let lastMonth = -1;

  for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
    const week = weeks[weekIndex];

    for (const dateStr of week) {
      if (dateStr) {
        const month = parseInt(dateStr.split("-")[1], 10) - 1;

        if (month !== lastMonth) {
          labels.push({
            month,
            x: weekIndex * (cellSize + gap),
          });
          lastMonth = month;
        }
        break;
      }
    }
  }

  return labels;
}