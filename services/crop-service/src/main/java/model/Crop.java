// File: services/crop-service/src/main/java/model/Crop.java

package model;

import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Crop {
    private int id;
    private String name;
    private String type;
    private String diseaseStatus;

    // Constructeurs
    public Crop() {}

    public Crop(int id, String name, String type, String diseaseStatus) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.diseaseStatus = diseaseStatus;
    }

    // Getters et Setters (nécessaires pour JAXB)

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDiseaseStatus() { return diseaseStatus; }
    public void setDiseaseStatus(String diseaseStatus) { this.diseaseStatus = diseaseStatus; }
}