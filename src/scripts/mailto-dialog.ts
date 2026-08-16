document.addEventListener('click', function (event) {
  var target = event.target as Element;
  var btn = target.closest('.contact-mailto');
  if (!btn) return;
  event.preventDefault();
  var email = btn.getAttribute('data-email');
  if (!email) return;

  var mailtoFired = false;
  function onBlur() {
    mailtoFired = true;
    window.removeEventListener('blur', onBlur);
  }
  window.addEventListener('blur', onBlur);

  window.location.href = 'mailto:' + email;

  // No blur within 800ms usually means the mail client never took focus.
  setTimeout(function () {
    window.removeEventListener('blur', onBlur);
    if (mailtoFired) return;
    showMailtoDialog(email);
  }, 800);
});

function getMessage(key: string, fallback: string): string {
  if (window.AxonvaleI18n && typeof window.AxonvaleI18n.getMessage === 'function') {
    var val = window.AxonvaleI18n.getMessage(key);
    if (val && val !== key) return val;
  }
  return fallback;
}

function showMailtoDialog(email: string) {
  var overlay = document.createElement('div');
  overlay.className = 'mailto-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  var dialog = document.createElement('div');
  dialog.className = 'mailto-dialog';

  var title = document.createElement('div');
  title.className = 'mailto-dialog-title';
  title.textContent = getMessage('mailto.title', 'Could not open the mail app');

  var body = document.createElement('div');
  body.className = 'mailto-dialog-body';
  body.textContent = getMessage('mailto.body', 'Your email client could not be launched. Please reach us at:');

  var mail = document.createElement('div');
  mail.className = 'mailto-dialog-mail';
  mail.textContent = email;

  var footer = document.createElement('div');
  footer.className = 'mailto-dialog-footer';

  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'mailto-dialog-btn';
  closeBtn.textContent = getMessage('mailto.close', 'Close');

  footer.appendChild(closeBtn);

  dialog.appendChild(title);
  dialog.appendChild(body);
  dialog.appendChild(mail);
  dialog.appendChild(footer);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  function close() {
    overlay.remove();
    document.removeEventListener('keydown', onKeydown);
  }
  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') close();
  }
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) close();
  });
  document.addEventListener('keydown', onKeydown);
}
