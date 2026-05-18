"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Camera,
  ZoomIn,
  Grid3x3,
  Info,
  Plus,
  FileText,
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  Droplets,
  Activity,
  Cpu,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScanHistoryItem {
  id: string;
  thumbnail: string;
  selected?: boolean;
}

interface DiagnosticFinding {
  id: string;
  status: "critical" | "ok" | "warning";
  title: string;
  description: string;
}

interface TreatmentStep {
  step: number;
  title: string;
  description: string;
  active?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function VitalityMeter({ value }: { value: number }) {
  const segments = 3;
  const filled = Math.round((value / 100) * segments);

  return (
    <div className="flex gap-1.5 mt-2">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-all duration-700",
            i < filled ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-zinc-700"
          )}
        />
      ))}
    </div>
  );
}

function FindingRow({ finding }: { finding: DiagnosticFinding }) {
  const dot =
    finding.status === "critical"
      ? "bg-red-500 shadow-[0_0_6px_#ef4444]"
      : finding.status === "warning"
      ? "bg-amber-400 shadow-[0_0_6px_#fbbf24]"
      : "bg-emerald-400 shadow-[0_0_6px_#34d399]";

  return (
    <div className="flex items-start gap-3 py-1">
      <span className={cn("mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0", dot)} />
      <div>
        <p className="text-sm font-semibold text-zinc-100">{finding.title}</p>
        <p className="text-xs text-zinc-400 leading-relaxed">{finding.description}</p>
      </div>
    </div>
  );
}

function TreatmentCard({ step }: { step: TreatmentStep }) {
  return (
    <div
      className={cn(
        "rounded-lg p-4 border-l-2 transition-all",
        step.active
          ? "bg-zinc-800/80 border-l-emerald-500"
          : "bg-zinc-800/40 border-l-zinc-700"
      )}
    >
      <p className="text-sm font-semibold text-zinc-100">{step.title}</p>
      <p className={cn("text-xs mt-0.5 leading-relaxed", step.active ? "text-emerald-400 italic" : "text-zinc-400")}>
        {step.description}
      </p>
    </div>
  );
}

function ThumbnailCard({
  item,
  isEmpty,
}: {
  item?: ScanHistoryItem;
  isEmpty?: boolean;
}) {
  if (isEmpty) {
    return (
      <button className="h-16 w-24 rounded-lg border border-dashed border-zinc-600 flex items-center justify-center hover:border-emerald-500 transition-colors group">
        <Plus className="h-5 w-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "relative h-16 w-24 rounded-lg overflow-hidden cursor-pointer ring-2 transition-all",
        item?.selected
          ? "ring-emerald-500 shadow-[0_0_12px_#10b981aa]"
          : "ring-transparent hover:ring-zinc-500"
      )}
    >
      <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
        <div className="text-zinc-500 text-xs">IMG</div>
      </div>
      {item?.selected && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AIDiagnosticPage() {
  const [activeCamera, setActiveCamera] = useState(false);
  const [scanProgress] = useState(78);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (!activeCamera) {
      stopCamera();
      return;
    }

    setCameraError(null);
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      })
      .catch(() => {
        setCameraError("Camera access denied or unavailable.");
        setActiveCamera(false);
      });
  }, [activeCamera]);

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const handleUploadClick = () => {
    setActiveCamera(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setSelectedImage(URL.createObjectURL(file));
    event.target.value = "";
  };

  const handleToggleCamera = () => {
    setSelectedImage(null);
    setActiveCamera((prev) => !prev);
  };

  const findings: DiagnosticFinding[] = [
    {
      id: "1",
      status: "critical",
      title: "Septoria Brown Spot detected",
      description:
        "Neural analysis indicates early stage fungal infection. Confidence level: 98.4%.",
    },
    {
      id: "2",
      status: "ok",
      title: "Nutrient Levels Optimized",
      description:
        "Chlorophyll density remains within healthy standard deviation.",
    },
  ];

  const treatments: TreatmentStep[] = [
    {
      step: 1,
      title: "Step 1: Fungicide Application",
      description: "Targeted spray of copper-based solution within 48 hours.",
      active: true,
    },
    {
      step: 2,
      title: "Step 2: Hydration Adjustment",
      description: "Reduce evening irrigation to limit leaf moisture duration.",
      active: false,
    },
  ];

  const thumbnails: ScanHistoryItem[] = [
    { id: "1", thumbnail: "", selected: true },
    { id: "2", thumbnail: "" },
    { id: "3", thumbnail: "" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 md:p-8">
      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Image Analysis
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Upload or capture high-resolution crop imagery for deep neural
          processing.
        </p>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        {/* ── Left Column: Upload + Preview ── */}
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {/* Upload / Camera Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700 hover:text-white"
              onClick={handleUploadClick}
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
            <Button
              className={cn(
                "flex-1 sm:flex-none gap-2 transition-all",
                activeCamera
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_#10b98166]"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              )}
              onClick={handleToggleCamera}
            >
              <Camera className="h-4 w-4" />
              {activeCamera ? "Stop Camera" : "Active Camera"}
            </Button>
          </div>

          {/* Camera Preview */}
          <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 min-h-[320px] md:min-h-[400px]">
            <div className="absolute inset-0">
              {activeCamera ? (
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                />
              ) : selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Uploaded crop"
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at 40% 50%, #1a3a1a 0%, #0d1f0d 60%, #0a1208 100%)",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="w-64 h-48 rounded-[60%_40%_55%_45%/40%_60%_40%_60%] bg-emerald-900 blur-sm rotate-12" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="w-80 h-56 rounded-[50%_50%_60%_40%/60%_40%_60%_40%] bg-emerald-800 blur-md -rotate-6" />
                  </div>
                </>
              )}
            </div>

            {cameraError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <p className="text-sm text-red-300">{cameraError}</p>
              </div>
            ) : null}

            {/* Scan overlay box */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative border-2 border-emerald-400/80 rounded-md w-56 h-40 shadow-[0_0_20px_#34d39966]">
                {/* Corner accents */}
                <span className="absolute -top-0.5 -left-0.5 h-4 w-4 border-t-2 border-l-2 border-emerald-400 rounded-tl-sm" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 border-t-2 border-r-2 border-emerald-400 rounded-tr-sm" />
                <span className="absolute -bottom-0.5 -left-0.5 h-4 w-4 border-b-2 border-l-2 border-emerald-400 rounded-bl-sm" />
                <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 border-b-2 border-r-2 border-emerald-400 rounded-br-sm" />

                {/* Scan label */}
                <div className="absolute -top-8 left-0 bg-emerald-500/90 text-white text-xs font-bold px-3 py-1 rounded backdrop-blur-sm">
                  SCANNING: SEPTORIA<br />BROWN SPOT DETECTED
                </div>

                {/* Scan line animation */}
                <div className="absolute inset-x-0 h-0.5 bg-emerald-400/60 animate-[scanline_2s_ease-in-out_infinite] shadow-[0_0_8px_#34d399]" />
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-sm px-4 py-3 flex items-center gap-6">
              <div className="flex-1">
                <p className="text-xs text-zinc-400 mb-1">Exposure</p>
                <div className="h-1 w-28 rounded-full bg-zinc-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{ width: "55%" }}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Focus Mode</p>
                <p className="text-sm font-semibold text-white">Auto Macro</p>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <button className="p-1.5 rounded-full hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white">
                  <ZoomIn className="h-5 w-5" />
                </button>
                <button className="p-1.5 rounded-full hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white">
                  <Grid3x3 className="h-5 w-5" />
                </button>
                <button className="p-1.5 rounded-full hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white">
                  <Info className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Uploads */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-3">
              Recent Uploads
            </p>
            <div className="flex gap-3">
              {thumbnails.map((item) => (
                <ThumbnailCard key={item.id} item={item} />
              ))}
              <ThumbnailCard isEmpty />
            </div>
          </div>
        </div>

        {/* ── Right Column: Diagnostic Results ── */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 space-y-5 h-fit">
          <h2 className="text-lg font-bold tracking-tight text-white">
            Diagnostic Results
          </h2>

          {/* Vitality Index Card */}
          <div className="rounded-xl bg-zinc-800/60 border border-zinc-700/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
                Vitality Index
              </span>
              <Badge
                variant="destructive"
                className="text-xs bg-red-900/60 text-red-300 border border-red-700/50 hover:bg-red-900/60"
              >
                Action Required
              </Badge>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black text-emerald-400 leading-none">
                64%
              </span>
              <span className="text-sm text-zinc-400 mb-1">
                Critical Threshold
              </span>
            </div>
            <VitalityMeter value={64} />
          </div>

          <Separator className="bg-zinc-800" />

          {/* Findings */}
          <div className="space-y-3">
            {findings.map((f) => (
              <FindingRow key={f.id} finding={f} />
            ))}
          </div>

          <Separator className="bg-zinc-800" />

          {/* Treatment Protocol */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical className="h-4 w-4 text-amber-400" />
              <p className="text-sm font-bold text-zinc-100">
                Treatment Protocol
              </p>
            </div>
            <div className="space-y-2">
              {treatments.map((t) => (
                <TreatmentCard key={t.step} step={t} />
              ))}
            </div>
          </div>

          <Separator className="bg-zinc-800" />

          {/* System Telemetry */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold tracking-widest text-zinc-600 uppercase">
                System Telemetry
              </p>
              <Cpu className="h-3.5 w-3.5 text-zinc-600" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-zinc-800/40 rounded-lg p-2.5">
                <p className="text-zinc-600 uppercase tracking-wider text-[10px] mb-0.5">
                  Model
                </p>
                <p className="text-zinc-300 font-mono font-semibold">
                  AGRI-PRO-V4.2
                </p>
              </div>
              <div className="bg-zinc-800/40 rounded-lg p-2.5">
                <p className="text-zinc-600 uppercase tracking-wider text-[10px] mb-0.5">
                  GPU Load
                </p>
                <p className="text-zinc-300 font-mono font-semibold">24%</p>
              </div>
              <div className="bg-zinc-800/40 rounded-lg p-2.5">
                <p className="text-zinc-600 uppercase tracking-wider text-[10px] mb-0.5">
                  Latency
                </p>
                <p className="text-zinc-300 font-mono font-semibold">142ms</p>
              </div>
            </div>
          </div>

          {/* Generate Report CTA */}
          <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-[0_0_24px_#10b98133] hover:shadow-[0_0_32px_#10b98155] transition-all">
            <FileText className="h-4 w-4" />
            Generate Full Report
          </Button>
        </div>
      </div>

      {/* ── Scan line keyframe (injected via style tag) ── */}
      <style>{`
        @keyframes scanline {
          0%   { top: 10%; }
          50%  { top: 85%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  );
}