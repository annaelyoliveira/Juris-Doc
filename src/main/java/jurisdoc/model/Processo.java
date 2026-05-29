package jurisdoc.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "processos")
public class Processo {

    @Id
    private String id;

    private String numeroProcesso;

    private String cliente;

    private String descricao;

    private String status;

    private Boolean ativo;

    private LocalDateTime criadoEm;

    private List<DocumentoJuridico> documentos;
}