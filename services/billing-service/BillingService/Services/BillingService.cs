// File: services/billing-service/Services/BillingService.cs

using Contracts;
using Models;

namespace Services
{
    public class BillingService : IBillingService
    {
        // Simulation de la logique métier
        private static int _nextInvoiceId = 101;

        public async Task<Invoice> GetInvoiceDetailsAsync(int invoiceId)
        {
            // Logique de récupération de BDD simulée
            await Task.Delay(100);
            return new Invoice
            {
                Id = invoiceId,
                FarmerName = "Simulated Farmer",
                Amount = 450.75M,
                IssueDate = DateTime.Now.AddDays(-5)
            };
        }

        public async Task<string> GenerateNewInvoiceAsync(string farmerName, decimal amount)
        {
            await Task.Delay(100);
            int newId = Interlocked.Increment(ref _nextInvoiceId);
            // Logique de création de facture et enregistrement
            return $"Facture {newId} générée pour {farmerName} d'un montant de {amount:C}.";
        }
    }
}