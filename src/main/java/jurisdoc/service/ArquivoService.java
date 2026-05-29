package jurisdoc.service;

import com.mongodb.client.gridfs.model.GridFSFile;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ArquivoService {

    private final GridFsTemplate gridFsTemplate;

    public String uploadArquivo(
            MultipartFile arquivo
    ) throws IOException {

        ObjectId id = gridFsTemplate.store(

                arquivo.getInputStream(),

                arquivo.getOriginalFilename(),

                arquivo.getContentType()
        );

        return id.toString();
    }

    public GridFsResource downloadArquivo(
            String fileId
    ) {

        Query query = new Query(

                Criteria.where("_id")
                        .is(new ObjectId(fileId))
        );

        GridFSFile file =
                gridFsTemplate.findOne(query);

        return gridFsTemplate.getResource(file);
    }
}