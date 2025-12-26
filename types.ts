
export interface VehicleData {
  speed: number;
  battery: number;
  tyrePressure: [number, number, number, number];
  steeringAngle: number;
  throttle: number;
  brake: number;
  evRange: number;
  gearPosition: number;
  temperature: number;
  timestamp: string;
}

export type VehicleVariant = 'SEDAN_BEV' | 'TRUCK_HEAVY' | 'SPORTS_PHEV';

export interface OtaState {
  status: 'IDLE' | 'DOWNLOADING' | 'INSTALLING' | 'REBOOTING';
  progress: number;
  version: string;
}

export interface Fault {
  id: string;
  system: string;
  severity: 'CRITICAL' | 'WARNING';
  description: string;
  timestamp: string;
}

export interface TraceLink {
  reqId: string;
  reqText: string;
  codeSymbol: string;
  testId: string;
  status: 'VERIFIED' | 'PENDING';
}

export interface AIInsight {
  type: 'EFFICIENCY' | 'SAFETY' | 'PREDICTION';
  message: string;
  impact: string;
}

export enum ActiveTab {
  DASHBOARD = 'dashboard',
  REQUIREMENTS = 'requirements',
  CODE = 'code',
  TESTING = 'testing',
  ANALYTICS = 'analytics'
}

export interface CompilationResult {
  status: 'compiling' | 'success' | 'failed';
  message: string;
  errors?: string[];
  warnings?: string[];
  stats?: {
    linesOfCode: number;
    functions: number;
    classes: number;
  };
}
