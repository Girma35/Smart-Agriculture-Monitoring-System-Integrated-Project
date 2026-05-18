"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  X,
  SlidersHorizontal,
  Plus,
  Settings2,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Battery,
  BatteryLow,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const correlationData = [
  { day: "MON", moisture: 55, humidity: 70, temp: 40 },
  { day: "TUE", moisture: 52, humidity: 65, temp: 38 },
  { day: "WED", moisture: 58, humidity: 75, temp: 42 },
  { day: "THU", moisture: 62, humidity: 80, temp: 45 },
  { day: "FRI", moisture: 68, humidity: 72, temp: 55 },
  { day: "SAT", moisture: 72, humidity: 68, temp: 60 },
  { day: "SUN", moisture: 70, humidity: 63, temp: 58 },
];

const moistureTrend = [30, 35, 40, 45, 55, 60, 65, 68];

const sensorNodes = [
  {
    id: "Node A-12",
    location: "East Ridge Section",
    moisture: "62.4%",
    humidity: "44%",
    temp: "23.8°C",
    battery: 98,
    lastSync: "2m ago",
    status: "ok",
  },
  {
    id: "Node B-04",
    location: "Greenhouse Alpha",
    moisture: "71.1%",
    humidity: "82%",
    temp: "26.2°C",
    battery: 14,
    lastSync: "Just now",
    status: "warning",
  },
];

type Alert = {
  id: string;
  level: "critical" | "warning" | "insight";
  time: string;
  title: string;
  description: string;
  action?: string;
};

const initialAlerts: Alert[] = [
  {
    id: "1",
    level: "critical",
    time: "10:42 AM",
    title: "Critical Dryness Detected",
    description:
      "East Ridge Node A-12 moisture dropped to 12%. Immediate irrigation recommended.",
    action: "Deploy Water Cycle",
  },
  {
    id: "2",
    level: "warning",
    time: "09:15 AM",
    title: "Humidity Spike",
    description:
      "Greenhouse A sensing 85% RH. Activating ventilation sub-systems.",
  },
  {
    id: "3",
    level: "insight",
    time: "08:30 AM",
    title: "Optimal Harvest Window",
    description:
      "Soil and temp profiles suggest perfect sugar levels for Plot C grapes.",
    action: "View Plot Details",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  unit,
  badge,
  badgeColor,
  sub,
  trend,
  highLow,
}: {
  label: string;
  value: string;
  unit: string;
  badge: string;
  badgeColor: "green" | "amber" | "blue";
  sub?: string;
  trend?: number[];
  highLow?: { high: string; low: string };
}) {
  const dotColor =
    badgeColor === "green"
      ? "bg-emerald-400"
      : badgeColor === "amber"
      ? "bg-amber-400"
      : "bg-sky-400";
  const textColor =
    badgeColor === "green"
      ? "text-emerald-400"
      : badgeColor === "amber"
      ? "text-amber-400"
      : "text-sky-400";

  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
          {label}
        </span>
        <span className={cn("flex items-center gap-1.5 text-xs font-semibold", textColor)}>
          <span className={cn("h-2 w-2 rounded-full", dotColor, "shadow-[0_0_5px_currentColor]")} />
          {badge}
        </span>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-4xl font-black text-white leading-none">{value}</span>
        <span className="text-sm text-zinc-400 mb-0.5">{unit}</span>
      </div>

      {trend && (
        <div className="flex items-end gap-0.5 h-8">
          {trend.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-zinc-700 relative overflow-hidden"
              style={{ height: "100%" }}
            >
              <div
                className="absolute bottom-0 inset-x-0 rounded-sm bg-emerald-600 transition-all"
                style={{ height: `${(v / Math.max(...trend)) * 100}%` }}
              />
            </div>
          ))}
        </div>
      )}

      {sub && (
        <p className="text-xs text-zinc-400 flex items-center gap-1">
          <span className="text-zinc-300">→</span> {sub}
        </p>
      )}

      {highLow && (
        <div className="flex gap-4 text-xs">
          <div>
            <p className="text-zinc-600 uppercase tracking-wider text-[10px]">High</p>
            <p className="text-zinc-200 font-semibold">{highLow.high}</p>
          </div>
          <div>
            <p className="text-zinc-600 uppercase tracking-wider text-[10px]">Low</p>
            <p className="text-zinc-200 font-semibold">{highLow.low}</p>
          </div>
        </div>
      )}

      {trend && (
        <p className="text-[10px] text-zinc-600 uppercase tracking-wider -mt-1">
          Last 24h Trend
        </p>
      )}
    </div>
  );
}

function AlertCard({
  alert,
  onDismiss,
}: {
  alert: Alert;
  onDismiss: (id: string) => void;
}) {
  const styles = {
    critical: {
      border: "border-l-red-500",
      bg: "bg-red-950/40",
      badge: "text-red-400",
      dot: "bg-red-500",
      label: "CRITICAL",
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
      btnClass: "bg-emerald-600 hover:bg-emerald-500 text-white",
    },
    warning: {
      border: "border-l-amber-500",
      bg: "bg-amber-950/20",
      badge: "text-amber-400",
      dot: "bg-amber-400",
      label: "WARNING",
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
      btnClass: "border border-zinc-600 text-zinc-300 hover:bg-zinc-700",
    },
    insight: {
      border: "border-l-emerald-500",
      bg: "bg-emerald-950/20",
      badge: "text-emerald-400",
      dot: "bg-emerald-400",
      label: "INSIGHT",
      icon: <Lightbulb className="h-3.5 w-3.5" />,
      btnClass: "border border-emerald-700 text-emerald-400 hover:bg-emerald-900/40",
    },
  };

  const s = styles[alert.level];

  return (
    <div className={cn("rounded-xl border-l-2 p-4 space-y-2", s.border, s.bg)}>
      <div className="flex items-center justify-between">
        <span className={cn("flex items-center gap-1.5 text-[10px] font-bold tracking-widest", s.badge)}>
          {s.icon}
          {s.label} · {alert.time}
        </span>
        <button
          onClick={() => onDismiss(alert.id)}
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="text-sm font-bold text-white">{alert.title}</p>
      <p className="text-xs text-zinc-400 leading-relaxed">{alert.description}</p>
      {alert.action && (
        <Button size="sm" className={cn("w-full text-xs font-semibold mt-1", s.btnClass)}>
          {alert.action}
        </Button>
      )}
    </div>
  );
}

function BatteryIndicator({ value }: { value: number }) {
  const low = value < 20;
  return (
    <span className={cn("flex items-center gap-1 text-xs font-bold", low ? "text-red-400" : "text-emerald-400")}>
      {low ? <BatteryLow className="h-3.5 w-3.5" /> : <Battery className="h-3.5 w-3.5" />}
      {value}%
    </span>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs space-y-1">
      <p className="text-zinc-400 font-semibold">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FieldAnalyticsDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const dismissAlert = (id: string) =>
    setAlerts((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-8 space-y-6">
      {/* ── Page Title ── */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">
          Field Analytics
        </h1>
      </div>

      {/* ── Stat Cards Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Soil Moisture"
          value="68%"
          unit="VWC"
          badge="Optimal"
          badgeColor="green"
          trend={moistureTrend}
        />
        <StatCard
          label="Humidity"
          value="42%"
          unit="RH"
          badge="Stable"
          badgeColor="green"
          sub="±0.4% from avg"
        />
        <StatCard
          label="Temperature"
          value="24°C"
          unit="Ambient"
          badge="Normal"
          badgeColor="green"
          highLow={{ high: "28°C", low: "19°C" }}
        />
      </div>

      {/* ── Main Content: Chart + Alerts ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        {/* Left: Chart + Table */}
        <div className="space-y-6">
          {/* Correlation Chart */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-base font-bold text-white">
                7-Day Correlation Analysis
              </h2>
              <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Moisture
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-sky-400" /> Humidity
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Temp
                </span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={correlationData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="moisture"
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={false}
                  name="Moisture"
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="5 3"
                  name="Humidity"
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#fbbf24"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="3 4"
                  name="Temp"
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-3 rounded-lg bg-zinc-800/60 border border-zinc-700/40 px-4 py-3">
              <p className="text-sm text-zinc-300 leading-relaxed">
                <span className="text-emerald-400 font-semibold italic">Insight: </span>
                High correlation observed between morning humidity spikes and afternoon soil moisture retention.
                Recommended: delay irrigation cycle by 2 hours.
              </p>
            </div>
          </div>

          {/* Sensor Node Fleet */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Sensor Node Fleet</h2>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 text-xs"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filter
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-zinc-600 uppercase tracking-widest border-b border-zinc-800">
                    {["Node ID", "Moisture", "Humidity", "Temp", "Battery", "Last Sync"].map((h) => (
                      <th key={h} className="text-left pb-3 pr-4 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sensorNodes.map((node, i) => (
                    <tr
                      key={node.id}
                      className={cn(
                        "border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors",
                        i === sensorNodes.length - 1 && "border-b-0"
                      )}
                    >
                      <td className="py-4 pr-4">
                        <p className="text-emerald-400 font-bold">{node.id}</p>
                        <p className="text-xs text-zinc-500">{node.location}</p>
                      </td>
                      <td className="py-4 pr-4 text-zinc-200">{node.moisture}</td>
                      <td className="py-4 pr-4 text-zinc-200">{node.humidity}</td>
                      <td className="py-4 pr-4 text-zinc-200">{node.temp}</td>
                      <td className="py-4 pr-4">
                        <BatteryIndicator value={node.battery} />
                      </td>
                      <td className="py-4 text-zinc-400 text-xs">{node.lastSync}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Alerts + Map */}
        <div className="space-y-4">
          {/* Alerts Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Automated Alerts</h2>
            </div>
            <button className="h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center transition-colors shadow-[0_0_12px_#10b98166]">
              <Plus className="h-4 w-4 text-white" />
            </button>
          </div>

          {/* Alert Cards */}
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">All clear — no active alerts</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} onDismiss={dismissAlert} />
              ))
            )}
          </div>

          {/* Spatial Awareness Map */}
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase mb-2">
              Spatial Awareness
            </p>
            <div className="rounded-xl overflow-hidden border border-zinc-800 relative h-36">
              {/* Simulated satellite map */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 60%, #1a2e1a 0%, #0f1f0f 40%, #0a1408 100%)",
                }}
              />
              {/* Field grid overlay */}
              <svg
                className="absolute inset-0 opacity-20"
                viewBox="0 0 340 144"
                preserveAspectRatio="none"
              >
                {[0, 60, 120, 180, 240, 300].map((x) => (
                  <line key={x} x1={x} y1="0" x2={x} y2="144" stroke="#4ade80" strokeWidth="0.5" />
                ))}
                {[0, 36, 72, 108].map((y) => (
                  <line key={y} x1="0" y1={y} x2="340" y2={y} stroke="#4ade80" strokeWidth="0.5" />
                ))}
                <path d="M0 80 Q80 40 160 70 T340 50" stroke="#22c55e" strokeWidth="1.5" fill="none" opacity="0.5" />
              </svg>

              {/* Node Marker */}
              <div className="absolute" style={{ top: "42%", left: "38%" }}>
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-[9px] text-zinc-300 px-1.5 py-0.5 rounded font-mono">
                    NODE A-12
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}