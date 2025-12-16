package com.agriservices.crop;

import com.sun.net.httpserver.HttpServer;
import jakarta.xml.ws.Endpoint;

import java.net.InetSocketAddress;

public class CropServicePublisher {
    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8082), 0);
        server.start();
        
        Endpoint endpoint = Endpoint.create(new CropServiceImpl());
        endpoint.publish(server.createContext("/crop"));
        
        System.out.println("Crop Service (SOAP) running on http://0.0.0.0:8082/crop");
        System.out.println("WSDL: http://0.0.0.0:8082/crop?wsdl");
    }
}