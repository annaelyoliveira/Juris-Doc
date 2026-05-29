package jurisdoc.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VersaoDocumento {

    private Integer versao;

    private String gridFsFileId;

    private String autor;

    private String observacao;

    private LocalDateTime dataUpload;
}