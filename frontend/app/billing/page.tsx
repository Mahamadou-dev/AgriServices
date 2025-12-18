'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { billingAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
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
      alert('Erreur lors de la génération de la facture');
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
      alert('Erreur lors de la récupération des détails de la facture');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">💰 Service de Facturation</h1>
          <p className="mt-2 text-gray-600">Service SOAP - Générez et consultez les factures</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'generate'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Générer une facture
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'details'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Consulter une facture
          </button>
        </div>

        {/* Generate Invoice Tab */}
        {activeTab === 'generate' && (
          <Card>
            <h2 className="text-xl font-semibold mb-6">Générer une nouvelle facture</h2>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: John Doe, Alice Martin..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={generateForm.amount}
                  onChange={(e) => setGenerateForm({ ...generateForm, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 1250.75"
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Génération...' : 'Générer la facture'}
              </Button>
            </form>

            {generateResult && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">✅ Succès</p>
                <p className="text-green-700 mt-1">{generateResult}</p>
              </div>
            )}
          </Card>
        )}

        {/* Get Invoice Details Tab */}
        {activeTab === 'details' && (
          <Card>
            <h2 className="text-xl font-semibold mb-6">Consulter les détails d'une facture</h2>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 101, 102, 103..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Astuce: Essayez l'ID 101 pour une facture de démonstration
                </p>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Recherche...' : 'Rechercher la facture'}
              </Button>
            </form>

            {invoiceDetails && (
              <div className="mt-6 p-6 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Facture #{invoiceDetails.id}</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Payée
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Agriculteur:</span>
                    <span className="font-medium">{invoiceDetails.farmerName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Montant:</span>
                    <span className="font-medium text-lg text-green-600">
                      {invoiceDetails.amount.toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Date d'émission:</span>
                    <span className="font-medium">
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

            {!invoiceDetails && !loading && invoiceId && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-600 text-center">
                  Aucun résultat. Entrez un ID et cliquez sur "Rechercher la facture"
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ À propos du service de facturation</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Service SOAP .NET 9 avec CoreWCF</li>
            <li>• Génération automatique de factures pour les agriculteurs</li>
            <li>• Consultation des détails de facture par ID</li>
            <li>• Intégration via API Gateway (port 8085)</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
