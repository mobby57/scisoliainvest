export const telemetry = {
  track: (event: string, data?: any) => {
    console.log(`[TELEMETRY] ${event}`, data);
  }
};