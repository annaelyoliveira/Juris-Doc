package jurisdoc.repository;

import jurisdoc.model.Processo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProcessoRepository
        extends MongoRepository<Processo, String> {
}