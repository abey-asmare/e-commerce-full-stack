package com.ecommerce.backend.SemanticWeb;

import com.ecommerce.backend.models.Product;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.RDF;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductRDFService {

    private static final String BASE_URI = "http://example.com/products/";

    public Model createProductRDF(List<Product> products) {
        Model model = ModelFactory.createDefaultModel();
        Property titleProp = model.createProperty(BASE_URI, "title");
        Property descProp = model.createProperty(BASE_URI, "description");
        Property priceProp = model.createProperty(BASE_URI, "price");

        for (Product product : products) {
            Resource productRes = model.createResource(BASE_URI + product.getId())
                    .addProperty(RDF.type, model.createResource(BASE_URI + "Product"))
                    .addProperty(titleProp, product.getTitle())
                    .addProperty(descProp, product.getDescription())
                    .addProperty(priceProp, String.valueOf(product.getPrice()));
            model.add(productRes.listProperties());
        }

        return model;
    }
}