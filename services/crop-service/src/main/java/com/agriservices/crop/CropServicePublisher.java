package com.agriservices.crop;

import com.sun.net.httpserver.HttpServer;
import jakarta.xml.ws.Endpoint;
import java.net.InetSocketAddress;

public class CropServicePublisher {
    public static void main(String[] args) throws Exception {
        // Utiliser le port 8083 (8082 est occupé par Docker/WSL sur certaines machines)
        int port = 8083;

        // Crée un serveur HTTP sur le port spécifié
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.start();

        // Publie le service SOAP CropServiceImpl sur /crop
        Endpoint endpoint = Endpoint.create(new CropServiceImpl());
        endpoint.publish(server.createContext("/crop"));

        System.out.println("Crop Service (SOAP) running on http://0.0.0.0:" + port + "/crop");
        System.out.println("WSDL: http://0.0.0.0:" + port + "/crop?wsdl");
    }
}