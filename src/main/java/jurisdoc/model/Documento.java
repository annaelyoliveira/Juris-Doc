package jurisdoc.model;

import java.util.List;

public class Documento {

    private String nomeArquivo;

    private String tipo;

    private Integer versaoAtual;

    private Boolean ativo;

    private List<VersaoDocumento> versoes;
}