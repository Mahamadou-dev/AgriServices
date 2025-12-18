package com.agriservices.crop;

import jakarta.jws.WebMethod;
import jakarta.jws.WebService;
import model.Crop;

@WebService
public interface CropService {
    @WebMethod
    String hello();
    
    @WebMethod
    Crop getCrop(int id);
    
    @WebMethod
    String createCrop(String name, String type, String diseaseStatus);
    
    @WebMethod
    String updateCrop(int id, String name, String type, String diseaseStatus);
    
    @WebMethod
    String deleteCrop(int id);
    
    @WebMethod
    String listCrops();
}