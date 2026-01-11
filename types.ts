
export interface TransformerSignals {
  // Analog
  "LV L1 Winding temperature"?: number;
  "LV L3 Winding temperature"?: number;
  
  // Digital Alarms
  "Temp alarm1"?: boolean;
  "Temp alarm2"?: boolean;
  
  // Digital Inputs
  "Transformer trip"?: boolean;
  "Transformer alarm"?: boolean;
  "Cooling bank working"?: boolean;
  "Cooling bank failure"?: boolean;
}

export enum ConnectionStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING'
}
