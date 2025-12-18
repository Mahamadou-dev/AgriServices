'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { getAuthToken, predictionAPI } from '@/lib/api';

export default function PredictionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'yield' | 'risk'>('yield');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    crop_type: 'wheat',
    area_hectares: 10,
    soil_type: 'loamy',
    rainfall_mm: 500,
    temperature_c: 25,
    fertilizer_used: true,
  });

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      let data;
      if (activeTab === 'yield') {
        data = await predictionAPI.predictYield(formData);
      } else {
        data = await predictionAPI.assessRisk(formData);
      }
      setResult(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">📊 Prédictions Agricoles</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('yield')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
              activeTab === 'yield'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🌾 Prédiction de Rendement
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
              activeTab === 'risk'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ⚠️ Évaluation des Risques
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Données d'entrée">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de culture
                </label>
                <select
                  value={formData.crop_type}
                  onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="wheat">Blé</option>
                  <option value="corn">Maïs</option>
                  <option value="rice">Riz</option>
                  <option value="soybean">Soja</option>
                  <option value="cotton">Coton</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Surface (hectares)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.area_hectares}
                  onChange={(e) => setFormData({ ...formData, area_hectares: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de sol
                </label>
                <select
                  value={formData.soil_type}
                  onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="loamy">Limoneux</option>
                  <option value="sandy">Sableux</option>
                  <option value="clay">Argileux</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pluviométrie (mm)
                </label>
                <input
                  type="number"
                  value={formData.rainfall_mm}
                  onChange={(e) => setFormData({ ...formData, rainfall_mm: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Température (°C)
                </label>
                <input
                  type="number"
                  value={formData.temperature_c}
                  onChange={(e) => setFormData({ ...formData, temperature_c: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fertilizer"
                  checked={formData.fertilizer_used}
                  onChange={(e) => setFormData({ ...formData, fertilizer_used: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="fertilizer" className="text-sm font-medium text-gray-700">
                  Engrais utilisé
                </label>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Calcul en cours...' : activeTab === 'yield' ? 'Prédire le rendement' : 'Évaluer les risques'}
              </Button>
            </form>
          </Card>

          <div>
            {result ? (
              activeTab === 'yield' ? (
                <Card title="🎯 Résultat de la prédiction">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Culture</p>
                      <p className="text-lg font-bold">{result.crop_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rendement prédit</p>
                      <p className="text-2xl font-bold text-green-600">
                        {result.predicted_yield_kg.toLocaleString()} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Niveau de confiance</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-green-600 h-4 rounded-full"
                            style={{ width: `${result.confidence_level * 100}%` }}
                          />
                        </div>
                        <span className="font-bold">{(result.confidence_level * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-blue-900">💡 Recommandation</p>
                      <p className="text-sm text-blue-800 mt-1">{result.recommendation}</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card title="⚠️ Évaluation des risques">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Culture</p>
                      <p className="text-lg font-bold">{result.crop_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Niveau de risque</p>
                      <span
                        className={`inline-block px-4 py-2 rounded-full font-bold ${
                          result.risk_level === 'LOW'
                            ? 'bg-green-100 text-green-800'
                            : result.risk_level === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {result.risk_level === 'LOW' ? '✅ Faible' : result.risk_level === 'MEDIUM' ? '⚠️ Moyen' : '🚨 Élevé'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Facteurs de risque</p>
                      <ul className="space-y-1">
                        {result.risk_factors.map((factor: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-600">• {factor}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-blue-900 mb-2">💡 Stratégies d'atténuation</p>
                      <ul className="space-y-1">
                        {result.mitigation_strategies.map((strategy: string, idx: number) => (
                          <li key={idx} className="text-sm text-blue-800">✓ {strategy}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              )
            ) : (
              <Card>
                <div className="text-center py-12 text-gray-500">
                  <div className="text-5xl mb-4">📊</div>
                  <p>Remplissez le formulaire et cliquez sur le bouton pour voir les résultats</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
