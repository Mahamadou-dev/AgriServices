'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import { getAuthToken, getUser } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
    }
    const user = getUser();
    setIsAdmin(user && user.role === 'ADMIN');
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
    <div className="min-h-screen py-10 sm:py-14 animate-fade-in bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-5 mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-4xl shadow-lg">
              📊
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-emerald-900 tracking-tight">Tableau de bord</h1>
              <p className="text-gray-500 mt-1 text-lg">Bienvenue sur AgriServices</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Agriculteurs', value: '—', icon: '👨‍🌾', color: 'bg-emerald-500' },
            { label: 'Cultures', value: '—', icon: '🌱', color: 'bg-green-500' },
            { label: 'Prédictions', value: '—', icon: '📊', color: 'bg-purple-500' },
            { label: 'Factures', value: '—', icon: '💰', color: 'bg-amber-500' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100 hover:shadow-xl transition-shadow flex flex-col items-center"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center text-3xl text-white shadow-sm mb-3`}>
                {stat.icon}
              </div>
              <span className="text-3xl font-extrabold text-emerald-900 mb-1">{stat.value}</span>
              <p className="text-base font-medium text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {modules.map((module, index) => (
            <Link
              key={module.title}
              href={module.href}
              className={`group block ${module.disabled ? 'pointer-events-none opacity-60' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card hover className="h-full relative overflow-hidden animate-fade-in">
                {module.disabled && (
                  <span className="absolute top-4 right-4 text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                    Bientôt
                  </span>
                )}
                <div className="text-center py-8">
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {module.icon}
                  </div>
                  <h3 className="text-2xl font-extrabold text-emerald-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-gray-500 text-base">{module.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity" style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}></div>
              </Card>
            </Link>
          ))}
          {/* Admin only: User management card */}
          {isAdmin && (
            <Link href="/admin-users" className="group block">
              <Card hover className="h-full relative overflow-hidden animate-fade-in">
                <div className="text-center py-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-700 to-emerald-700 flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform">
                    👥
                  </div>
                  <h3 className="text-2xl font-extrabold text-emerald-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    Gestion des utilisateurs
                  </h3>
                  <p className="text-gray-500 text-base">Voir et supprimer les agriculteurs et coopératives</p>
                </div>
              </Card>
            </Link>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="animate-fade-in" style={{ animationDelay: '0.3s' } as React.CSSProperties}>
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-sm">
              🎯
            </div>
            <h2 className="text-2xl font-extrabold text-emerald-900">Actions rapides</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center gap-6 p-6 bg-white hover:bg-emerald-50 rounded-2xl border-2 border-transparent hover:border-emerald-200 transition-all"
              >
                <span className={`w-16 h-16 rounded-xl bg-gray-50 shadow-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors mb-1 text-lg">
                    {action.title}
                  </h4>
                  <p className="text-base text-gray-500">{action.desc}</p>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
