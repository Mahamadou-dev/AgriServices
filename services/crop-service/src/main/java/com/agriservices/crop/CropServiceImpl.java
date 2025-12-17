package com.agriservices.crop;

import jakarta.jws.WebService;

@WebService(endpointInterface = "com.agriservices.crop.CropService")
public class CropServiceImpl implements CropService {
    
    @Override
    public String hello() {
        return "Hello World from Crop Service (SOAP)!";
    }
}