'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import { getAuthToken } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">📊 Tableau de bord</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/farmers">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <div className="text-center">
                <div className="text-5xl mb-4">👨‍🌾</div>
                <h3 className="text-xl font-bold mb-2">Agriculteurs</h3>
                <p className="text-gray-600">Gérer les profils des agriculteurs</p>
              </div>
            </Card>
          </Link>

          <Link href="/crops">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <div className="text-center">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="text-xl font-bold mb-2">Cultures</h3>
                <p className="text-gray-600">Gérer les cultures (Service SOAP)</p>
              </div>
            </Card>
          </Link>

          <Link href="/predictions">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">Prédictions</h3>
                <p className="text-gray-600">Prédire le rendement et les risques</p>
              </div>
            </Card>
          </Link>

          <Link href="/billing">
            <Card className="hover:shadow-lg transition cursor-pointer h-full">
              <div className="text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-xl font-bold mb-2">Facturation</h3>
                <p className="text-gray-600">Gérer les factures (Service SOAP)</p>
              </div>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition h-full">
            <div className="text-center">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-2">Statistiques</h3>
              <p className="text-gray-600">Analyser les données</p>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition h-full">
            <div className="text-center">
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold mb-2">Paramètres</h3>
              <p className="text-gray-600">Configurer votre compte</p>
            </div>
          </Card>
        </div>

        <Card title="🎯 Actions rapides">
          <div className="space-y-3">
            <Link
              href="/farmers"
              className="block p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Ajouter un agriculteur</h4>
                  <p className="text-sm text-gray-600">Créer un nouveau profil</p>
                </div>
                <span className="text-2xl">➕</span>
              </div>
            </Link>
            <Link
              href="/crops"
              className="block p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Ajouter une culture</h4>
                  <p className="text-sm text-gray-600">Créer une nouvelle culture</p>
                </div>
                <span className="text-2xl">🌱</span>
              </div>
            </Link>
            <Link
              href="/predictions"
              className="block p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Nouvelle prédiction</h4>
                  <p className="text-sm text-gray-600">Estimer le rendement</p>
                </div>
                <span className="text-2xl">🔮</span>
              </div>
            </Link>
            <Link
              href="/billing"
              className="block p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Générer une facture</h4>
                  <p className="text-sm text-gray-600">Créer une nouvelle facture</p>
                </div>
                <span className="text-2xl">💰</span>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
