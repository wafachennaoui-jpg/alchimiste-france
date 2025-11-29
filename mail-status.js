
document.addEventListener('DOMContentLoaded', function () {
  try {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status'); // "ok" or "error"
    const ft = params.get('ft'); // form_type
    if (!status || !ft) return;
    const box = document.getElementById('status-' + ft);
    if (!box) return;
    box.textContent = status === 'ok' ? '✅ Votre message a bien été envoyé.' : '❌ Échec de l’envoi. Veuillez réessayer.';
    box.style.padding = '10px';
    box.style.marginTop = '8px';
    box.style.borderRadius = '6px';
    box.style.fontWeight = '600';
    box.style.fontSize = '0.95rem';
    box.style.textAlign = 'left';
    box.style.background = status === 'ok' ? '#e6ffed' : '#ffecec';
    box.style.border = status === 'ok' ? '1px solid #b2f5c5' : '1px solid #ffb3b3';
    box.style.color = status === 'ok' ? '#0f5132' : '#842029';
    const target = box.closest('form') || box;
    if (target && target.scrollIntoView) target.scrollIntoView({behavior: 'smooth', block: 'center'});
  } catch (e) {}
});
