import type { GeminiStats } from "../types";
import { ActivityHeatmap } from "./heatmap";
import { colors, layout, typography, components, space, fontSize, radius } from "./design-tokens";
import { formatNumber, formatCost } from "../utils/format";
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
            paddingLeft: layout.padding.horizontal,
            paddingRight: layout.padding.horizontal,
            paddingTop: layout.padding.top,
            paddingBottom: layout.padding.bottom,
            fontFamily: typography.fontFamily.mono,
            color: colors.text.primary,
            position: "relative",
            overflow: "hidden",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -380,
              right: -280,
              width: 770,
              height: 770,
              backgroundColor: colors.accent.primary,
              opacity: 0.1,
              borderRadius: layout.radius.full,
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -440,
              left: -340,
              width: 880,
              height: 880,
              backgroundColor: colors.accent.secondary,
              opacity: 0.1,
              borderRadius: layout.radius.full,
              display: "flex",
            }}
          />
    
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: space(4) }}>
              <img
                src={GEMINI_LOGO_DATA_URL}
                height={96}
                style={{ display: "flex", objectFit: "contain" }}
              />
              <span style={{ display: "flex", fontSize: fontSize("7xl"), fontWeight: typography.weight.bold, letterSpacing: typography.letterSpacing.tight, color: colors.text.primary }}>
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
                <span style={{ display: "flex", fontWeight: typography.weight.bold, color: colors.accent.primary }}>
                  {stats.periodLabel === "Last 365 Days" ? "365" : stats.periodLabel}
                </span>
              </div>
            </div>
          </div>
    
          {/* Row 1: High Level Stats */}
            <div style={{ display: "flex", width: "100%", gap: space(6), flexDirection: "row", marginTop: space(8) }}>
              {/* Started */}
              <div style={{ ...components.statBox, flex: 1, display: "flex", flexDirection: "column", height: 222, gap: space(4), border: `1px solid ${colors.surfaceBorder}` }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ ...components.sectionHeader, display: "flex" }}>STARTED</div>
                  <div style={{ display: "flex", fontSize: fontSize("xl"), color: colors.text.secondary, marginTop: space(2) }}>
                    {stats.firstSessionDate ? stats.firstSessionDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}
                  </div>
                </div>
                <div style={{ display: "flex", fontSize: fontSize("3xl"), fontWeight: typography.weight.bold, lineHeight: 1 }}>
                  {stats.daysSinceFirstSession} Days Ago
                </div>
              </div>
    
              {/* Most Active Day */}
              <div style={{ ...components.statBox, flex: 0.8, display: "flex", flexDirection: "column", height: 222, gap: space(4), border: `1px solid ${colors.surfaceBorder}` }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ ...components.sectionHeader, display: "flex" }}>MOST ACTIVE DAY</div>
                  <div style={{ display: "flex", fontSize: fontSize("xl"), color: colors.text.secondary, marginTop: space(2) }}>
                    {stats.mostActiveDay?.formattedDate.split(",")[0]}
                  </div>
                </div>
                <div style={{ display: "flex", fontSize: fontSize("3xl"), fontWeight: typography.weight.bold, lineHeight: 1 }}>
                   {stats.mostActiveDay?.formattedDate.split(",")[1]}
                </div>
              </div>
    
               {/* Weekly Activity Chart */}
               <div style={{ ...components.statBox, flex: 1.2, display: "flex", flexDirection: "column", height: 222, border: `1px solid ${colors.surfaceBorder}` }}>
                 <div style={{ ...components.sectionHeader, display: "flex" }}>WEEKLY</div>
                 <div style={{ display: "flex", alignItems: "flex-end", height: 100, gap: space(2), marginTop: space(4), flexDirection: "row" }}>
                   {stats.weekdayActivity.counts.map((count, i) => {
                      const heightPercent = stats.weekdayActivity.maxCount > 0 ? (count / stats.weekdayActivity.maxCount) : 0;
                      const barHeight = Math.max(Math.round(heightPercent * 100), 6);
                      const isMax = i === stats.weekdayActivity.mostActiveDay;
                      const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                      return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                           <div
                             style={{
                               display: "flex",
                               width: "100%",
                               height: `${barHeight}px`,
                               backgroundColor: isMax ? colors.accent.primary : colors.accent.secondary,
                               borderRadius: radius("sm"),
                             }}
                           />
                           <div style={{ display: "flex", fontSize: fontSize("xs"), color: isMax ? colors.accent.primary : colors.text.muted, marginTop: 8 }}>
                             {dayLabels[i]}
                           </div>
                        </div>
                      );
                   })}
                 </div>
               </div>
            </div>
    
            {/* Row 2: Activity Heatmap */}
            <div style={{ display: "flex", width: "100%", marginTop: space(8), flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "100%", maxWidth: layout.content.width, display: "flex", flexDirection: "column" }}>
                  <div style={{ ...components.sectionHeader, marginBottom: space(4), display: "flex" }}>ACTIVITY</div>
                  <ActivityHeatmap dailyActivity={stats.dailyActivity} startDate={stats.startDate} endDate={stats.endDate} />
                </div>
            </div>
    
            {/* Row 3: Models, Languages & Detailed Stats */}
            <div style={{ display: "flex", width: "100%", gap: space(4), marginTop: space(8), flexDirection: "row" }}>
                
                {/* Top Models */}
                <div style={{ ...components.card, flex: 1.2, display: "flex", flexDirection: "column", height: 300, border: `1px solid ${colors.surfaceBorder}`, padding: space(8) }}>
                  <div style={{ ...components.sectionHeader, marginBottom: space(6), display: "flex" }}>TOP MODELS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: space(5) }}>
                     {stats.topModels.slice(0, 3).map((model, i) => (
                       <div key={model.name} style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                         <div style={{ 
                           width: 40, 
                           fontSize: fontSize("2xl"), 
                           fontWeight: typography.weight.bold, 
                           color: colors.accent.primary, 
                           display: "flex",
                           justifyContent: "flex-end",
                           marginRight: space(5)
                         }}>
                           {i + 1}
                         </div>
                         <div style={{ display: "flex", fontSize: fontSize("lg"), fontWeight: typography.weight.medium, flex: 1, color: colors.text.primary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{model.name}</div>
                         <div style={{ display: "flex", fontSize: fontSize("lg"), color: colors.accent.secondary, marginLeft: space(2) }}>{Math.round(model.percentage)}%</div>
                       </div>
                     ))}
                     {stats.topModels.length === 0 && (
                       <div style={{ display: "flex", color: colors.text.muted, fontSize: fontSize("lg") }}>No models detected</div>
                     )}
                  </div>
                </div>

                {/* Top Languages */}
                <div style={{ ...components.card, flex: 0.8, display: "flex", flexDirection: "column", height: 300, border: `1px solid ${colors.surfaceBorder}`, padding: space(8) }}>
                  <div style={{ ...components.sectionHeader, marginBottom: space(6), display: "flex" }}>TOP LANGUAGES</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: space(5) }}>
                     {stats.topLanguages.slice(0, 3).map((lang, i) => (
                       <div key={lang.name} style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                         <div style={{ 
                           width: 40, 
                           fontSize: fontSize("2xl"), 
                           fontWeight: typography.weight.bold, 
                           color: colors.accent.primary, 
                           display: "flex",
                           justifyContent: "flex-end",
                           marginRight: space(5)
                         }}>
                           {i + 1}
                         </div>
                         <div style={{ display: "flex", fontSize: fontSize("lg"), fontWeight: typography.weight.medium, flex: 1, color: colors.text.primary }}>{lang.name}</div>
                         <div style={{ display: "flex", fontSize: fontSize("lg"), color: colors.accent.secondary }}>{Math.round(lang.percentage)}%</div>
                       </div>
                     ))}
                     {stats.topLanguages.length === 0 && (
                       <div style={{ display: "flex", color: colors.text.muted, fontSize: fontSize("lg") }}>No languages detected</div>
                     )}
                  </div>
                </div>
    
                {/* Token Stats */}
                <div style={{ ...components.card, flex: 1.2, display: "flex", flexDirection: "column", height: 300, border: `1px solid ${colors.surfaceBorder}`, padding: space(8) }}>
                  <div style={{ ...components.sectionHeader, marginBottom: space(6), display: "flex" }}>STATS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: space(4) }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
                      <span style={{ display: "flex", color: colors.text.secondary, fontSize: fontSize("lg") }}>Input Tokens</span>
                      <span style={{ display: "flex", fontWeight: typography.weight.bold, color: colors.accent.primary, fontSize: fontSize("lg") }}>{formatter.format(stats.totalInputTokens)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
                      <span style={{ display: "flex", color: colors.text.secondary, fontSize: fontSize("lg") }}>Output Tokens</span>
                      <span style={{ display: "flex", fontWeight: typography.weight.bold, color: colors.accent.primary, fontSize: fontSize("lg") }}>{formatter.format(stats.totalOutputTokens)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
                      <span style={{ display: "flex", color: colors.text.secondary, fontSize: fontSize("lg") }}>Cache Reads</span>
                      <span style={{ display: "flex", fontWeight: typography.weight.bold, color: colors.accent.primary, fontSize: fontSize("lg") }}>{formatter.format(stats.totalCachedTokens)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: space(2), borderTop: `1px solid ${colors.surfaceBorder}`, flexDirection: "row" }}>
                      <span style={{ display: "flex", color: colors.text.secondary, fontSize: fontSize("lg") }}>Tool Calls</span>
                      <span style={{ display: "flex", fontWeight: typography.weight.bold, color: colors.accent.primary, fontSize: fontSize("lg") }}>{formatter.format(stats.totalToolCalls)}</span>
                    </div>
                  </div>
                </div>
    
            </div>
    
            {/* Row 4: Big Stats */}
            <div style={{ display: "flex", width: "100%", gap: space(6), marginTop: space(8), flexDirection: "column" }}>
               <div style={{ display: "flex", gap: space(6), flexDirection: "row" }}>
                 <div style={{ ...components.statBox, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 140, border: `1px solid ${colors.surfaceBorder}` }}>
                    <div style={{ ...components.sectionHeader, display: "flex" }}>SESSIONS</div>
                    <div style={{ display: "flex", fontSize: fontSize("4xl"), fontWeight: typography.weight.bold }}>{formatNumber(stats.totalSessions)}</div>
                 </div>
                 <div style={{ ...components.statBox, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 140, border: `1px solid ${colors.surfaceBorder}` }}>
                    <div style={{ ...components.sectionHeader, display: "flex" }}>MESSAGES</div>
                    <div style={{ display: "flex", fontSize: fontSize("4xl"), fontWeight: typography.weight.bold }}>{formatNumber(stats.totalMessages)}</div>
                 </div>
                 <div style={{ ...components.statBox, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 140, border: `1px solid ${colors.surfaceBorder}` }}>
                    <div style={{ ...components.sectionHeader, display: "flex" }}>TOTAL TOKENS</div>
                    <div style={{ display: "flex", fontSize: fontSize("4xl"), fontWeight: typography.weight.bold }}>{formatNumber(stats.totalTokens)}</div>
                 </div>
               </div>
    
               <div style={{ display: "flex", gap: space(6), flexDirection: "row" }}>
                 <div style={{ ...components.statBox, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 140, border: `1px solid ${colors.surfaceBorder}` }}>
                    <div style={{ ...components.sectionHeader, display: "flex" }}>PROJECTS</div>
                    <div style={{ display: "flex", fontSize: fontSize("4xl"), fontWeight: typography.weight.bold }}>{formatNumber(stats.totalProjects)}</div>
                 </div>
                 <div style={{ ...components.statBox, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 140, border: `1px solid ${colors.surfaceBorder}` }}>
                    <div style={{ ...components.sectionHeader, display: "flex" }}>LONGEST STREAK</div>
                    <div style={{ display: "flex", fontSize: fontSize("4xl"), fontWeight: typography.weight.bold }}>{stats.maxStreak}d</div>
                 </div>
                 {stats.hasUsageCost && (
                    <div style={{ ...components.statBox, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 140, border: `1px solid ${colors.surfaceBorder}` }}>
                       <div style={{ ...components.sectionHeader, display: "flex" }}>ESTIMATED COST</div>
                       <div style={{ display: "flex", fontSize: fontSize("4xl"), fontWeight: typography.weight.bold }}>{formatCost(stats.totalCost)}</div>
                    </div>
                 )}
               </div>
            </div>
    
          <div style={{ display: "flex", justifyContent: "center", flexDirection: "row", marginTop: space(8) }}>
            <div style={{ display: "flex", color: colors.accent.primary, fontSize: fontSize("xl"), fontWeight: typography.weight.medium }}>geminicli.com</div>
          </div>
        </div>
      );
    }
    
