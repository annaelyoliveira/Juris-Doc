package jurisdoc.config;

import com.mongodb.client.MongoClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;

@Configuration
public class GridFsConfig {

    @Bean
    public GridFsTemplate gridFsTemplate(
            MongoDatabaseFactory databaseFactory,
            MappingMongoConverter converter
    ) {

        return new GridFsTemplate(
                databaseFactory,
                converter
        );
    }
}