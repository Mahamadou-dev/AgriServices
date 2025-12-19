'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { billingAPI, getAuthToken } from '@/lib/api';
import Card from '@/components/Card';
import Button from '@/components/Button';

// --- Composant de Simulation de Facture ---
const InvoiceDocument = ({ farmerName, amount, id, date }: { farmerName: string, amount: number, id: string | number, date: string }) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden mt-8 animate-in fade-in zoom-in duration-500">
    {/* En-tête de la facture */}
    <div className="bg-emerald-600 p-8 text-white flex justify-between items-start">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">FACTURE</h3>
        <p className="text-emerald-100 text-sm mt-1">N° {id}</p>
      </div>
      <div className="text-right text-sm">
        <p className="font-bold">AgriTech Solutions</p>
        <p className="opacity-80">123 Rue de la c100e</p>
        <p className="opacity-80">5000 Monastir, Tunisie</p>
      </div>
    </div>

    {/* Corps de la facture */}
    <div className="p-8">
      <div className="flex justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Facturé à</p>
          <p className="text-lg font-bold text-gray-800">{farmerName}</p>
          <p className="text-gray-500">Exploitation Agricole</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Date d'émission</p>
          <p className="font-medium text-gray-800">{new Date(date).toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      {/* Tableau des items */}
      <table className="w-full mb-10">
        <thead>
          <tr className="border-b-2 border-gray-100">
            <th className="text-left py-3 text-sm font-semibold text-gray-600">Description</th>
            <th className="text-right py-3 text-sm font-semibold text-gray-600">Quantité</th>
            <th className="text-right py-3 text-sm font-semibold text-gray-600">Prix Unit.</th>
            <th className="text-right py-3 text-sm font-semibold text-gray-600">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-50">
            <td className="py-4 text-gray-700 font-medium">Prestations de services agricoles</td>
            <td className="py-4 text-right text-gray-600">1.0</td>
            <td className="py-4 text-right text-gray-600">{amount.toLocaleString()} €</td>
            <td className="py-4 text-right font-bold text-gray-900">{amount.toLocaleString()} €</td>
          </tr>
        </tbody>
      </table>

      {/* Total */}
      <div className="flex justify-end">
        <div className="w-full md:w-1/3 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Sous-total</span>
            <span className="text-gray-800 font-medium">{amount.toLocaleString()} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">TVA (0%)</span>
            <span className="text-gray-800 font-medium">0,00 €</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold">
            <span className="text-emerald-700">Total</span>
            <span className="text-emerald-700">{amount.toLocaleString()} €</span>
          </div>
        </div>
      </div>
    </div>

    {/* Pied de page */}
    <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between items-center">
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
          <span>📥</span> Télécharger PDF
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
          <span>📧</span> Envoyer par mail
        </button>
      </div>
      <p className="text-xs text-gray-400">Merci de votre confiance.</p>
    </div>
  </div>
);

export default function BillingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'details'>('generate');
  
  // State pour la simulation après génération
  const [lastGenerated, setLastGenerated] = useState<{name: string, amount: number, id: string} | null>(null);

  const [generateForm, setGenerateForm] = useState({ farmerName: '', amount: '' });
  const [generateResult, setGenerateResult] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState<any | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) router.push('/login');
  }, [router]);

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setGenerateResult('');
      const amountNum = parseFloat(generateForm.amount);
      const result = await billingAPI.generateNewInvoice(generateForm.farmerName, amountNum);
      
      setGenerateResult(result);
      // On extrait un ID simulé ou réel du message de retour (ex: "Facture #123 créée")
      const simulatedId = "INV-" + Math.floor(Math.random() * 9000 + 1000);
      
      setLastGenerated({
        name: generateForm.farmerName,
        amount: amountNum,
        id: simulatedId
      });
      
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
    <div className="min-h-screen py-14 bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header (Identique) */}
        <div className="mb-10 flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-emerald-200 shadow-xl">
            💰
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Billing</h1>
            <p className="text-gray-500">Gérez vos transactions SOAP .NET 9</p>
          </div>
        </div>

        {/* Tabs (Identique) */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 inline-flex gap-1 mb-10">
          <button
            onClick={() => setActiveTab('generate')}
            className={`py-2.5 px-6 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'generate' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Générer
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2.5 px-6 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'details' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Consulter
          </button>
        </div>

        {activeTab === 'generate' && (
          <div className="space-y-6">
            <Card className="border-none shadow-xl">
              <h2 className="text-lg font-bold mb-6 text-gray-800">Nouvelle Facture</h2>
              <form onSubmit={handleGenerateInvoice} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Agriculteur</label>
                  <input
                    type="text"
                    required
                    value={generateForm.farmerName}
                    onChange={(e) => setGenerateForm({ ...generateForm, farmerName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="Nom complet"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Montant (€)</label>
                  <input
                    type="number"
                    required
                    value={generateForm.amount}
                    onChange={(e) => setGenerateForm({ ...generateForm, amount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" loading={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl">
                    Émettre la facture
                  </Button>
                </div>
              </form>
            </Card>

            {/* Affichage de la facture simulée après succès */}
            {lastGenerated && (
               <InvoiceDocument 
                farmerName={lastGenerated.name} 
                amount={lastGenerated.amount} 
                id={lastGenerated.id}
                date={new Date().toISOString()}
               />
            )}
          </div>
        )}

        {activeTab === 'details' && (
           <div className="space-y-6">
             <Card className="border-none shadow-xl">
                <h2 className="text-lg font-bold mb-6 text-gray-800">Recherche de facture</h2>
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="ID de la facture (ex: 101)"
                  />
                  <Button onClick={handleGetInvoiceDetails} loading={loading} className="px-8 bg-gray-900 rounded-xl">
                    Rechercher
                  </Button>
                </div>
             </Card>

             {invoiceDetails && (
               <InvoiceDocument 
                farmerName={invoiceDetails.farmerName} 
                amount={invoiceDetails.amount} 
                id={invoiceDetails.id}
                date={invoiceDetails.issueDate}
               />
             )}
           </div>
        )}
      </div>
    </div>
  );
}