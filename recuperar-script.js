document.addEventListener('DOMContentLoaded', function() {
    const recuperarForm = document.getElementById('recuperar-form');

    if (recuperarForm) {
        recuperarForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('reset-username').value.trim();
            const newPassword = document.getElementById('reset-password').value;

            // Se for o admin ou se o usuário existir no localStorage, permite alterar
            if (username === "admin" || localStorage.getItem(`user_db_${username}`) !== null) {
                
                if (username === "admin") {
                    // Salva a nova senha do admin separadamente
                    localStorage.setItem('user_db_admin', newPassword);
                } else {
                    localStorage.setItem(`user_db_${username}`, newPassword);
                }

                alert('✅ Senha alterada com sucesso!');
                window.location.href = "login.html";
            } else {
                alert('❌ Usuário não encontrado no sistema!');
            }
        });
    }
});
