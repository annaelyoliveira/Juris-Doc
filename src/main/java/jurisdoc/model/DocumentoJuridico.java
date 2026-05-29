package jurisdoc.model;

import lombok.Data;

import java.util.List;

@Data
public class DocumentoJuridico {

    private String id;

    private String nomeArquivo;

    private String tipo;

    private Integer versaoAtual;

    private Boolean ativo;

    private List<VersaoDocumento> versoes;
}