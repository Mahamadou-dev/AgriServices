'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cropAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
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
    loadCrops();
  }, []);

  const loadCrops = async () => {
    try {
      setLoading(true);
      const data = await cropAPI.listCrops();
      setCrops(data);
    } catch (error) {
      alert('Erreur lors du chargement des cultures');
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
      alert('Culture créée avec succès !');
      setShowForm(false);
      setFormData({ name: '', type: 'Cereal', diseaseStatus: 'Healthy' });
      loadCrops();
    } catch (error) {
      alert('Erreur lors de la création de la culture');
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
      alert('Culture supprimée avec succès !');
      loadCrops();
    } catch (error) {
      alert('Erreur lors de la suppression de la culture');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🌱 Gestion des Cultures</h1>
            <p className="mt-2 text-gray-600">Service SOAP - Gérez vos cultures agricoles</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annuler' : '+ Ajouter une culture'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Nouvelle Culture</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la culture *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Winter Wheat, Sweet Corn..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de culture *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Cereal">Céréales (Cereal)</option>
                  <option value="Vegetable">Légumes (Vegetable)</option>
                  <option value="Fruit">Fruits (Fruit)</option>
                  <option value="Legume">Légumineuses (Legume)</option>
                  <option value="Oilseed">Oléagineux (Oilseed)</option>
                  <option value="Fiber">Fibres (Fiber)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut sanitaire *
                </label>
                <select
                  value={formData.diseaseStatus}
                  onChange={(e) => setFormData({ ...formData, diseaseStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Healthy">Saine (Healthy)</option>
                  <option value="At Risk">À risque (At Risk)</option>
                  <option value="Under Treatment">En traitement (Under Treatment)</option>
                  <option value="Moderate Risk">Risque modéré (Moderate Risk)</option>
                  <option value="High Risk">Risque élevé (High Risk)</option>
                  <option value="Unknown">Inconnu (Unknown)</option>
                </select>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Créer la culture'}
              </Button>
            </form>
          </Card>
        )}

        {loading && !showForm ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Chargement des cultures...</p>
          </div>
        ) : crops.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600 py-8">
              Aucune culture trouvée. Ajoutez votre première culture !
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map((crop) => (
              <Card key={crop.id}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
                  <button
                    onClick={() => handleDelete(crop.id)}
                    className="text-red-600 hover:text-red-800"
                    disabled={loading}
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-gray-600 w-24">ID:</span>
                    <span className="font-medium">{crop.id}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-24">Type:</span>
                    <span className="font-medium">{crop.type}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-24">Statut:</span>
                    <span className={`font-medium ${
                      crop.diseaseStatus === 'Healthy' ? 'text-green-600' :
                      crop.diseaseStatus.includes('Risk') ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
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
