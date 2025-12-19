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

  const modules = [
    {
      href: '/farmers',
      icon: '👨‍🌾',
      title: 'Agriculteurs',
      desc: 'Gérer les profils des agriculteurs',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
    },
    {
      href: '/crops',
      icon: '🌱',
      title: 'Cultures',
      desc: 'Gérer les cultures (Service SOAP)',
      color: 'from-green-500 to-lime-500',
      bgColor: 'bg-green-50',
    },
    {
      href: '/predictions',
      icon: '📊',
      title: 'Prédictions',
      desc: 'Prédire le rendement et les risques',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
    {
      href: '/billing',
      icon: '💰',
      title: 'Facturation',
      desc: 'Gérer les factures (Service SOAP)',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
    },
    {
      href: '#',
      icon: '📈',
      title: 'Statistiques',
      desc: 'Analyser les données',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      disabled: true,
    },
    {
      href: '#',
      icon: '⚙️',
      title: 'Paramètres',
      desc: 'Configurer votre compte',
      color: 'from-gray-500 to-slate-500',
      bgColor: 'bg-gray-50',
      disabled: true,
    },
  ];

  const quickActions = [
    { href: '/farmers', icon: '➕', title: 'Ajouter un agriculteur', desc: 'Créer un nouveau profil', color: 'text-emerald-600' },
    { href: '/crops', icon: '🌱', title: 'Ajouter une culture', desc: 'Créer une nouvelle culture', color: 'text-green-600' },
    { href: '/predictions', icon: '🔮', title: 'Nouvelle prédiction', desc: 'Estimer le rendement', color: 'text-purple-600' },
    { href: '/billing', icon: '💰', title: 'Générer une facture', desc: 'Créer une nouvelle facture', color: 'text-amber-600' },
  ];

  return (
    <div className="min-h-screen py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
              📊
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-500">Bienvenue sur AgriServices</p>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Agriculteurs', value: '—', icon: '👨‍🌾', color: 'bg-emerald-500' },
            { label: 'Cultures', value: '—', icon: '🌱', color: 'bg-green-500' },
            { label: 'Prédictions', value: '—', icon: '📊', color: 'bg-purple-500' },
            { label: 'Factures', value: '—', icon: '💰', color: 'bg-amber-500' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-xl text-white shadow-sm`}>
                  {stat.icon}
                </span>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module, index) => (
            <Link
              key={module.title}
              href={module.href}
              className={`group block ${module.disabled ? 'pointer-events-none opacity-60' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card hover className="h-full relative overflow-hidden animate-fade-in">
                {module.disabled && (
                  <span className="absolute top-3 right-3 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    Bientôt
                  </span>
                )}
                <div className="text-center py-4">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {module.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{module.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity" style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}></div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="animate-fade-in" style={{ animationDelay: '0.3s' } as React.CSSProperties}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-xl shadow-sm">
              🎯
            </div>
            <h2 className="text-xl font-bold text-gray-900">Actions rapides</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center gap-4 p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl border-2 border-transparent hover:border-emerald-200 transition-all"
              >
                <span className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-500">{action.desc}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
