import React from 'react';
import { PageWrapper } from './PageWrapper';
import { Plus, Download } from 'lucide-react';

// Exemple d'utilisation du layout principal
export function DashboardExample() {
  return (
    <PageWrapper
      title="Tableau de bord"
      subtitle="Vue d'ensemble de vos investissements SCI"
      actions={
        <>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau projet
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cartes de statistiques */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Projets actifs</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Investissement total</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">2.4M€</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Rendement moyen</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">8.5%</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Projets récents</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">SCI Résidence {item}</h3>
                  <p className="text-sm text-gray-500">Créé il y a {item} jour(s)</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Actif
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}