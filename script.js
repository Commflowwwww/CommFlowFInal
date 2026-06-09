// ===== FUNÇÃO DE LOGOUT =====
function logout() {
    if (confirm('Deseja realmente sair do sistema?')) {
        localStorage.removeItem('bosch_logged');
        localStorage.removeItem('bosch_user');
        sessionStorage.clear();
        window.location.href = "login.html";
    }
}

// ===== CONFIGURAÇÃO SUPABASE (credenciais vêm do config.js) =====
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase conectado!");

// ===== MENU DE IDIOMAS =====
function toggleLangMenu() {
    document.getElementById("lang-options").classList.toggle("show-lang");
}

function selectLang(lang) {
    changeLang(lang); 
    document.getElementById("current-lang-text").textContent = lang.toUpperCase();
    toggleLangMenu();
}

window.onclick = function(event) {
    if (!event.target.closest('.lang-custom-dropdown')) {
        const dropdown = document.getElementById("lang-options");
        if (dropdown && dropdown.classList.contains('show-lang')) {
            dropdown.classList.remove('show-lang');
        }
    }
}

// ===== NAVEGAÇÃO SIDEBAR =====
function toggleNav() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('expanded');
}

// ===== VARIÁVEIS GLOBAIS =====
let currentStep = 1;
let currentLang = 'pt';
let uploadedFiles = [];
let dropZone = null;
let fileInput = null;
let fileListDisplay = null;

// ===== TRADUÇÕES =====
const translations = {
    pt: {
        title: "Briefing de Comunicação",
        subtitle: "Otimização de Fluxo de Informação Corporativa",
        step_titles: ["Dados Gerais", "O Que e Para Quem", "Conteúdo Detalhado"],
        labels: {
            dept: "Área Solicitante", urgency: "Urgência", contact: "Usuário do Responsável / Contato",
            date: "Período de Envio", theme: "Tema do Comunicado", type: "Tipo de Comunicado",
            public: "Público-Alvo", header: "Título / Header (Chamada Principal)",
            content: "Texto ou Tópicos do Comunicado", media: "Mídias e Arquivos Funcionais"
        },
        placeholders: {
            contact: "Nome ou Ramal", theme: "Ex: Campanha de Vacinação 2024",
            header: "Frase de impacto", content: "Escreva o conteúdo base aqui..."
        },
        next: "Próximo", prev: "Anterior", finish: "Enviar Briefing", success: "Briefing Enviado!"
    },
    en: {
        title: "Communication Briefing",
        subtitle: "Corporate Information Flow Optimization",
        step_titles: ["General Data", "What & Who", "Detailed Content"],
        labels: {
            dept: "Requesting Area", urgency: "Urgency", contact: "Responsible User / Contact",
            date: "Sending Period", theme: "Subject", type: "Communication Type",
            public: "Target Audience", header: "Title / Header (Main Call)",
            content: "Text or Topics", media: "Media and Functional Files"
        },
        placeholders: {
            contact: "Name or Extension", theme: "Ex: Vaccination Campaign 2024",
            header: "Impact phrase", content: "Write the base content here..."
        },
        next: "Next", prev: "Previous", finish: "Send Brief", success: "Briefing Sent!"
    },
    es: {
        title: "Briefing de Comunicación",
        subtitle: "Optimización del Flujo de Información Corporativa",
        step_titles: ["Datos Generales", "Qué y Quién", "Contenido Detallado"],
        labels: {
            dept: "Área Solicitante", urgency: "Urgencia", contact: "Usuario Responsable / Contacto",
            date: "Período de Envío", theme: "Tema del Comunicado", type: "Tipo de Comunicado",
            public: "Público Objetivo", header: "Título / Header (Llamada Principal)",
            content: "Texto o Temas", media: "Medios y Archivos Funcionales"
        },
        placeholders: {
            contact: "Nombre o Extensión", theme: "Ej: Campaña de Vacunación 2024",
            header: "Frase de impacto", content: "Escriba el contenido base aquí..."
        },
        next: "Siguiente", prev: "Anterior", finish: "Enviar Briefing", success: "¡Briefing Enviado!"
    },
    de: {
        title: "Kommunikations-Briefing",
        subtitle: "Optimierung des Informationsflusses im Unternehmen",
        step_titles: ["Allgemeine Daten", "Was & Für Wen", "Detaillierter Inhalt"],
        labels: {
            dept: "Anfordernder Bereich", urgency: "Dringlichkeit", contact: "Verantwortlicher Benutzer / Kontakt",
            date: "Sendezeitraum", theme: "Thema der Mitteilung", type: "Art der Mitteilung",
            public: "Zielgruppe", header: "Titel / Header (Hauptaufruf)",
            content: "Text oder Themen", media: "Medien und funktionale Dateien"
        },
        placeholders: {
            contact: "Name oder Durchwahl", theme: "Z.B.: Impfkampagne 2024",
            header: "Impact-Satz", content: "Basisinhalt hier schreiben..."
        },
        next: "Weiter", prev: "Zurück", finish: "Briefing senden", success: "Briefing Gesendet!"
    }
};

// ===== FUNÇÕES DE ARQUIVOS =====
function handleFiles(files) {
    Array.from(files).forEach(file => {
        uploadedFiles.push(file.name);
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `<i class="fas fa-file-alt"></i> ${file.name}`;
        fileListDisplay.appendChild(item);
    });
}

// ===== MUDANÇA DE IDIOMA =====
function changeLang(lang) {
    currentLang = lang;
    const selector = document.querySelector('.lang-dropdown');
    if (selector) selector.value = lang;
    updateUI();
}

// ===== ATUALIZAÇÃO DA INTERFACE =====
function updateUI() {
    const t = translations[currentLang];
    
    document.getElementById('txt-main-title').textContent = t.title;
    document.getElementById('txt-subtitle').textContent = t.subtitle;
    document.getElementById('txt-success').textContent = t.success;

    const stepTitleEl = document.getElementById('txt-step-title');
    if (stepTitleEl) stepTitleEl.textContent = t.step_titles[currentStep - 1];
    
    document.getElementById('lbl-dept').textContent = t.labels.dept;
    document.getElementById('lbl-urgency').textContent = t.labels.urgency;
    document.getElementById('lbl-contact').textContent = t.labels.contact;
    document.getElementById('lbl-date').textContent = t.labels.date;
    document.getElementById('lbl-theme').textContent = t.labels.theme;
    document.getElementById('lbl-type').textContent = t.labels.type;
    document.getElementById('lbl-public').textContent = t.labels.public;
    document.getElementById('lbl-header').textContent = t.labels.header;
    document.getElementById('lbl-content').textContent = t.labels.content;
    document.getElementById('lbl-media').textContent = t.labels.media;

    document.getElementById('f-requester').placeholder = t.placeholders.contact;
    document.getElementById('f-theme').placeholder = t.placeholders.theme;
    document.getElementById('f-header').placeholder = t.placeholders.header;
    document.getElementById('f-content').placeholder = t.placeholders.content;

    document.getElementById('nextBtn').innerHTML = currentStep === 3 ? `${t.finish} <i class="fas fa-paper-plane"></i>` : `${t.next} <i class="fas fa-arrow-right"></i>`;
    document.getElementById('prevBtn').textContent = t.prev;
    
    const stepCountEl = document.getElementById('step-count');
    if (stepCountEl) stepCountEl.textContent = currentStep + "/3";
}

// ===== NAVEGAÇÃO ENTRE STEPS =====
function moveStep(n) {
    if (n === 1) {
        const currentStepEl = document.getElementById(`step${currentStep}`);
        
        if (!currentStepEl) {
            console.error("Erro: Step não encontrado!");
            return;
        }
        
        const inputs = currentStepEl.querySelectorAll('input:not([type="file"]):not([type="checkbox"]), select, textarea');
        let isValid = true;
        let primeiroCampoVazio = null;

        inputs.forEach(input => {
            if (input && input.value !== undefined) {
                if (!input.value.trim()) {
                    input.style.border = '2px solid var(--danger)';
                    isValid = false;
                    if (!primeiroCampoVazio) primeiroCampoVazio = input;
                } else {
                    input.style.border = '1px solid var(--border)';
                }
            }
        });

        if (!isValid) {
            if (primeiroCampoVazio) primeiroCampoVazio.focus();
            return;
        }
    }

    // Lógica de envio final (Passo 3)
    if (n === 1 && currentStep === 3) {
        const statusOpcoes = [
            "Briefing enviado", 
            "Briefing Recebido", 
            "Briefing em progresso", 
            "Briefing finalizado", 
            "Briefing recusado"
        ];
        
        const statusAleatorio = statusOpcoes[Math.floor(Math.random() * statusOpcoes.length)];

        const briefing = {
            area: document.getElementById('f-area')?.value || "",
            urgency: document.getElementById('f-urgency')?.value || "",
            requester: document.getElementById('f-requester')?.value || "",
            sendDate: document.getElementById('f-sendDate')?.value || "",
            theme: document.getElementById('f-theme')?.value || "",
            type: document.getElementById('f-type')?.value || "",
            audience: document.getElementById('f-audience')?.value || "",
            header: document.getElementById('f-header')?.value || "",
            content: document.getElementById('f-content')?.value || "",
            platform: document.getElementById("f-platform")?.value || "",
            media: uploadedFiles.join(", ") || "Nenhum arquivo anexado",
            datetime: new Date().toLocaleString(),
            status: statusAleatorio
        };

        let history = JSON.parse(localStorage.getItem("briefHistory")) || [];
        history.push(briefing);
        localStorage.setItem("briefHistory", JSON.stringify(history));

        document.getElementById("multi-form").style.display = 'none';
        document.getElementById("success-screen").style.display = 'block';
        
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
        
        return;
    }

    // Troca de abas do formulário
    const steps = document.querySelectorAll('.form-step');
    steps[currentStep - 1].style.display = 'none';
    currentStep += n;
    steps[currentStep - 1].style.display = 'block';
    updateUI();
    document.getElementById("prevBtn").style.visibility = currentStep === 1 ? "hidden" : "visible";
}

// ===== HISTÓRICO =====
function loadHistory() {
    const table = document.getElementById("history-table");
    const history = JSON.parse(localStorage.getItem("briefHistory")) || [];
    table.innerHTML = "";

    history.forEach((item, index) => {
        const status = item.status || "Briefing enviado";

        let statusClass = "status-enviado";
        if (status === "Briefing Recebido") statusClass = "status-recebido";
        else if (status === "Briefing em progresso") statusClass = "status-progresso";
        else if (status === "Briefing finalizado") statusClass = "status-finalizado";
        else if (status === "Briefing recusado") statusClass = "status-recusado";

        table.innerHTML += `
            <tr>
                <td>${item.theme || "-"}</td>
                <td>${item.requester || "-"}</td>
                <td>${item.datetime}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td><button class="btn-secondary" onclick="openReport(${index})">Visualizar</button></td>
            </tr>`;
    });
}

function openReport(index) {
    const history = JSON.parse(localStorage.getItem("briefHistory")) || [];
    const data = history[index];
    document.getElementById("report-content").innerHTML = `
        <p><strong>Área:</strong> ${data.area || "-"}</p>
        <p><strong>Urgência:</strong> ${data.urgency || "-"}</p>
        <p><strong>Responsável:</strong> ${data.requester || "-"}</p>
        <p><strong>Data de Envio:</strong> ${data.sendDate || "-"}</p>
        <hr>
        <p><strong>Tema:</strong> ${data.theme || "-"}</p>
        <p><strong>Tipo:</strong> ${data.type || "-"}</p>
        <p><strong>Público-Alvo:</strong> ${data.audience || "-"}</p>
        <hr>
        <p><strong>Título:</strong> ${data.header || "-"}</p>
        <p><strong>Plataforma:</strong> ${data.platform || "-"}</p>
        <p><strong>Conteúdo:</strong><br>${data.content || "-"}</p>
        <p><strong>Arquivos:</strong> <span style="color: var(--bosch-blue)">${data.media || "-"}</span></p>
        <hr>
        <p><strong>Registrado em:</strong> ${data.datetime}</p>`;
    document.getElementById("report-modal").style.display = "flex";
}

function closeReport() {
    document.getElementById("report-modal").style.display = "none";
}

// ===== RESET DO FORMULÁRIO =====
function resetForm() {
    document.getElementById("multi-form").reset();
    uploadedFiles = [];
    fileListDisplay.innerHTML = "";
    document.getElementById("success-screen").style.display = 'none';
    document.getElementById("multi-form").style.display = 'block';
    document.querySelectorAll('.form-step').forEach(s => s.style.display = 'none');
    currentStep = 1;
    document.querySelectorAll('.form-step')[0].style.display = 'block';
    updateUI();
}

// ===== TROCA DE ABAS =====
function switchTab(tab, el) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    document.querySelectorAll('.view-content').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + tab).classList.add('active');
    if (tab === 'history') loadHistory();
}

// ===== DARK MODE (CORRIGIDO) =====
function toggleTheme() {
    document.body.classList.toggle('dark');
    
    // Salva a preferência
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// ===== ENVIAR PARA SUPABASE =====
async function enviarFormulario() {
    if (typeof supabaseClient === 'undefined' || !supabaseClient) {
        console.warn("⚠️ Supabase não disponível. Salvando apenas localmente.");
        return true;
    }

    try {
        const arquivosString = uploadedFiles.length > 0 ? uploadedFiles.join(", ") : "Nenhum arquivo anexado";
        
        const { data, error } = await supabaseClient
            .from('briefings')
            .insert([
                {
                    area_solicitante: document.getElementById('f-area').value,
                    urgencia: document.getElementById('f-urgency').value,
                    responsavel: document.getElementById('f-requester').value,
                    periodo_envio: document.getElementById('f-sendDate').value,
                    tema: document.getElementById('f-theme').value,
                    tipo_comunicado: document.getElementById('f-type').value,
                    publico_alvo: document.getElementById('f-audience').value,
                    titulo_header: document.getElementById('f-header').value,
                    conteudo: document.getElementById('f-content').value,
                    plataforma_envio: document.getElementById('f-platform').value,
                    arquivos: arquivosString
                }
            ]);

        if (error) {
            console.error("❌ Erro ao enviar para Supabase:", error);
            return true;
        } else {
            console.log("✅ Enviado para Supabase:", data);
            return true;
        }
    } catch (error) {
        console.error("❌ Erro crítico:", error);
        return true;
    }
}

// ===== INICIALIZAÇÃO =====
window.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Sistema CommFlow carregado!");
    
    // Carrega o tema salvo (DARK MODE)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }
    
    if (!window.location.pathname.includes('login.html')) {
        // Inicializa o DropZone
        dropZone = document.getElementById('drop-zone');
        fileInput = document.getElementById('f-files');
        fileListDisplay = document.getElementById('file-list');

        if (dropZone) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, e => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

            dropZone.addEventListener('dragover', () => dropZone.classList.add('drag-over'));
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
            dropZone.addEventListener('drop', (e) => {
                dropZone.classList.remove('drag-over');
                handleFiles(e.dataTransfer.files);
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
        }

        updateUI();
    }
});