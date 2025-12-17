using CoreWCF;
using CoreWCF.Configuration;
using CoreWCF. Description;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddServiceModelServices();
builder.Services.AddServiceModelMetadata();
builder.Services.AddSingleton<IServiceBehavior, ServiceMetadataBehavior>();

var app = builder.Build();

app.UseServiceModel(serviceBuilder =>
{
    serviceBuilder. AddService<BillingService>();
    serviceBuilder.AddServiceEndpoint<BillingService, IBillingService>(
        new BasicHttpBinding(), "/billing");
    
    var serviceMetadataBehavior = app.Services.GetRequiredService<ServiceMetadataBehavior>();
    serviceMetadataBehavior.HttpGetEnabled = true;
});

Console.WriteLine("Billing Service (SOAP) running on http://0.0.0.0:8085");
Console.WriteLine("WSDL: http://0.0.0.0:8085/billing?wsdl");

app.Run("http://0.0.0.0:8085");

[ServiceContract]
public interface IBillingService
{
    [OperationContract]
    string Hello();
}

public class BillingService : IBillingService
{
    public string Hello()
    {
        return "Hello World from Billing Service (SOAP)!";
    }
}
