package com.ecommerce.backend.SemanticWeb;

import com.ecommerce.backend.models.Product;
import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.riot.ResultSetMgr;
import org.apache.jena.sparql.resultset.ResultsFormat;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class SparqlService {

    private final ProductRDFService productRDFService;
    private Model model =  ModelFactory.createDefaultModel();;

    public SparqlService(ProductRDFService productRDFService) {
        this.productRDFService = productRDFService;
    }

    public void loadProductData(List<Product> products) {
        model = productRDFService.createProductRDF(products);
    }

    public String executeQuery(String sparqlQuery) {
        Query query = QueryFactory.create(sparqlQuery);
        try (QueryExecution qexec = QueryExecutionFactory.create(query, model)) {
            ResultSet results = qexec.execSelect();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ResultSetFormatter.output(outputStream, results, ResultsFormat.FMT_RS_JSON);
            return outputStream.toString();
        }
    }
}
