// fedcampus-2.0-client-interfaces.ts

export interface HealthDataPoint {
  timestamp: bigint;
  data: { value: number };
}

export interface BloodPressurePoint {
  timestamp: bigint;
  data: { [key: string]: number };
}

export interface SleepDataPoint {
  timestamp: bigint;
  data: { value: bigint };
}

export interface FloatDataPoint {
  timestamp: bigint;
  data: { value: number };
}

export interface IntegerDataPoint {
  timestamp: bigint;
  data: { value: number };
}

export type HealthIntegerDataPoint = IntegerDataPoint; // ← 去掉多余的分号

export interface FedCampusRequest {
  timestamp: bigint;
  "api-type": number;
  pubkey: string;
  data: string;
}

export interface DecryptedHealthData {
  steps?: HealthIntegerDataPoint[];
  flight_climbed?: HealthIntegerDataPoint[];
  sleep_duration?: SleepDataPoint[];
  distances?: FloatDataPoint[];
  active_calories?: FloatDataPoint[];
  exercises?: FloatDataPoint[];
  heart_rate?: FloatDataPoint[];
  stress_level?: FloatDataPoint[];
  irregular_rhythm?: FloatDataPoint[];
  respiratory_rate?: FloatDataPoint[];
  blood_pressure?: BloodPressurePoint[];

  [dataType: string]:
    | HealthIntegerDataPoint[]
    | BloodPressurePoint[]
    | SleepDataPoint[]
    | FloatDataPoint[]
    | undefined;
}

export interface PlatformDataMapping {
  android: {
    steps: string;
    distances: string;
    flight_climbed: string;
    active_calories: string;
    sleep_duration: string;
    heart_rate: string;
    stress_level: string;
  };
  ios: {
    steps: string;
    distances: string;
    active_calories: string;
    sleep_duration: string;
    heart_rate: string;
  };
}
