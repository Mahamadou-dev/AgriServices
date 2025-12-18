package com.agriservices.crop;

import jakarta.jws.WebService;
import model.Crop;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@WebService(endpointInterface = "com.agriservices.crop.CropService")
public class CropServiceImpl implements CropService {
    
    private static final Map<Integer, Crop> cropDatabase = new HashMap<>();
    private static final AtomicInteger idGenerator = new AtomicInteger(1);
    
    static {
        // Initialize with sample data
        Crop wheat = new Crop(1, "Winter Wheat", "Cereal", "Healthy");
        Crop corn = new Crop(2, "Sweet Corn", "Cereal", "Healthy");
        Crop rice = new Crop(3, "Basmati Rice", "Cereal", "Moderate Risk");
        cropDatabase.put(1, wheat);
        cropDatabase.put(2, corn);
        cropDatabase.put(3, rice);
        idGenerator.set(4);
    }
    
    @Override
    public String hello() {
        return "Hello World from Crop Service (SOAP)!";
    }
    
    @Override
    public Crop getCrop(int id) {
        Crop crop = cropDatabase.get(id);
        if (crop == null) {
            throw new RuntimeException("Crop with ID " + id + " not found");
        }
        return crop;
    }
    
    @Override
    public String createCrop(String name, String type, String diseaseStatus) {
        if (name == null || name.trim().isEmpty()) {
            return "Error: Crop name is required";
        }
        if (type == null || type.trim().isEmpty()) {
            return "Error: Crop type is required";
        }
        
        int newId = idGenerator.getAndIncrement();
        Crop newCrop = new Crop(newId, name, type, diseaseStatus != null ? diseaseStatus : "Unknown");
        cropDatabase.put(newId, newCrop);
        
        return "Crop created successfully with ID: " + newId;
    }
    
    @Override
    public String updateCrop(int id, String name, String type, String diseaseStatus) {
        Crop crop = cropDatabase.get(id);
        if (crop == null) {
            return "Error: Crop with ID " + id + " not found";
        }
        
        if (name != null && !name.trim().isEmpty()) {
            crop.setName(name);
        }
        if (type != null && !type.trim().isEmpty()) {
            crop.setType(type);
        }
        if (diseaseStatus != null) {
            crop.setDiseaseStatus(diseaseStatus);
        }
        
        return "Crop with ID " + id + " updated successfully";
    }
    
    @Override
    public String deleteCrop(int id) {
        Crop removed = cropDatabase.remove(id);
        if (removed == null) {
            return "Error: Crop with ID " + id + " not found";
        }
        return "Crop with ID " + id + " deleted successfully";
    }
    
    @Override
    public String listCrops() {
        if (cropDatabase.isEmpty()) {
            return "No crops found in the database";
        }
        
        StringBuilder sb = new StringBuilder();
        sb.append("Total Crops: ").append(cropDatabase.size()).append("\n\n");
        
        for (Map.Entry<Integer, Crop> entry : cropDatabase.entrySet()) {
            Crop crop = entry.getValue();
            sb.append("ID: ").append(crop.getId())
              .append(", Name: ").append(crop.getName())
              .append(", Type: ").append(crop.getType())
              .append(", Disease Status: ").append(crop.getDiseaseStatus())
              .append("\n");
        }
        
        return sb.toString();
    }
}