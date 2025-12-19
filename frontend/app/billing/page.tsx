'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { billingAPI, getAuthToken } from '@/lib/api';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface Invoice {
  id: number;
  farmerName: string;
  amount: number;
  issueDate: string;
}

export default function BillingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'details'>('generate');
  
  // Generate Invoice Form
  const [generateForm, setGenerateForm] = useState({
    farmerName: '',
    amount: '',
  });
  const [generateResult, setGenerateResult] = useState('');

  // Get Invoice Form
  const [invoiceId, setInvoiceId] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState<Invoice | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setGenerateResult('');
      const result = await billingAPI.generateNewInvoice(
        generateForm.farmerName,
        parseFloat(generateForm.amount)
      );
      setGenerateResult(result);
      setGenerateForm({ farmerName: '', amount: '' });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetInvoiceDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setInvoiceDetails(null);
      const details = await billingAPI.getInvoiceDetails(parseInt(invoiceId));
      setInvoiceDetails(details);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-4xl">💰</span>
            Service de Facturation
          </h1>
          <p className="mt-2 text-gray-600">Service SOAP - Générez et consultez les factures</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'generate'
                ? 'bg-white text-emerald-700 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="mr-2">📝</span>
            Générer une facture
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'details'
                ? 'bg-white text-emerald-700 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="mr-2">🔍</span>
            Consulter une facture
          </button>
        </div>

        {/* Generate Invoice Tab */}
        {activeTab === 'generate' && (
          <Card className="animate-fade-in border-l-4 border-l-emerald-500">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span>🧾</span> Générer une nouvelle facture
            </h2>
            <form onSubmit={handleGenerateInvoice} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'agriculteur *
                </label>
                <input
                  type="text"
                  required
                  value={generateForm.farmerName}
                  onChange={(e) => setGenerateForm({ ...generateForm, farmerName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Ex: John Doe, Alice Martin..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant (€) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">€</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={generateForm.amount}
                    onChange={(e) => setGenerateForm({ ...generateForm, amount: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="1250.75"
                  />
                </div>
              </div>

              <Button type="submit" loading={loading} size="lg" className="w-full">
                Générer la facture
              </Button>
            </form>

            {generateResult && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✅</span>
                  <p className="text-emerald-800 font-semibold">Facture générée avec succès !</p>
                </div>
                <p className="text-emerald-700">{generateResult}</p>
              </div>
            )}
          </Card>
        )}

        {/* Get Invoice Details Tab */}
        {activeTab === 'details' && (
          <Card className="animate-fade-in border-l-4 border-l-blue-500">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span>🔍</span> Consulter les détails d'une facture
            </h2>
            <form onSubmit={handleGetInvoiceDetails} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID de la facture *
                </label>
                <input
                  type="number"
                  required
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ex: 101, 102, 103..."
                />
                <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                  <span>💡</span> Astuce: Essayez l'ID 101 pour une facture de démonstration
                </p>
              </div>

              <Button type="submit" loading={loading} size="lg" className="w-full">
                Rechercher la facture
              </Button>
            </form>

            {invoiceDetails && (
              <div className="mt-6 p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Facture</p>
                    <h3 className="text-2xl font-bold text-gray-900">#{invoiceDetails.id}</h3>
                  </div>
                  <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                    ✓ Payée
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-500 flex items-center gap-2">
                      <span>👤</span> Agriculteur
                    </span>
                    <span className="font-semibold text-gray-900">{invoiceDetails.farmerName}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-500 flex items-center gap-2">
                      <span>💶</span> Montant
                    </span>
                    <span className="font-bold text-2xl text-emerald-600">
                      {invoiceDetails.amount.toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-500 flex items-center gap-2">
                      <span>📅</span> Date d'émission
                    </span>
                    <span className="font-medium text-gray-900">
                      {new Date(invoiceDetails.issueDate).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <span>ℹ️</span> À propos du service de facturation
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Service SOAP .NET 9 avec CoreWCF
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Génération automatique de factures pour les agriculteurs
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Consultation des détails de facture par ID
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Intégration via API Gateway (port 8085)
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
