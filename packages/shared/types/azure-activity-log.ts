export interface AzureActivityLogEntry {
  id: string;
  eventName: string;
  eventTimestamp: string;
  resourceId: string;
  resourceType: string;
  operationName: string;
  status: string;
  caller: string;
  category: string;
  properties?: Record<string, any>;
}
