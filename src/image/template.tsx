import type { GeminiStats } from "../types";
import { ActivityHeatmap } from "./heatmap";
import { colors, layout, typography, components, space, fontSize, radius } from "./design-tokens";
import logo from "../../assets/images/gemini-logo.svg" with { type: "text" };

const GEMINI_LOGO_DATA_URL = `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;

interface WrappedTemplateProps {
  stats: GeminiStats;
}

export function WrappedTemplate({ stats }: WrappedTemplateProps) {
  const formatter = new Intl.NumberFormat("en-US");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: layout.canvas.width,
        height: layout.canvas.height,
        backgroundColor: colors.background,
        padding: `${layout.padding.top}px ${layout.padding.horizontal}px ${layout.padding.bottom}px`,
        fontFamily: typography.fontFamily.mono,
        color: colors.text.primary,
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: space(10),
          flexDirection: "row",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: space(4) }}>
          <img
            src={GEMINI_LOGO_DATA_URL}
            height={72}
            style={{ display: "flex", objectFit: "contain" }}
          />
          <span style={{ display: "flex", fontSize: fontSize("6xl"), fontWeight: typography.weight.bold, letterSpacing: typography.letterSpacing.tight, color: colors.text.primary }}>
            Gemini CLI
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: space(1),
          }}
        >
          <div style={{ fontSize: fontSize("4xl"), color: colors.text.secondary, display: "flex", flexDirection: "row", gap: 12 }}>
            <span style={{ display: "flex" }}>wrapped</span>
            <span style={{ display: "flex", fontWeight: typography.weight.bold, color: colors.accent.primary }}>{stats.year}</span>
          </div>
        </div>
      </div>

      {/* Row 1: High Level Stats */}
        <div style={{ display: "flex", width: "100%", gap: space(6), flexDirection: "row" }}>
          {/* Started */}
          <div style={{ ...components.statBox, flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ ...components.sectionHeader, display: "flex" }}>STARTED</div>
            <div style={{ display: "flex", fontSize: fontSize("2xl"), color: colors.text.secondary, marginTop: space(2) }}>
              {stats.firstSessionDate ? stats.firstSessionDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}
            </div>
            <div style={{ display: "flex", fontSize: fontSize("4xl"), fontWeight: typography.weight.bold, marginTop: space(1) }}>
              {stats.daysSinceFirstSession} Days Ago
            </div>
          </div>

          {/* Most Active Day */}
          <div style={{ ...components.statBox, flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ ...components.sectionHeader, display: "flex" }}>MOST ACTIVE DAY</div>
            <div style={{ display: "flex", fontSize: fontSize("2xl"), color: colors.text.secondary, marginTop: space(2) }}>
              {stats.mostActiveDay?.formattedDate.split(",")[0]}
            </div>
            <div style={{ display: "flex", fontSize: fontSize("4xl"), fontWeight: typography.weight.bold, marginTop: space(1) }}>
               {stats.mostActiveDay?.formattedDate.split(",")[1]}
            </div>
          </div>

           {/* Weekly Activity Chart */}
           <div style={{ ...components.statBox, flex: 1, display: "flex", flexDirection: "column" }}>
             <div style={{ ...components.sectionHeader, display: "flex" }}>WEEKLY</div>
             <div style={{ display: "flex", alignItems: "flex-end", height: "100%", gap: space(2), paddingTop: space(4), flexDirection: "row" }}>
               {stats.weekdayActivity.counts.map((count, i) => {
                  const height = stats.weekdayActivity.maxCount > 0 ? (count / stats.weekdayActivity.maxCount) * 60 : 0;
                  const isMax = i === stats.weekdayActivity.mostActiveDay;
                  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                       <div
                         style={{
                           display: "flex",
                           width: "100%",
                           height: `${Math.max(height, 5)}px`,
                           backgroundColor: isMax ? colors.accent.green : colors.text.muted,
                           borderRadius: radius("sm"),
                           opacity: isMax ? 1 : 0.5,
                         }}
                       />
                       <div style={{ display: "flex", fontSize: fontSize("xs"), color: isMax ? colors.text.primary : colors.text.muted, marginTop: 4 }}>
                         {dayLabels[i]}
                       </div>
                    </div>
                  );
               })}
             </div>
           </div>
        </div>

        {/* Row 2: Activity Heatmap */}
        <div style={{ display: "flex", width: "100%", paddingTop: space(4), flexDirection: "column" }}>
            <div style={{ ...components.sectionHeader, marginBottom: space(4), display: "flex" }}>ACTIVITY</div>
            <ActivityHeatmap dailyActivity={stats.dailyActivity} year={stats.year} maxStreakDays={stats.maxStreakDays} />
        </div>

        {/* Row 3: Models & Detailed Stats */}
        <div style={{ display: "flex", width: "100%", gap: space(6), marginTop: space(4), flexDirection: "row" }}>
            
            {/* Top Models */}
            <div style={{ ...components.card, flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ ...components.sectionHeader, marginBottom: space(6), display: "flex" }}>TOP MODELS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: space(4) }}>
                 {stats.topModels.map((model, i) => (
                   <div key={model.name} style={{ display: "flex", alignItems: "baseline", flexDirection: "row" }}>
                     <div style={{ ...components.ranking, width: components.ranking.numberWidth, color: colors.text.muted, display: "flex" }}>{i + 1}</div>
                     <div style={{ display: "flex", fontSize: fontSize("lg"), fontWeight: typography.weight.medium, flex: 1 }}>{model.name}</div>
                     {i === 0 && <div style={{ display: "flex", fontSize: fontSize("sm"), color: colors.accent.secondary }}>{Math.round(model.percentage)}%</div>}
                   </div>
                 ))}
                 {stats.topModels.length === 0 && (
                   <div style={{ display: "flex", color: colors.text.muted }}>No models detected</div>
                 )}
              </div>
            </div>

            {/* Token Stats */}
            <div style={{ ...components.card, flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ ...components.sectionHeader, marginBottom: space(6), display: "flex" }}>TOKEN USAGE</div>
              <div style={{ display: "flex", flexDirection: "column", gap: space(3) }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
                  <span style={{ display: "flex", color: colors.text.secondary }}>Input Tokens</span>
                  <span style={{ display: "flex", fontWeight: typography.weight.bold }}>{formatter.format(stats.totalInputTokens)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
                  <span style={{ display: "flex", color: colors.text.secondary }}>Output Tokens</span>
                  <span style={{ display: "flex", fontWeight: typography.weight.bold }}>{formatter.format(stats.totalOutputTokens)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
                  <span style={{ display: "flex", color: colors.text.secondary }}>Cached Tokens</span>
                  <span style={{ display: "flex", fontWeight: typography.weight.bold }}>{formatter.format(stats.totalCachedTokens)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: space(2), borderTop: `1px solid ${colors.surfaceBorder}`, flexDirection: "row" }}>
                  <span style={{ display: "flex", color: colors.text.secondary }}>Total Tokens</span>
                  <span style={{ display: "flex", fontWeight: typography.weight.bold, color: colors.accent.primary }}>{formatter.format(stats.totalTokens)}</span>
                </div>
              </div>
            </div>

        </div>

        {/* Row 4: Big Stats */}
        <div style={{ display: "flex", width: "100%", gap: space(6), flexDirection: "row" }}>
           <div style={{ ...components.statBox, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ ...components.sectionHeader, display: "flex" }}>SESSIONS</div>
              <div style={{ display: "flex", fontSize: fontSize("5xl"), fontWeight: typography.weight.bold }}>{formatter.format(stats.totalSessions)}</div>
           </div>
           <div style={{ ...components.statBox, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ ...components.sectionHeader, display: "flex" }}>MESSAGES</div>
              <div style={{ display: "flex", fontSize: fontSize("5xl"), fontWeight: typography.weight.bold }}>{formatter.format(stats.totalMessages)}</div>
           </div>
           <div style={{ ...components.statBox, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ ...components.sectionHeader, display: "flex" }}>PROJECTS</div>
              <div style={{ display: "flex", fontSize: fontSize("5xl"), fontWeight: typography.weight.bold }}>{formatter.format(stats.totalProjects)}</div>
           </div>
           <div style={{ ...components.statBox, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ ...components.sectionHeader, display: "flex" }}>STREAK</div>
              <div style={{ display: "flex", fontSize: fontSize("5xl"), fontWeight: typography.weight.bold }}>{stats.currentStreak}d</div>
           </div>
        </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: space(8), flexDirection: "row" }}>
        <div style={{ display: "flex", color: colors.text.muted, fontSize: fontSize("sm") }}>geminicli.com</div>
      </div>
    </div>
  );
}
