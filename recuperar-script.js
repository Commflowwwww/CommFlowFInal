// ===== CREDENCIAIS VÊM DO config.js =====
document.addEventListener('DOMContentLoaded', function() {
    const supabaseREC = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const recuperarForm = document.getElementById('recuperar-form');
    if (recuperarForm) {
        recuperarForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username    = document.getElementById('reset-username').value.trim();
            const newPassword = document.getElementById('reset-password').value;
            const { data: usuario, error } = await supabaseREC
                .from('usuarios').select('id')
                .eq('nome', username).maybeSingle();
            if (error || !usuario) {
                alert('❌ Usuário não encontrado no sistema!');
                return;
            }
            const { error: updateError } = await supabaseREC
                .from('usuarios').update({ senha: newPassword }).eq('nome', username);
            if (updateError) {
                alert('Erro ao alterar senha: ' + updateError.message);
            } else {
                alert('✅ Senha alterada com sucesso!');
                window.location.href = 'login.html';
            }
        });
    }
});
