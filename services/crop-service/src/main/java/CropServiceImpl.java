// File: services/crop-service/src/main/java/CropServiceImpl.java

import model.Crop;
import javax.jws.WebService;
import java.util.ArrayList;
import java.util.List;

@WebService(endpointInterface = "CropService")
public class CropServiceImpl implements CropService {

    // Simulation d'une base de données
    private List<Crop> crops = new ArrayList<>();

    public CropServiceImpl() {
        crops.add(new Crop(1, "Pomme de terre", "Tubercule", "Healthy"));
        crops.add(new Crop(2, "Tomate", "Légume", "Early blight"));
    }

    @Override
    public Crop getCropDetails(int cropId) {
        return crops.stream()
                .filter(c -> c.getId() == cropId)
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Crop> getAllCrops() {
        return crops;
    }

    @Override
    public String registerNewCrop(Crop crop) {
        crops.add(crop);
        return "Culture " + crop.getName() + " enregistrée avec succès!";
    }
}