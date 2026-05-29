package jurisdoc.controller;

import jurisdoc.model.DocumentoJuridico;
import jurisdoc.model.Processo;
import jurisdoc.service.ProcessoService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/processos")
@RequiredArgsConstructor
public class ProcessoController {

    private final ProcessoService processoService;

    @PostMapping
    public ResponseEntity<Processo> criar(
            @RequestBody Processo processo
    ) {

        return ResponseEntity.ok(
                processoService.criar(processo)
        );
    }

    @GetMapping
    public ResponseEntity<List<Processo>> listar() {

        return ResponseEntity.ok(
                processoService.listar()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Processo> buscarPorId(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                processoService.buscarPorId(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Processo> atualizar(

            @PathVariable String id,

            @RequestBody Processo processo
    ) {

        return ResponseEntity.ok(
                processoService.atualizar(
                        id,
                        processo
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> arquivar(
            @PathVariable String id
    ) {

        processoService.arquivar(id);

        return ResponseEntity.ok(
                "Processo arquivado com sucesso."
        );
    }

    @PatchMapping("/{id}/restaurar")
    public ResponseEntity<String> restaurar(
            @PathVariable String id
    ) {

        processoService.restaurar(id);

        return ResponseEntity.ok(
                "Processo restaurado."
        );
    }

    @PostMapping("/{id}/documentos")
    public ResponseEntity<Processo> adicionarDocumento(

            @PathVariable String id,

            @RequestBody DocumentoJuridico documento
    ) {

        return ResponseEntity.ok(

                processoService.adicionarDocumento(
                        id,
                        documento
                )
        );
    }

    @PostMapping(
            "/{processoId}/documentos/{documentoId}/nova-versao"
    )
    public ResponseEntity<Processo> novaVersao(

            @PathVariable String processoId,

            @PathVariable String documentoId,

            @RequestParam String gridFsFileId,

            @RequestParam String autor

    ) {

        return ResponseEntity.ok(

                processoService.adicionarNovaVersao(

                        processoId,
                        documentoId,
                        gridFsFileId,
                        autor
                )
        );
    }
}