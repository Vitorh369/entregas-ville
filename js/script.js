document.addEventListener('DOMContentLoaded', () => {
  // ===== Navbar
  const burger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');
  burger?.addEventListener('click', () => {
    nav?.classList.toggle('open');
    burger.classList.toggle('open');
  });

  // ===== Scroll-to-top
  const stBtn = document.getElementById('scrollTopBtn');
  const toggleSt = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (stBtn) stBtn.style.display = y > 300 ? 'flex' : 'none';
  };
  window.addEventListener('scroll', toggleSt, { passive: true });
  toggleSt();
  stBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ===== Máscara WhatsApp
  const whatsappInput = document.getElementById('whatsapp');
  whatsappInput?.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    e.target.value = v.substring(0, 15);
  });

  // ===== Form + WhatsApp
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  function showStatus(msg, ok = true) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status ' + (ok ? 'ok' : 'err');
  }

  if (form) {
    // Define o action via Base64 (esconde o token no HTML)
    const b64 = 'aHR0cHM6Ly9mb3Jtc3VibWl0LmNvL2ZhZGNjOGZlMGRlNzE1MzIyYjkzMzUyY2U0OTQ1NzFj';
    form.action = atob(b64);

    // Ajusta _origin para o domínio atual (entregasville.com.br OU github.io)
    const originInput = form.querySelector('input[name="_origin"]');
    if (originInput) originInput.value = location.hostname;
  }

  let sending = false;

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;

    if (!form.checkValidity()) {
      showStatus('Por favor, preencha todos os campos corretamente.', false);
      return;
    }

    const nome = document.getElementById('nome')?.value?.trim() || '';
    const email = document.getElementById('email')?.value?.trim() || '';
    const whatsapp = document.getElementById('whatsapp')?.value?.trim() || '';
    const mensagem = document.getElementById('mensagem')?.value?.trim() || '';

    // WhatsApp destino em formato internacional
    const numeroEmpresa = '5547997425798';

    const textoWpp =
      'Olá! Tenho interesse no orçamento.%0A%0A' +
      '*Nome:*%20' + encodeURIComponent(nome) + '%0A' +
      '*E-mail:*%20' + encodeURIComponent(email) + '%0A' +
      '*WhatsApp:*%20' + encodeURIComponent(whatsapp) + '%0A' +
      '*Mensagem:*%20' + encodeURIComponent(mensagem);

    const urlWhatsApp = `https://wa.me/${numeroEmpresa}?text=${textoWpp}`;

    // Abre janela antes do await para evitar bloqueio
    const wppWin = window.open('about:blank', '_blank');

    const data = new FormData(form);
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    sending = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });

      const bodyText = await res.text(); // ajuda no debug

      if (res.ok) {
        form.reset();
        showStatus('Mensagem enviada com sucesso! ✅');
        if (wppWin) wppWin.location = urlWhatsApp;
        else window.open(urlWhatsApp, '_blank');
      } else {
        if (wppWin) wppWin.close();
        showStatus(`Erro ao enviar (HTTP ${res.status}). ${bodyText || ''}`, false);
      }
    } catch (err) {
      if (wppWin) wppWin.close();
      showStatus('Falha de rede. Verifique sua conexão e tente novamente.', false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Mensagem';
      sending = false;
    }
  });
});
