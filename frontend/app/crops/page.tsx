'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/api';
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


  // Simulation stockage local
  const LOCAL_KEY = 'simulated_crops';

  const loadCrops = () => {
    setLoading(true);
    setTimeout(() => {
      const data = localStorage.getItem(LOCAL_KEY);
      setCrops(data ? JSON.parse(data) : []);
      setLoading(false);
    }, 400); // Simule un délai réseau
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const data = localStorage.getItem(LOCAL_KEY);
      const cropsArr: Crop[] = data ? JSON.parse(data) : [];
      const newCrop: Crop = {
        id: Date.now(),
        name: formData.name,
        type: formData.type,
        diseaseStatus: formData.diseaseStatus,
      };
      cropsArr.push(newCrop);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(cropsArr));
      setShowForm(false);
      setFormData({ name: '', type: 'Cereal', diseaseStatus: 'Healthy' });
      setCrops(cropsArr);
      setLoading(false);
    }, 400);
  };


  const handleDelete = (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette culture ?')) return;
    setLoading(true);
    setTimeout(() => {
      const data = localStorage.getItem(LOCAL_KEY);
      let cropsArr: Crop[] = data ? JSON.parse(data) : [];
      cropsArr = cropsArr.filter(crop => crop.id !== id);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(cropsArr));
      setCrops(cropsArr);
      setLoading(false);
    }, 400);
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
    <div className="min-h-screen py-14 animate-fade-in bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-14">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-4xl shadow-lg">
              🌱
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-emerald-900">Gestion des Cultures</h1>
              <p className="text-gray-500 mt-2 text-lg">Service SOAP - Gérez vos cultures agricoles</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="lg" className="text-lg px-8 py-3">
            {showForm ? '✕ Annuler' : '+ Ajouter une culture'}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-14 animate-fade-in">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-sm">
                🌿
              </div>
              <h2 className="text-2xl font-extrabold text-emerald-900">Nouvelle Culture</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-gray-700">
                    Nom de la culture *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-base"
                    placeholder="Ex: Winter Wheat, Sweet Corn..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-semibold text-gray-700">
                    Type de culture *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-base"
                  >
                    <option value="Cereal">🌾 Céréales (Cereal)</option>
                    <option value="Vegetable">🥬 Légumes (Vegetable)</option>
                    <option value="Fruit">🍎 Fruits (Fruit)</option>
                    <option value="Legume">🫘 Légumineuses (Legume)</option>
                    <option value="Oilseed">🌻 Oléagineux (Oilseed)</option>
                    <option value="Fiber">🧵 Fibres (Fiber)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-semibold text-gray-700">
                    Statut sanitaire *
                  </label>
                  <select
                    value={formData.diseaseStatus}
                    onChange={(e) => setFormData({ ...formData, diseaseStatus: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-base"
                  >
                    <option value="Healthy">✅ Saine (Healthy)</option>
                    <option value="At Risk">⚠️ À risque (At Risk)</option>
                    <option value="Under Treatment">💊 En traitement (Under Treatment)</option>
                    <option value="Moderate Risk">🟡 Risque modéré (Moderate Risk)</option>
                    <option value="High Risk">🔴 Risque élevé (High Risk)</option>
                    <option value="Unknown">❓ Inconnu (Unknown)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)} size="lg">
                  Annuler
                </Button>
                <Button type="submit" loading={loading} size="lg">
                  Créer la culture
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Content */}
        {loading && !showForm ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full border-4 border-emerald-500 border-t-transparent w-16 h-16 mx-auto mb-6"></div>
              <p className="text-gray-600 font-semibold text-lg">Chargement des cultures...</p>
            </div>
          </div>
        ) : crops.length === 0 ? (
          <Card className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center text-6xl">
              🌱
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-900 mb-4">Aucune culture trouvée</h3>
            <p className="text-gray-500 text-lg mb-8">Ajoutez votre première culture pour commencer !</p>
            <Button onClick={() => setShowForm(true)} size="lg">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter une culture
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {crops.map((crop, index) => (
              <Card 
                key={crop.id} 
                hover 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{getTypeIcon(crop.type)}</span>
                    <h3 className="text-xl font-extrabold text-emerald-900">{crop.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(crop.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
                    disabled={loading}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 text-base font-medium">ID</span>
                    <span className="font-mono text-base bg-gray-100 px-3 py-1 rounded-lg">{crop.id}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 text-base font-medium">Type</span>
                    <span className="font-semibold text-lg">{crop.type}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-500 text-base font-medium">Statut</span>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(crop.diseaseStatus)}`}>
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
