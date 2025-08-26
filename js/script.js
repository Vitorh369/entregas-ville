const burger = document.querySelector('.hamburger');
const nav = document.querySelector('.main-nav');
burger?.addEventListener('click', () => {
  nav.classList.toggle('open');
  burger.classList.toggle('open');
});

// Scroll-to-top (mostra/oculta no scroll)
const stBtn = document.getElementById('scrollTopBtn');
const toggleSt = () => {
  const y = window.scrollY || document.documentElement.scrollTop;
  if (stBtn) stBtn.style.display = y > 300 ? 'flex' : 'none';
};
window.addEventListener('scroll', toggleSt, { passive: true });
toggleSt();
stBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


// ========= máscara WhatsApp =========
const whatsappInput = document.getElementById('whatsapp');
whatsappInput.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
  value = value.replace(/(\d{5})(\d)/, '$1-$2');
  e.target.value = value.substring(0, 15);
});

// ========= envio + WhatsApp =========
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

function showStatus(msg, ok = true){
  if(!statusEl) return;
  statusEl.textContent = msg;
  statusEl.className = 'form-status ' + (ok ? 'ok' : 'err');
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if(!form.checkValidity()){
    showStatus('Por favor, preencha todos os campos corretamente.', false);
    return;
  }

  // Coleta dos campos
  const nome = document.getElementById('nome')?.value?.trim() || '';
  const email = document.getElementById('email')?.value?.trim() || '';
  const whatsapp = document.getElementById('whatsapp')?.value?.trim() || '';
  const mensagem = document.getElementById('mensagem')?.value?.trim() || '';

  // Número do SEU WhatsApp (destino) em formato internacional sem símbolos:
  // (47) 99742-5798 -> 5547997425798
  const numeroEmpresa = '5547997425798';

  // Monta texto para o WhatsApp
  const textoWpp =
    `Olá! Tenho interesse no orçamento.%0A%0A` +
    `*Nome:* ${encodeURIComponent(nome)}%0A` +
    `*E-mail:* ${encodeURIComponent(email)}%0A` +
    `*WhatsApp:* ${encodeURIComponent(whatsapp)}%0A` +
    `*Mensagem:* ${encodeURIComponent(mensagem)}`;

  // URL do WhatsApp
  const urlWhatsApp = `https://wa.me/${numeroEmpresa}?text=${textoWpp}`;

  // Envia para o FormSubmit
  const data = new FormData(form);
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    });

    if (res.ok) {
      form.reset();
      showStatus('Mensagem enviada com sucesso! ✅');

      // Abre o WhatsApp em nova aba
      const win = window.open(urlWhatsApp, '_blank');
      // Se o navegador bloquear o pop-up, mostra link clicável
      if (!win) {
        showStatus('Mensagem enviada! Clique aqui para abrir o WhatsApp: ' +
          urlWhatsApp, true);
      }
    } else {
      const err = await res.json().catch(()=>({}));
      showStatus(err?.message || 'Erro ao enviar. Tente novamente mais tarde.', false);
    }
  } catch (err) {
    showStatus('Falha de rede. Verifique sua conexão e tente novamente.', false);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar Mensagem';
  }
});

