import Link from 'next/link';
import Card from '@/components/Card';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🌾 AgriServices</h1>
          <p className="text-xl mb-8">
            Plateforme SOA de Gestion Agricole
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Système de gestion agricole distribué basé sur une architecture orientée services (SOA) 
            avec microservices REST et SOAP.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-green-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Commencer
            </Link>
            <Link
              href="/login"
              className="bg-green-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-600 transition border-2 border-white"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Fonctionnalités principales
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold mb-2">Authentification JWT</h3>
            <p className="text-gray-600">
              Sécurisation des accès avec tokens JWT et gestion des rôles
            </p>
          </Card>

          <Card>
            <div className="text-4xl mb-4">👨‍🌾</div>
            <h3 className="text-xl font-bold mb-2">Gestion des Agriculteurs</h3>
            <p className="text-gray-600">
              CRUD complet avec MongoDB pour gérer les profils des agriculteurs
            </p>
          </Card>

          <Card>
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-bold mb-2">Gestion des Cultures</h3>
            <p className="text-gray-600">
              Service SOAP pour la gestion des cultures et parcelles
            </p>
          </Card>

          <Card>
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Prédictions Agricoles</h3>
            <p className="text-gray-600">
              Estimations de rendement et évaluation des risques avec FastAPI
            </p>
          </Card>

          <Card>
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">Facturation</h3>
            <p className="text-gray-600">
              Service SOAP .NET pour la gestion des factures
            </p>
          </Card>

          <Card>
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-bold mb-2">API Gateway</h3>
            <p className="text-gray-600">
              Point d'entrée unique avec routage intelligent Spring Cloud
            </p>
          </Card>
        </div>
      </div>

      {/* Architecture Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Architecture Microservices
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">🔐 Auth Service</h3>
                <p className="text-sm text-gray-600">Spring Boot 3.4 + PostgreSQL + JWT</p>
                <p className="text-xs text-gray-500 mt-2">Port: 8081</p>
              </div>
              <div className="border-2 border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">👨‍🌾 Farmer Service</h3>
                <p className="text-sm text-gray-600">Node.js 22 + Express + MongoDB</p>
                <p className="text-xs text-gray-500 mt-2">Port: 3001</p>
              </div>
              <div className="border-2 border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">🌱 Crop Service</h3>
                <p className="text-sm text-gray-600">Java JAX-WS (SOAP)</p>
                <p className="text-xs text-gray-500 mt-2">Port: 8082</p>
              </div>
              <div className="border-2 border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">📊 Prediction Service</h3>
                <p className="text-sm text-gray-600">Python FastAPI</p>
                <p className="text-xs text-gray-500 mt-2">Port: 8000</p>
              </div>
              <div className="border-2 border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">💰 Billing Service</h3>
                <p className="text-sm text-gray-600">.NET 9 (SOAP)</p>
                <p className="text-xs text-gray-500 mt-2">Port: 8085</p>
              </div>
              <div className="border-2 border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">🔗 API Gateway</h3>
                <p className="text-sm text-gray-600">Spring Cloud Gateway</p>
                <p className="text-xs text-gray-500 mt-2">Port: 8080</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 AgriServices - MAHAMADOU AMADOU HABOU</p>
          <p className="text-sm text-gray-400 mt-2">Version 1.0 - MVP Complet</p>
        </div>
      </div>
    </div>
  );
}
