'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cropAPI, getAuthToken } from '@/lib/api';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface Crop {
  id: number;
  name: string;
  type: string;
  diseaseStatus: string;
}

export default function CropsPage() {
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Cereal',
    diseaseStatus: 'Healthy',
  });

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    loadCrops();
  }, [router]);

  const loadCrops = async () => {
    try {
      setLoading(true);
      const data = await cropAPI.listCrops();
      setCrops(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await cropAPI.createCrop(formData);
      setShowForm(false);
      setFormData({ name: '', type: 'Cereal', diseaseStatus: 'Healthy' });
      loadCrops();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette culture ?')) return;
    
    try {
      setLoading(true);
      await cropAPI.deleteCrop(id);
      loadCrops();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Healthy') return 'bg-emerald-100 text-emerald-700';
    if (status.includes('Risk')) return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-700';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'Cereal': '🌾',
      'Vegetable': '🥬',
      'Fruit': '🍎',
      'Legume': '🫘',
      'Oilseed': '🌻',
      'Fiber': '🧵',
    };
    return icons[type] || '🌱';
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-4xl">🌱</span>
              Gestion des Cultures
            </h1>
            <p className="mt-2 text-gray-600">Service SOAP - Gérez vos cultures agricoles</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="lg">
            {showForm ? '✕ Annuler' : '+ Ajouter une culture'}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8 animate-fade-in border-l-4 border-l-emerald-500">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span>🌿</span> Nouvelle Culture
            </h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la culture *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Ex: Winter Wheat, Sweet Corn..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de culture *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="Cereal">🌾 Céréales (Cereal)</option>
                  <option value="Vegetable">🥬 Légumes (Vegetable)</option>
                  <option value="Fruit">🍎 Fruits (Fruit)</option>
                  <option value="Legume">🫘 Légumineuses (Legume)</option>
                  <option value="Oilseed">🌻 Oléagineux (Oilseed)</option>
                  <option value="Fiber">🧵 Fibres (Fiber)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut sanitaire *
                </label>
                <select
                  value={formData.diseaseStatus}
                  onChange={(e) => setFormData({ ...formData, diseaseStatus: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="Healthy">✅ Saine (Healthy)</option>
                  <option value="At Risk">⚠️ À risque (At Risk)</option>
                  <option value="Under Treatment">💊 En traitement (Under Treatment)</option>
                  <option value="Moderate Risk">🟡 Risque modéré (Moderate Risk)</option>
                  <option value="High Risk">🔴 Risque élevé (High Risk)</option>
                  <option value="Unknown">❓ Inconnu (Unknown)</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button type="submit" loading={loading} size="lg" className="w-full">
                  Créer la culture
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Content */}
        {loading && !showForm ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="spinner mx-auto mb-4 w-10 h-10"></div>
              <p className="text-gray-600">Chargement des cultures...</p>
            </div>
          </div>
        ) : crops.length === 0 ? (
          <Card className="text-center py-12">
            <span className="text-6xl mb-4 block">🌱</span>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune culture trouvée</h3>
            <p className="text-gray-500">Ajoutez votre première culture pour commencer !</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map((crop, index) => (
              <Card 
                key={crop.id} 
                hover 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getTypeIcon(crop.type)}</span>
                    <h3 className="text-lg font-bold text-gray-900">{crop.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(crop.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">ID</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{crop.id}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Type</span>
                    <span className="font-medium">{crop.type}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-500 text-sm">Statut</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(crop.diseaseStatus)}`}>
                      {crop.diseaseStatus}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
