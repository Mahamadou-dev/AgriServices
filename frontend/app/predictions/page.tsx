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

  const crops = [
    { value: 'wheat', label: 'Blé', icon: '🌾' },
    { value: 'corn', label: 'Maïs', icon: '🌽' },
    { value: 'rice', label: 'Riz', icon: '🍚' },
    { value: 'soybean', label: 'Soja', icon: '🫘' },
    { value: 'cotton', label: 'Coton', icon: '☁️' },
  ];

  const soils = [
    { value: 'loamy', label: 'Limoneux', icon: '🟤' },
    { value: 'sandy', label: 'Sableux', icon: '🟡' },
    { value: 'clay', label: 'Argileux', icon: '🔴' },
  ];

  return (
    <div className="min-h-screen py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
              📊
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Prédictions Agricoles</h1>
              <p className="text-gray-500">Estimez vos rendements et évaluez les risques</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 inline-flex gap-2 mb-8">
          <button
            onClick={() => { setActiveTab('yield'); setResult(null); }}
            className={`flex items-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'yield'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">🌾</span>
            Prédiction de Rendement
          </button>
          <button
            onClick={() => { setActiveTab('risk'); setResult(null); }}
            className={`flex items-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'risk'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">⚠️</span>
            Évaluation des Risques
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl shadow-sm ${
                activeTab === 'yield' 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                  : 'bg-gradient-to-br from-amber-500 to-orange-600'
              }`}>
                📝
              </div>
              <h2 className="text-xl font-bold text-gray-900">Données d&apos;entrée</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Crop Type */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Type de culture
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {crops.map((crop) => (
                    <button
                      key={crop.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, crop_type: crop.value })}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                        formData.crop_type === crop.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <span className="text-2xl mb-1">{crop.icon}</span>
                      <span className="text-xs font-medium text-gray-700">{crop.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Area */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Surface (hectares)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.area_hectares}
                    onChange={(e) => setFormData({ ...formData, area_hectares: parseFloat(e.target.value) })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Soil Type */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Type de sol
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {soils.map((soil) => (
                    <button
                      key={soil.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, soil_type: soil.value })}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        formData.soil_type === soil.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <span>{soil.icon}</span>
                      <span className="font-medium text-gray-700">{soil.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rainfall & Temperature */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Pluviométrie (mm)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-lg">💧</span>
                    </div>
                    <input
                      type="number"
                      value={formData.rainfall_mm}
                      onChange={(e) => setFormData({ ...formData, rainfall_mm: parseInt(e.target.value) })}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Température (°C)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-lg">🌡️</span>
                    </div>
                    <input
                      type="number"
                      value={formData.temperature_c}
                      onChange={(e) => setFormData({ ...formData, temperature_c: parseInt(e.target.value) })}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Fertilizer */}
              <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  id="fertilizer"
                  checked={formData.fertilizer_used}
                  onChange={(e) => setFormData({ ...formData, fertilizer_used: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="fertilizer" className="ml-3 flex items-center gap-2">
                  <span className="text-lg">🧪</span>
                  <span className="font-medium text-gray-700">Engrais utilisé</span>
                </label>
              </div>

              <Button 
                type="submit" 
                loading={loading} 
                className="w-full py-3.5"
                size="lg"
              >
                {loading 
                  ? 'Calcul en cours...' 
                  : activeTab === 'yield' 
                    ? '🎯 Prédire le rendement' 
                    : '⚠️ Évaluer les risques'
                }
              </Button>
            </form>
          </Card>

          {/* Results */}
          <div>
            {result ? (
              activeTab === 'yield' ? (
                <Card className="animate-slide-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-xl shadow-sm">
                      🎯
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Résultat de la prédiction</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Crop */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <span className="text-3xl">
                        {crops.find(c => c.value === result.crop_type)?.icon || '🌱'}
                      </span>
                      <div>
                        <p className="text-sm text-gray-500">Culture</p>
                        <p className="text-lg font-bold text-gray-900">
                          {crops.find(c => c.value === result.crop_type)?.label || result.crop_type}
                        </p>
                      </div>
                    </div>

                    {/* Yield */}
                    <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
                      <p className="text-sm text-emerald-600 font-medium mb-2">Rendement prédit</p>
                      <p className="text-4xl font-bold text-emerald-700">
                        {result.predicted_yield_kg.toLocaleString()}
                        <span className="text-xl ml-2">kg</span>
                      </p>
                    </div>

                    {/* Confidence */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Niveau de confiance</span>
                        <span className="font-bold text-emerald-600">{(result.confidence_level * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                          style={{ width: `${result.confidence_level * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">💡</span>
                        <div>
                          <p className="font-semibold text-blue-900 mb-1">Recommandation</p>
                          <p className="text-sm text-blue-700">{result.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="animate-slide-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl shadow-sm">
                      ⚠️
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Évaluation des risques</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Crop */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <span className="text-3xl">
                        {crops.find(c => c.value === result.crop_type)?.icon || '🌱'}
                      </span>
                      <div>
                        <p className="text-sm text-gray-500">Culture</p>
                        <p className="text-lg font-bold text-gray-900">
                          {crops.find(c => c.value === result.crop_type)?.label || result.crop_type}
                        </p>
                      </div>
                    </div>

                    {/* Risk Level */}
                    <div className={`text-center p-6 rounded-2xl border-2 ${
                      result.risk_level === 'LOW'
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                        : result.risk_level === 'MEDIUM'
                        ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'
                        : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'
                    }`}>
                      <p className="text-sm font-medium mb-2" style={{
                        color: result.risk_level === 'LOW' ? '#059669' : result.risk_level === 'MEDIUM' ? '#d97706' : '#dc2626'
                      }}>
                        Niveau de risque
                      </p>
                      <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold ${
                        result.risk_level === 'LOW'
                          ? 'bg-green-100 text-green-800'
                          : result.risk_level === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.risk_level === 'LOW' ? '✅ Faible' : result.risk_level === 'MEDIUM' ? '⚠️ Moyen' : '🚨 Élevé'}
                      </span>
                    </div>

                    {/* Risk Factors */}
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                        <span>🔍</span> Facteurs de risque
                      </p>
                      <ul className="space-y-2">
                        {result.risk_factors.map((factor: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-amber-800">
                            <span className="text-amber-500 mt-0.5">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Mitigation Strategies */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <p className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <span>💡</span> Stratégies d&apos;atténuation
                      </p>
                      <ul className="space-y-2">
                        {result.mitigation_strategies.map((strategy: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-blue-800">
                            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {strategy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              )
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center py-16">
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center text-5xl ${
                    activeTab === 'yield' 
                      ? 'bg-gradient-to-br from-emerald-100 to-teal-100' 
                      : 'bg-gradient-to-br from-amber-100 to-orange-100'
                  }`}>
                    {activeTab === 'yield' ? '📊' : '⚠️'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {activeTab === 'yield' ? 'Prêt à prédire' : 'Prêt à évaluer'}
                  </h3>
                  <p className="text-gray-500 max-w-xs mx-auto">
                    Remplissez le formulaire et cliquez sur le bouton pour voir les résultats de votre {activeTab === 'yield' ? 'prédiction' : 'évaluation'}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
