'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { getAuthToken, farmerAPI } from '@/lib/api';

interface Farmer {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: {
    city?: string;
    country?: string;
  };
}

export default function FarmersPage() {
  const router = useRouter();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: {
      city: '',
      country: '',
    },
  });

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchFarmers();
  }, [router]);

  const fetchFarmers = async () => {
    try {
      const data = await farmerAPI.getAll();
      setFarmers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await farmerAPI.create(formData);
      setShowForm(false);
      setFormData({
        userId: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: { city: '', country: '' },
      });
      fetchFarmers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet agriculteur?')) return;
    try {
      await farmerAPI.delete(id);
      fetchFarmers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">👨‍🌾 Agriculteurs</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annuler' : 'Ajouter un agriculteur'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showForm && (
          <Card title="Nouveau agriculteur" className="mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, city: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays
                  </label>
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, country: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <Button type="submit">Créer</Button>
            </form>
          </Card>
        )}

        {farmers.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600">
              Aucun agriculteur enregistré. Cliquez sur "Ajouter un agriculteur" pour commencer.
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmers.map((farmer) => (
              <Card key={farmer._id}>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">
                    {farmer.firstName} {farmer.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">📞 {farmer.phone}</p>
                  {farmer.address?.city && (
                    <p className="text-sm text-gray-600">
                      📍 {farmer.address.city}, {farmer.address.country}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">User ID: {farmer.userId}</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="secondary" className="flex-1">
                      Modifier
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(farmer._id)}
                      className="flex-1"
                    >
                      Supprimer
                    </Button>
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
