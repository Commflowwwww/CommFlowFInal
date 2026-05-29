// ===== CONFIGURAÇÃO SUPABASE (independente) =====
const SUPABASE_URL_CAD = "https://oslkqesroakoltfcirjy.supabase.co";
const SUPABASE_KEY_CAD = "sb_publishable_C1EXoWc7ly_-hHZALVWArw_7X3peuyx";
const supabaseCAD = supabase.createClient(SUPABASE_URL_CAD, SUPABASE_KEY_CAD);

function mostrarErro(msg) {
    const el = document.getElementById('msg-erro');
    el.textContent = msg;
    el.style.display = 'block';
    document.getElementById('msg-sucesso').style.display = 'none';
}

function mostrarSucesso(msg) {
    const el = document.getElementById('msg-sucesso');
    el.textContent = msg;
    el.style.display = 'block';
    document.getElementById('msg-erro').style.display = 'none';
}

function setLoading(ativo) {
    const btn = document.getElementById('btn-cadastrar');
    btn.textContent = ativo ? 'Cadastrando...' : 'Cadastrar Conta';
    btn.style.opacity = ativo ? '0.7' : '1';
    btn.style.pointerEvents = ativo ? 'none' : 'auto';
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('cadastro-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nome     = document.getElementById('new-username').value.trim();
        const senha    = document.getElementById('new-password').value;
        const confirma = document.getElementById('confirm-password').value;

        if (!nome || !senha) { mostrarErro('Preencha todos os campos.'); return; }
        if (senha !== confirma) { mostrarErro('❌ As senhas não coincidem!'); return; }
        if (senha.length < 4) { mostrarErro('A senha deve ter pelo menos 4 caracteres.'); return; }

        setLoading(true);

        try {
            // Verifica se usuário já existe
            const { data: existente, error: erroConsulta } = await supabaseCAD
                .from('usuarios')
                .select('id')
                .eq('nome', nome)
                .maybeSingle();

            if (erroConsulta) throw erroConsulta;

            if (existente) {
                mostrarErro('❌ Este usuário já está cadastrado. Faça o login.');
                setLoading(false);
                return;
            }

            // Insere novo usuário na tabela 'usuarios'
            const { error: erroInsert } = await supabaseCAD
                .from('usuarios')
                .insert([{ nome: nome, senha: senha }]);

            if (erroInsert) throw erroInsert;

            mostrarSucesso('✅ Conta criada! Redirecionando para o login...');
            setTimeout(() => { window.location.href = 'login.html'; }, 1500);

        } catch (err) {
            console.error('Erro no cadastro:', err);
            mostrarErro('Erro ao cadastrar. Tente novamente. (' + (err.message || err) + ')');
            setLoading(false);
        }
    });
});
