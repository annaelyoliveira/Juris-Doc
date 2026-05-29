package jurisdoc.service;

import jurisdoc.model.DocumentoJuridico;
import jurisdoc.model.Processo;
import jurisdoc.model.VersaoDocumento;
import jurisdoc.repository.ProcessoRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProcessoService {

    private final ProcessoRepository repository;

    public Processo criar(Processo processo) {

        processo.setAtivo(true);

        processo.setStatus("ATIVO");

        processo.setCriadoEm(LocalDateTime.now());

        if (processo.getDocumentos() == null) {

            processo.setDocumentos(
                    new ArrayList<>()
            );
        }

        return repository.save(processo);
    }

    public List<Processo> listar() {

        return repository.findAll();
    }

    public Processo buscarPorId(String id) {

        return repository.findById(id)

                .orElseThrow(() ->

                        new RuntimeException(
                                "Processo não encontrado"
                        )
                );
    }

    public Processo atualizar(

            String id,

            Processo processoAtualizado
    ) {

        Processo processo =
                buscarPorId(id);

        processo.setCliente(
                processoAtualizado.getCliente()
        );

        processo.setDescricao(
                processoAtualizado.getDescricao()
        );

        return repository.save(processo);
    }

    public void arquivar(String id) {

        Processo processo =
                buscarPorId(id);

        processo.setAtivo(false);

        processo.setStatus("ARQUIVADO");

        repository.save(processo);
    }

    public void restaurar(String id) {

        Processo processo =
                buscarPorId(id);

        processo.setAtivo(true);

        processo.setStatus("ATIVO");

        repository.save(processo);
    }

    public Processo adicionarDocumento(

            String processoId,

            DocumentoJuridico documento
    ) {

        Processo processo =
                buscarPorId(processoId);

        if (processo.getDocumentos() == null) {

            processo.setDocumentos(
                    new ArrayList<>()
            );
        }

        documento.setId(
                UUID.randomUUID().toString()
        );

        documento.setAtivo(true);

        documento.setVersaoAtual(1);

        if (documento.getVersoes() == null) {

            documento.setVersoes(
                    new ArrayList<>()
            );
        }

        processo.getDocumentos()
                .add(documento);

        return repository.save(processo);
    }

    public Processo adicionarNovaVersao(

            String processoId,

            String documentoId,

            String gridFsFileId,

            String autor
    ) {

        Processo processo =
                buscarPorId(processoId);

        DocumentoJuridico documento =

                processo.getDocumentos()

                        .stream()

                        .filter(doc ->

                                doc.getId()
                                        .equals(documentoId)
                        )

                        .findFirst()

                        .orElseThrow(() ->

                                new RuntimeException(
                                        "Documento não encontrado"
                                )
                        );

        VersaoDocumento novaVersao =
                new VersaoDocumento();

        novaVersao.setVersao(

                documento.getVersaoAtual() + 1
        );

        novaVersao.setGridFsFileId(
                gridFsFileId
        );

        novaVersao.setAutor(
                autor
        );

        novaVersao.setObservacao(
                "Nova versão enviada"
        );

        novaVersao.setDataUpload(
                LocalDateTime.now()
        );

        documento.getVersoes()
                .add(novaVersao);

        documento.setVersaoAtual(
                novaVersao.getVersao()
        );

        return repository.save(processo);
    }
}