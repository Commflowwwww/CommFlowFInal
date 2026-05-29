// ===== CONFIGURAÇÃO SUPABASE (independente) =====
const SUPABASE_URL_LOGIN = "https://oslkqesroakoltfcirjy.supabase.co";
const SUPABASE_KEY_LOGIN = "sb_publishable_C1EXoWc7ly_-hHZALVWArw_7X3peuyx";
const supabaseLOGIN = supabase.createClient(SUPABASE_URL_LOGIN, SUPABASE_KEY_LOGIN);

function mostrarErroLogin(msg) {
    const el = document.getElementById('msg-erro');
    el.textContent = msg;
    el.style.display = 'block';
}

function setLoadingLogin(ativo) {
    const btn = document.getElementById('btn-login');
    if (ativo) {
        btn.innerHTML = 'Verificando...';
        btn.style.opacity = '0.7';
        btn.style.pointerEvents = 'none';
    } else {
        btn.innerHTML = `Acessar Sistema
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>`;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Animação shake
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%,100%{transform:translateX(0)}
            10%,30%,50%,70%,90%{transform:translateX(-8px)}
            20%,40%,60%,80%{transform:translateX(8px)}
        }`;
    document.head.appendChild(style);

    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nome     = document.getElementById('username').value.trim();
        const senha    = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        if (!nome || !senha) { mostrarErroLogin('Preencha usuário e senha.'); return; }

        setLoadingLogin(true);

        try {
            // Busca na tabela 'usuarios' por nome + senha
            const { data: usuario, error } = await supabaseLOGIN
                .from('usuarios')
                .select('id, nome')
                .eq('nome', nome)
                .eq('senha', senha)
                .maybeSingle();

            if (error) throw error;

            if (usuario) {
                const storage = remember ? localStorage : sessionStorage;
                storage.setItem('bosch_logged', 'true');
                storage.setItem('bosch_user', usuario.nome);
                storage.setItem('bosch_user_id', usuario.id);
                window.location.href = 'index.html';
            } else {
                mostrarErroLogin('❌ Usuário ou senha incorretos!');
                form.style.animation = 'shake 0.5s';
                setTimeout(() => { form.style.animation = ''; }, 500);
                setLoadingLogin(false);
            }

        } catch (err) {
            console.error('Erro no login:', err);
            mostrarErroLogin('Erro ao conectar. Tente novamente.');
            setLoadingLogin(false);
        }
    });
});
