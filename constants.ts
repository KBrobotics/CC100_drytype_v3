
export const SIGNAL_NAMES = {
  TEMP_L1: "LV L1 Winding temperature",
  TEMP_L3: "LV L3 Winding temperature",
  ALARM_1: "Temp alarm1",
  ALARM_2: "Temp alarm2",
  TRIP: "Transformer trip",
  ALARM_GEN: "Transformer alarm",
  COOLING_OK: "Cooling bank working",
  COOLING_FAIL: "Cooling bank failure"
} as const;

export const TEMP_THRESHOLDS = {
  WARNING: 100,
  CRITICAL: 130
};

// WebSocket Configuration
// Fallback to localhost if window.location.hostname is empty (e.g., local file testing)
const hostname = window.location.hostname || 'localhost';
export const DEFAULT_WS_URL = `ws://${hostname}:1880/ws/transformer`;
