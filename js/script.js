document.addEventListener('DOMContentLoaded', () => {
  /* ===========================
   *  Navbar (hamburger)
   * =========================== */
  const burger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');
  burger?.addEventListener('click', () => {
    nav?.classList.toggle('open');
    burger.classList.toggle('open');
  });

  /* ===========================
   *  Scroll-to-top
   * =========================== */
  const stBtn = document.getElementById('scrollTopBtn');
  const toggleSt = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (stBtn) stBtn.style.display = y > 300 ? 'flex' : 'none';
  };
  window.addEventListener('scroll', toggleSt, { passive: true });
  toggleSt();
  stBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ===========================
   *  Máscara WhatsApp
   * =========================== */
  const whatsappInput = document.getElementById('whatsapp');
  whatsappInput?.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    e.target.value = value.substring(0, 15);
  });

  /* ===========================
   *  Form + WhatsApp
   * =========================== */
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  function showStatus(msg, ok = true) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status ' + (ok ? 'ok' : 'err');
  }

  // Define o action via Base64 (esconde o token no HTML)
  if (form) {
    // "https://formsubmit.co/fadcc8fe0de715322b93352ce494571c"
    const b64 = 'aHR0cHM6Ly9mb3Jtc3VibWl0LmNvL2ZhZGNjOGZlMGRlNzE1MzIyYjkzMzUyY2U0OTQ1NzFj';
    form.action = atob(b64);
  }

  let sending = false; // evita duplo envio

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    if (!form.checkValidity()) {
      showStatus('Por favor, preencha todos os campos corretamente.', false);
      return;
    }

    // Campos
    const nome = document.getElementById('nome')?.value?.trim() || '';
    const email = document.getElementById('email')?.value?.trim() || '';
    const whatsapp = document.getElementById('whatsapp')?.value?.trim() || '';
    const mensagem = document.getElementById('mensagem')?.value?.trim() || '';

    // Número do SEU WhatsApp no formato internacional (ex.: 5547999999999)
    const numeroEmpresa = '5547997425798';

    // Texto do WhatsApp
    const textoWpp =
      'Olá! Tenho interesse no orçamento.%0A%0A' +
      '*Nome:*%20' + encodeURIComponent(nome) + '%0A' +
      '*E-mail:*%20' + encodeURIComponent(email) + '%0A' +
      '*WhatsApp:*%20' + encodeURIComponent(whatsapp) + '%0A' +
      '*Mensagem:*%20' + encodeURIComponent(mensagem);

    const urlWhatsApp = `https://wa.me/${numeroEmpresa}?text=${textoWpp}`;

    // Evita bloqueio de pop-up: abre antes do await
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

      const text = await res.text(); // útil para debug
      // console.log('FormSubmit response:', res.status, text);

      if (res.ok) {
        form.reset();
        showStatus('Mensagem enviada com sucesso! ✅');
        if (wppWin) wppWin.location = urlWhatsApp;
        else window.open(urlWhatsApp, '_blank');
      } else {
        if (wppWin) wppWin.close();
        showStatus('Erro ao enviar: ' + (text || 'tente novamente mais tarde.'), false);
      }
    } catch (err) {
      if (wppWin) wppWin.close();
      showStatus('Falha de rede. Verifique sua conexão e tente novamente.', false);
      // console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Mensagem';
      sending = false;
    }
  });
});
