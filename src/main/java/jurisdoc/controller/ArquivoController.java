package jurisdoc.controller;

import jurisdoc.service.ArquivoService;

import lombok.RequiredArgsConstructor;

import org.springframework.core.io.Resource;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/arquivos")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ArquivoController {

    private final ArquivoService arquivoService;

    @PostMapping("/upload")
    public ResponseEntity<String> upload(

            @RequestParam("file")
            MultipartFile file

    ) throws Exception {

        String id =
                arquivoService.uploadArquivo(file);

        return ResponseEntity.ok(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> download(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                arquivoService.downloadArquivo(id)
        );
    }
}