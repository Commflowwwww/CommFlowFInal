// ===== CREDENCIAIS VÊM DO config.js =====
const supabaseCAD = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
            const { data: existente, error: erroConsulta } = await supabaseCAD
                .from('usuarios')
                .select('id')
                .eq('nome', nome)
                .maybeSingle();

            if (erroConsulta) throw erroConsulta;
            if (existente) { mostrarErro('❌ Usuário já cadastrado. Faça o login.'); setLoading(false); return; }

            const { error: erroInsert } = await supabaseCAD
                .from('usuarios')
                .insert([{ nome: nome, senha: senha }]);

            if (erroInsert) throw erroInsert;

            mostrarSucesso('✅ Conta criada! Redirecionando...');
            setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        } catch (err) {
            console.error('Erro no cadastro:', err);
            mostrarErro('Erro ao cadastrar. (' + (err.message || err) + ')');
            setLoading(false);
        }
    });
});
