const API = "/processos";
const UPLOAD_URL = "/arquivos/upload";
const DOWNLOAD_URL = "/arquivos";

async function criarProcesso() {

    const numeroProcesso =
        document.getElementById("numeroProcesso").value;

    const cliente =
        document.getElementById("cliente").value;

    const descricao =
        document.getElementById("descricao").value;

    if (!numeroProcesso || !cliente || !descricao) {

        alert("Preencha todos os campos.");
        return;
    }

    await fetch(API, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            numeroProcesso,
            cliente,
            descricao
        })

    });

    document.getElementById("numeroProcesso").value = "";
    document.getElementById("cliente").value = "";
    document.getElementById("descricao").value = "";

    listarProcessos();
}

async function listarProcessos() {

    const response = await fetch(API);

    const processos = await response.json();

    document.getElementById(
        "quantidadeProcessos"
    ).innerText = processos.length;

    const div =
        document.getElementById("processos");

    div.innerHTML = "";

    processos.forEach(processo => {

        div.innerHTML += `

        <div class="process-card">

            <div class="process-header">

                <div>

                    <div class="process-title">
                        ⚖️ ${processo.numeroProcesso}
                    </div>

                    <div class="process-info">
                        Cliente: ${processo.cliente}
                    </div>

                </div>

                <div class="
                    status
                    ${processo.ativo ? 'ativo' : 'arquivado'}
                ">

                    ${
                        processo.ativo
                        ? 'ATIVO'
                        : 'ARQUIVADO'
                    }

                </div>

            </div>

            <div class="process-info">
                ${processo.descricao}
            </div>

            ${
                !processo.ativo
                ?
                `
                    <div class="warning">
                        ⚠ Processo arquivado.
                        Histórico preservado para auditoria.
                    </div>
                `
                :
                ''
            }

            <br>

            ${
                processo.ativo
                ?
                `
                    <button type="button" onclick="arquivarProcesso('${processo.id}')">
                        Arquivar Processo
                    </button>
                `
                :
                `
                    <button type="button" onclick="restaurarProcesso('${processo.id}')">
                        Desarquivar Processo
                    </button>
                `
            }

            <div class="documents">

                <div class="documents-top">

                    <h3>📁 Documentos</h3>

                </div>

                ${
                    processo.ativo
                    ?
                    `
                        <div class="upload-box">

                            <input
                                type="text"
                                id="autor-processo-${processo.id}"
                                placeholder="Nome do advogado"
                            >

                            <input
                                type="file"
                                id="novoArquivo-${processo.id}"
                            >

                            <button type="button" onclick="uploadDocumento('${processo.id}')">
                                Enviar Documento
                            </button>

                        </div>
                    `
                    :
                    ''
                }

                ${
                    processo.documentos && processo.documentos.length > 0
                    ?
                    processo.documentos.map(documento => `

                        <div class="document-card">

                            <h4>
                                📄 ${documento.nomeArquivo}
                            </h4>

                            <div class="document-meta">
                                Tipo: ${documento.tipo}
                            </div>

                            <div class="document-meta">
                                Versão Atual:
                                ${documento.versaoAtual}
                            </div>

                            <div class="version-box">

                                <h4>
                                    📜 Histórico de versões
                                </h4>

                                ${
                                    documento.versoes
                                    ?
                                    documento.versoes.map(v => `

                                        <div class="version-item">

                                            <p>
                                                ✅ Versão ${v.versao}
                                            </p>

                                            <p>
                                                👤 ${v.autor}
                                            </p>

                                            <p>
                                                📝 ${v.observacao}
                                            </p>

                                            <a
                                                class="download-link"
                                                href="${DOWNLOAD_URL}/${v.gridFsFileId}"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Baixar versão ${v.versao}
                                            </a>

                                        </div>

                                    `).join('')
                                    :
                                    ''
                                }

                            </div>

                            ${
                                processo.ativo
                                ?
                                `
                                    <div class="upload-box new-version-box">

                                        <input
                                            type="text"
                                            id="autor-versao-${processo.id}-${documento.id}"
                                            placeholder="Nome do advogado"
                                        >

                                        <input
                                            type="file"
                                            id="novoArquivo-versao-${processo.id}-${documento.id}"
                                        >

                                        <button type="button" onclick="
                                            uploadNovaVersao(
                                                '${processo.id}',
                                                '${documento.id}'
                                            )
                                        ">
                                            Enviar nova versão
                                        </button>

                                    </div>
                                `
                                :
                                ''
                            }

                        </div>

                    `).join('')
                    :
                    `
                        <div class="document-meta">
                            Nenhum documento enviado.
                        </div>
                    `
                }

            </div>

        </div>

        `;
    });

}

async function arquivarProcesso(id) {
    const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro ao arquivar processo: ${errorText}`);
        return;
    }

    listarProcessos();
}

async function restaurarProcesso(id) {
    const response = await fetch(`${API}/${id}/restaurar`, {
        method: "PATCH"
    });

    if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro ao desarquivar processo: ${errorText}`);
        return;
    }

    listarProcessos();
}

async function uploadDocumento(processoId) {

    const arquivoInput = document.getElementById(
        `novoArquivo-${processoId}`
    );

    const autorInput = document.getElementById(
        `autor-processo-${processoId}`
    );

    if (!arquivoInput || !autorInput) {
        alert(
            "Erro interno: os campos de upload não foram encontrados. Recarregue a página e tente novamente."
        );
        console.error(
            "uploadDocumento element missing",
            { processoId, arquivoInput, autorInput }
        );
        return;
    }

    const arquivo = arquivoInput.files[0];
    const autor = autorInput.value;

    if (!arquivo) {

        alert("Selecione um arquivo");
        return;
    }

    if (!autor) {

        alert("Digite o nome do advogado");
        return;
    }

    try {
        const formData = new FormData();

        formData.append("file", arquivo);

        const upload = await fetch(UPLOAD_URL, {
            method: "POST",
            body: formData
        });

        if (!upload.ok) {
            const errorText = await upload.text();
            alert(`Erro ao fazer upload: ${errorText}`);
            return;
        }

        const fileId = await upload.text();

        const salvarDocumento = await fetch(
            `${API}/${processoId}/documentos`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nomeArquivo: arquivo.name,
                    tipo: arquivo.type,
                    versaoAtual: 1,
                    ativo: true,
                    versoes: [
                        {
                            versao: 1,
                            gridFsFileId: fileId,
                            autor: autor,
                            observacao: "Versão inicial",
                            dataUpload: new Date()
                        }
                    ]
                })
            }
        );

        if (!salvarDocumento.ok) {
            const errorText = await salvarDocumento.text();
            alert(`Erro ao salvar documento: ${errorText}`);
            return;
        }

        listarProcessos();
    } catch (error) {
        console.error("uploadDocumento error:", error);
        alert(
            `Erro ao enviar documento: ${error.message || error}`
        );
    }
}

async function uploadNovaVersao(processoId, documentoId) {
    const arquivoInput = document.getElementById(
        `novoArquivo-versao-${processoId}-${documentoId}`
    );

    const autorInput = document.getElementById(
        `autor-versao-${processoId}-${documentoId}`
    );

    if (!arquivoInput || !autorInput) {
        alert(
            "Erro interno: os campos de nova versão não foram encontrados. Recarregue a página e tente novamente."
        );
        console.error(
            "uploadNovaVersao element missing",
            { processoId, documentoId, arquivoInput, autorInput }
        );
        return;
    }

    const arquivo = arquivoInput.files[0];
    const autor = autorInput.value;

    if (!arquivo) {
        alert("Selecione um arquivo");
        return;
    }

    if (!autor) {
        alert("Digite o nome do advogado");
        return;
    }

    try {
        const formData = new FormData();
        formData.append("file", arquivo);

        const upload = await fetch(UPLOAD_URL, {
            method: "POST",
            body: formData
        });

        if (!upload.ok) {
            const errorText = await upload.text();
            alert(`Erro ao fazer upload: ${errorText}`);
            return;
        }

        const fileId = await upload.text();

        const salvarVersao = await fetch(
            `${API}/${processoId}/documentos/${documentoId}/nova-versao`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    gridFsFileId: fileId,
                    autor: autor
                })
            }
        );

        if (!salvarVersao.ok) {
            const errorText = await salvarVersao.text();
            alert(`Erro ao salvar nova versão: ${errorText}`);
            return;
        }

        listarProcessos();
    } catch (error) {
        console.error("uploadNovaVersao error:", error);
        alert(
            `Erro ao enviar nova versão: ${error.message || error}`
        );
    }
}

listarProcessos();