// File: services/billing-service/Models/Invoice.cs

using System.Runtime.Serialization;

namespace Models
{
    [DataContract] // Marque cette classe pour la sérialisation WCF
    public class Invoice
    {
        [DataMember]
        public int Id { get; set; }

        [DataMember]
        public string FarmerName { get; set; }

        [DataMember]
        public decimal Amount { get; set; }

        [DataMember]
        public DateTime IssueDate { get; set; }
    }
}