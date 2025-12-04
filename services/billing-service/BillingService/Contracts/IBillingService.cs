// File: services/billing-service/Contracts/IBillingService.cs

using CoreWCF;
using Models; // Assurez-vous d'importer le namespace Models

namespace Contracts
{
    [ServiceContract] // Marque cette interface comme un contrat de service WCF
    public interface IBillingService
    {
        [OperationContract] // Marque cette méthode comme une opération du service
        Task<Invoice> GetInvoiceDetailsAsync(int invoiceId);

        [OperationContract]
        Task<string> GenerateNewInvoiceAsync(string farmerName, decimal amount);
    }
}