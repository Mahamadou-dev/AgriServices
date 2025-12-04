// File: services/billing-service/Program.cs

using Contracts;
using Services;
using CoreWCF.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Configuration du port 8085
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(8085);
});

// Ajouter les services CoreWCF
builder.Services.AddServiceModelServices();
builder.Services.AddSingleton<IBillingService, BillingService>();

var app = builder.Build();

// Ajouter l'endpoint SOAP à l'URL de base
// Remplacez l'utilisation de CoreWCF.Channels.BasicHttpBinding par CoreWCF.BasicHttpBinding
app.UseServiceModel(serviceBuilder =>
{
    serviceBuilder.AddService<BillingService>()
        .AddServiceEndpoint<BillingService, IBillingService>(
            new CoreWCF.BasicHttpBinding(), "/BillingService.svc");
});


app.Run();