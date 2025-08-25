// Menu mobile
const burger = document.querySelector('.hamburger');
const nav = document.querySelector('.main-nav');
burger?.addEventListener('click', () => {
  nav.classList.toggle('open');
  burger.classList.toggle('open');
});

// FormSubmit (opcional: status visual por JS)
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
  const data = new FormData(form);
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';
  try {
    const res = await fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: data });
    if (res.ok) { form.reset(); showStatus('Mensagem enviada com sucesso! ✅'); }
    else { const err = await res.json().catch(()=>({})); showStatus(err?.message || 'Erro ao enviar. Tente novamente mais tarde.', false); }
  } catch (err) {
    showStatus('Falha de rede. Verifique sua conexão e tente novamente.', false);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar Mensagem';
  }
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
