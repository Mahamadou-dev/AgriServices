// File: services/crop-service/src/main/java/MainPublisher.java

import javax.xml.ws.Endpoint;

public class MainPublisher {

    // Le port configuré pour ce service
    private static final String SERVICE_URL = "http://localhost:8082/CropService";

    public static void main(String[] args) {
        System.out.println("Démarrage du service SOAP Crop-Service sur: " + SERVICE_URL);

        // Publie l'implémentation du service à l'URL spécifiée
        Endpoint.publish(SERVICE_URL, new CropServiceImpl());

        System.out.println("Service prêt. Lien WSDL (documentation) : " + SERVICE_URL + "?wsdl");
    }
}