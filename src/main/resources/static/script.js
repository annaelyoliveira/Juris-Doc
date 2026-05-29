const API = "/processos";

async function criarProcesso() {

    const numeroProcesso =
        document.getElementById("numeroProcesso").value;

    const cliente =
        document.getElementById("cliente").value;

    const descricao =
        document.getElementById("descricao").value;

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

    carregarProcessos();
}

async function carregarProcessos() {

    const resposta = await fetch(API);

    const processos = await resposta.json();

    document.getElementById("totalProcessos")
        .innerText = processos.length;

    const lista =
        document.getElementById("listaProcessos");

    lista.innerHTML = "";

    processos.forEach(processo => {

        lista.innerHTML += `

        <div class="process-card">

            <h2>
                ⚖ Processo ${processo.numeroProcesso}
            </h2>

            <p>
                <strong>Cliente:</strong>
                ${processo.cliente}
            </p>

            <p>${processo.descricao}</p>

            <div class="${
                processo.ativo
                    ? "status-active"
                    : "status-archived"
            }">

                ${
                    processo.ativo
                        ? "🟢 ATIVO"
                        : "🔴 ARQUIVADO"
                }

            </div>

            ${
                processo.ativo
                    ? `
                    <div style="margin-top:20px">

                        <button
                            onclick="arquivarProcesso('${processo.id}')">

                            Arquivar Processo

                        </button>

                    </div>
                    `
                    : `
                    <div class="audit-warning">

                        ⚠ Processo arquivado.
                        Histórico preservado para auditoria.

                    </div>
                    `
            }

            <div class="documents-section">

                <h3>📁 Documentos</h3>

                ${
                    processo.ativo
                        ? `
                        <div class="upload-section">

                            <input
                                type="text"
                                id="autor-${processo.id}"
                                placeholder="Nome do advogado"
                            >

                            <input
                                type="file"
                                id="arquivo-${processo.id}"
                            >

                            <button
                                onclick="uploadDocumento('${processo.id}')">

                                Enviar Documento

                            </button>

                        </div>
                        `
                        : ""
                }

                ${
                    processo.documentos
                        ?.map(documento => `

                        <div class="document-card">

                            <h4>
                                📄 ${documento.nomeArquivo}
                            </h4>

                            <p>
                                Tipo:
                                ${documento.tipo}
                            </p>

                            <p>
                                Versão Atual:
                                ${documento.versaoAtual}
                            </p>

                            ${
                                processo.ativo
                                    ? `
                                    <div class="upload-section">

                                        <input
                                            type="text"
                                            id="autor-versao-${documento.id}"
                                            placeholder="Nome do advogado"
                                        >

                                        <input
                                            type="file"
                                            id="nova-versao-${documento.id}"
                                        >

                                        <button
                                            onclick="
                                            novaVersao(
                                                '${processo.id}',
                                                '${documento.id}'
                                            )">

                                            Nova Versão

                                        </button>

                                    </div>
                                    `
                                    : ""
                            }

                            <div class="version-history">

                                <h4>
                                    📜 Histórico de versões
                                </h4>

                                ${
                                    documento.versoes
                                        ?.map(versao => `

                                        <div class="version-card">

                                            <p>
                                                ✅ Versão
                                                ${versao.versao}
                                            </p>

                                            <p>
                                                👤 ${versao.autor}
                                            </p>

                                            <p>
                                                📝 ${versao.observacao}
                                            </p>

                                        </div>

                                        `)
                                        .join("")
                                }

                            </div>

                        </div>

                        `)
                        .join("")
                }

            </div>

        </div>

        `;
    });
}

async function arquivarProcesso(id) {

    await fetch(`${API}/${id}`, {

        method: "DELETE"
    });

    carregarProcessos();
}

async function uploadDocumento(processoId) {

    const arquivo =
        document.getElementById(`arquivo-${processoId}`)
            .files[0];

    const autor =
        document.getElementById(`autor-${processoId}`)
            .value;

    if (!arquivo) return;

    const formData = new FormData();

    formData.append("arquivo", arquivo);

    const upload = await fetch("/arquivos/upload", {

        method: "POST",

        body: formData
    });

    const gridFsFileId =
        await upload.text();

    await fetch(
        `${API}/${processoId}/documentos`,
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                id: crypto.randomUUID(),

                nomeArquivo: arquivo.name,

                tipo: arquivo.type,

                versaoAtual: 1,

                ativo: true,

                versoes: [

                    {

                        versao: 1,

                        gridFsFileId,

                        autor,

                        observacao:
                            "Versão inicial",

                        dataUpload:
                            new Date()

                    }

                ]
            })
        }
    );

    carregarProcessos();
}

async function novaVersao(
    processoId,
    documentoId
) {

    const arquivo =
        document.getElementById(
            `nova-versao-${documentoId}`
        ).files[0];

    const autor =
        document.getElementById(
            `autor-versao-${documentoId}`
        ).value;

    if (!arquivo) return;

    const formData = new FormData();

    formData.append("arquivo", arquivo);

    const upload = await fetch("/arquivos/upload", {

        method: "POST",

        body: formData
    });

    const gridFsFileId =
        await upload.text();

    await fetch(

        `${API}/${processoId}/documentos/${documentoId}/nova-versao?gridFsFileId=${gridFsFileId}&autor=${autor}`,

        {

            method: "POST"
        }
    );

    carregarProcessos();
}

carregarProcessos();