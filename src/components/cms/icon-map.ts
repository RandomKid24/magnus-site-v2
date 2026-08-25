import {
  Settings,
  Shield,
  Target,
  Cpu,
  Layers,
  Zap,
  Hammer,
  Scissors,
  Flame,
  Maximize,
  PenTool,
  Box,
  HardHat,
  Truck,
  Wrench,
  Factory,
  RotateCcw,
  Gauge,
  Drill,
  ScanLine,
  Minus,
  CircleDot,
  Cog,
  type LucideIcon,
} from 'lucide-react';

/**
 * CMS block data stores icon names as plain strings; this map resolves them to
 * components at render time. Unknown names fall back to Cog.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  Settings,
  Shield,
  Target,
  Cpu,
  Layers,
  Zap,
  Hammer,
  Scissors,
  Flame,
  Maximize,
  PenTool,
  Box,
  HardHat,
  Truck,
  Wrench,
  Factory,
  RotateCcw,
  Gauge,
  Drill,
  ScanLine,
  Minus,
  CircleDot,
  Cog,
};

export function resolveIcon(name: string | undefined | null): LucideIcon {
  return (name && ICON_MAP[name]) || Cog;
}
