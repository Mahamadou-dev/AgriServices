// File: services/crop-service/src/main/java/CropService.java

import model.Crop;
import javax.jws.WebMethod;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import javax.jws.soap.SOAPBinding.Style;
import java.util.List;

// Annotez la classe comme un Service Web
@WebService
@SOAPBinding(style = Style.RPC) // Style RPC est plus simple pour les exemples
public interface CropService {

    @WebMethod
    Crop getCropDetails(int cropId);

    @WebMethod
    List<Crop> getAllCrops();

    @WebMethod
    String registerNewCrop(Crop crop);
}