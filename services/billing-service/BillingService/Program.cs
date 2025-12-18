using CoreWCF;
using CoreWCF.Configuration;
using CoreWCF.Description;
using Contracts;
using Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddServiceModelServices();
builder.Services.AddServiceModelMetadata();
builder.Services.AddSingleton<IServiceBehavior, ServiceMetadataBehavior>();

// Register the billing service implementation
builder.Services.AddSingleton<Services.BillingService>();

var app = builder.Build();

// Configure the SOAP service
app.UseServiceModel(serviceBuilder =>
{
    serviceBuilder.AddService<Services.BillingService>();
    serviceBuilder.AddServiceEndpoint<Services.BillingService, IBillingService>(
        new BasicHttpBinding(), "/billing");
    
    var serviceMetadataBehavior = app.Services.GetRequiredService<ServiceMetadataBehavior>();
    serviceMetadataBehavior.HttpGetEnabled = true;
});

Console.WriteLine("========================================");
Console.WriteLine("Billing Service (SOAP) running on http://0.0.0.0:8085");
Console.WriteLine("WSDL: http://0.0.0.0:8085/billing?wsdl");
Console.WriteLine("========================================");

app.Run("http://0.0.0.0:8085");
