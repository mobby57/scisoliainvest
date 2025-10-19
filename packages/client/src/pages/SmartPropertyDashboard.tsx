import React, { useEffect, useState } from 'react';
// Adjust the import path to match your monorepo structure; for example:
import { SmartProperty, SensorData } from '@solia/shared/src/types/iot';
// Or, if types are exported from the package entry point:
 // import { SmartProperty, SensorData } from '@solia/shared';
// Or, if the types are in a different location, update accordingly:
// import { SmartProperty, SensorData } from '../../shared/types/iot';

export const SmartPropertyDashboard: React.FC<{ tenantId: string }> = ({ tenantId }) => {
  const [properties, setProperties] = useState<SmartProperty[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [maintenance, setMaintenance] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/api/smart-property?tenantId=${tenantId}`)
      .then(res => res.json())
      .then(setProperties);
  }, [tenantId]);

  useEffect(() => {
    if (!selected) return;
    fetch(`/api/smart-property/${selected}/alerts?tenantId=${tenantId}`)
      .then(res => res.json())
      .then(data => setAlerts(data.alerts || []));
    fetch(`/api/sensor-data/${selected}?tenantId=${tenantId}&limit=20`)
      .then(res => res.json())
      .then(setSensorData);
    fetch(`/api/smart-property/${selected}/maintenance?tenantId=${tenantId}`)
      .then(res => res.json())
      .then(data => setMaintenance(data.needsMaintenance));
  }, [selected, tenantId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Biens connectés</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.map((p) => (
          <div
            key={p._id}
            className={`p-4 border rounded cursor-pointer ${selected === p._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
            onClick={() => setSelected(p._id)}
          >
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-gray-500 text-sm">{p.location}</p>
            <p className="text-gray-400 text-xs">{p.type}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Détails du bien</h2>
          <div className="mb-4">
            <strong>Alertes :</strong>
            {alerts.length > 0 ? (
              <ul className="list-disc ml-6 text-red-600">
                {alerts.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            ) : (
              <span className="text-gray-500 ml-2">Aucune alerte</span>
            )}
          </div>
          <div className="mb-4">
            <strong>Données capteurs :</strong>
            <table className="w-full text-sm mt-2">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Température (°C)</th>
                  <th>Humidité (%)</th>
                </tr>
              </thead>
              <tbody>
                {sensorData.map((d, i) => (
                  <tr key={i}>
                    <td>{new Date(d.timestamp).toLocaleString()}</td>
                    <td>{d.temperature}</td>
                    <td>{d.humidity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <strong>Maintenance :</strong>
            <span className={maintenance ? "text-red-600 ml-2" : "text-green-600 ml-2"}>
              {maintenance ? "Maintenance requise" : "Aucune maintenance nécessaire"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default SmartPropertyDashboard;
