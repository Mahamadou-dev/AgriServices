package com.agriservices.crop;

import jakarta.jws.WebMethod;
import jakarta.jws.WebService;

@WebService
public interface CropService {
    @WebMethod
    String hello();
}