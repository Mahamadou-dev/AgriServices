import Link from 'next/link';
import Card from '@/components/Card';

export default function Home() {
  const features = [
    { icon: '🔐', title: 'Authentification JWT', desc: 'Sécurisation des accès avec tokens JWT et gestion des rôles', color: 'from-blue-500 to-indigo-500' },
    { icon: '👨‍🌾', title: 'Gestion des Agriculteurs', desc: 'CRUD complet avec MongoDB pour gérer les profils des agriculteurs', color: 'from-emerald-500 to-teal-500' },
    { icon: '🌱', title: 'Gestion des Cultures', desc: 'Service SOAP pour la gestion des cultures et parcelles', color: 'from-green-500 to-lime-500' },
    { icon: '📊', title: 'Prédictions Agricoles', desc: 'Estimations de rendement et évaluation des risques avec FastAPI', color: 'from-purple-500 to-pink-500' },
    { icon: '💰', title: 'Facturation', desc: 'Service SOAP .NET pour la gestion des factures', color: 'from-amber-500 to-orange-500' },
    { icon: '🔗', title: 'API Gateway', desc: 'Point d\'entrée unique avec routage intelligent Spring Cloud', color: 'from-cyan-500 to-blue-500' },
  ];

  const services = [
    { icon: '🔐', name: 'Auth Service', tech: 'Spring Boot 3.4 + PostgreSQL + JWT', port: '8081' },
    { icon: '👨‍🌾', name: 'Farmer Service', tech: 'Node.js 22 + Express + MongoDB', port: '3001' },
    { icon: '🌱', name: 'Crop Service', tech: 'Java JAX-WS (SOAP)', port: '8082' },
    { icon: '📊', name: 'Prediction Service', tech: 'Python FastAPI', port: '8000' },
    { icon: '💰', name: 'Billing Service', tech: '.NET 9 CoreWCF (SOAP)', port: '8085' },
    { icon: '🔗', name: 'API Gateway', tech: 'Spring Cloud Gateway', port: '8080' },
  ];

  return (
    <div className="min-h-screen mx-auto bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden  mx-auto min-h-30 bg-gradient-to-br from-emerald-700 via-green-800 to-teal-800 text-white" style={{margin:'auto'}}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-32 sm:py-40">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 rounded-full text-base font-semibold mb-12 backdrop-blur-sm shadow-sm">
              <span className="w-3 h-3 bg-emerald-400 rounded-full mr-4 animate-pulse"></span>
              Plateforme SOA de Gestion Agricole
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold mb-10 tracking-tight drop-shadow-xl">
              <span className="inline-block animate-bounce mr-5">🌾</span>
              AgriServices
            </h1>
            <p className="text-2xl sm:text-3xl text-emerald-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Système de gestion agricole distribué basé sur une architecture orientée services avec microservices REST et SOAP.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center bg-white text-emerald-800 px-12 py-6 rounded-2xl font-extrabold text-xl hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <span>Commencer maintenant</span>
                <svg className="ml-4 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white px-12 py-6 rounded-2xl font-extrabold text-xl hover:bg-white/20 transition-all border-2 border-white/30"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f0fdf4"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-28 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-emerald-900 mb-8">
              Fonctionnalités principales
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Une suite complète d&apos;outils pour gérer votre exploitation agricole
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                hover 
                className="group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-extrabold text-emerald-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture Section */}
      <div className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-emerald-900 mb-8">
              Architecture Microservices
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              6 services indépendants communiquant via l&apos;API Gateway
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <div 
                key={service.name}
                className="group relative p-8 bg-gradient-to-br from-gray-50 to-white border-2 border-emerald-100 rounded-3xl hover:border-emerald-300 hover:shadow-xl transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
              >
                <div className="flex items-start gap-6">
                  <span className="text-5xl">{service.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-extrabold text-xl text-emerald-900 mb-2">{service.name}</h3>
                    <p className="text-base text-gray-600 mb-3">{service.tech}</p>
                    <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-mono">
                      Port: {service.port}
                    </div>
                  </div>
                </div>
                <div className="absolute top-6 right-6 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-28 bg-gradient-to-r from-emerald-700 to-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-10">
            Prêt à optimiser votre gestion agricole ?
          </h2>
          <p className="text-2xl text-emerald-100 mb-12 leading-relaxed">
            Inscrivez-vous gratuitement et découvrez la puissance d&apos;AgriServices
          </p>
          <Link
            href="/register"
            className="inline-flex items-center bg-white text-emerald-800 px-12 py-6 rounded-2xl font-extrabold text-xl hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl"
          >
            Créer un compte gratuit
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-6">
              <span className="text-5xl">🌾</span>
              <div>
                <h3 className="font-extrabold text-2xl">AgriServices</h3>
                <p className="text-gray-400 text-base mt-2"></p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-lg">© 2025 AgriServices - Tous droits réservés</p>
              <p className="text-base text-gray-500 mt-3">Version 1.0 - MVP Complet</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
