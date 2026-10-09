if (API.token()) location.href = 'dashboard.html';

let reg = new URLSearchParams(location.search).get('mode') === 'register';
const $ = id => document.getElementById(id);

const authLangBtn = $('auth-lang-btn');
if (authLangBtn && typeof I18N !== 'undefined') {
  authLangBtn.innerHTML = I18N.createSwitcherHtml();
}

function paint() {
  $('h').textContent = reg ? I18N.t('authCreateAccount') : I18N.t('authWelcomeBack');
  $('s').textContent = reg ? I18N.t('authRegisterSub') : I18N.t('authLoginSub');
  $('b').textContent = reg ? I18N.t('authSignUpBtn') : I18N.t('authSignInBtn');
  $('nm').hidden = !reg;

  if ($('lbl-name')) $('lbl-name').textContent = I18N.t('authNameLabel');
  if ($('name')) $('name').placeholder = I18N.t('authNamePlaceholder');
  if ($('lbl-email')) $('lbl-email').textContent = I18N.t('authEmailLabel');
  if ($('lbl-pw')) $('lbl-pw').textContent = I18N.t('authPasswordLabel');

  $('pw').autocomplete = reg ? 'new-password' : 'current-password';
  $('sw').innerHTML = reg
    ? `${I18N.t('authHaveAccount')} <a href="#" id="t">${I18N.t('authSignInLink')}</a>`
    : `${I18N.t('authNoAccount')} <a href="#" id="t">${I18N.t('authSignUpLink')}</a>`;

  $('t').onclick = e => {
    e.preventDefault();
    reg = !reg;
    $('err').textContent = '';
    paint();
  };

  if (authLangBtn && typeof I18N !== 'undefined') {
    authLangBtn.innerHTML = I18N.createSwitcherHtml();
  }
}

window.addEventListener('languageChanged', paint);

paint();

$('f').onsubmit = async e => {
  e.preventDefault();
  $('b').disabled = true;
  $('err').textContent = '';
  try {
    const d = await API.post(reg ? '/api/auth/register' : '/api/auth/login', {
      email: $('email').value,
      password: $('pw').value,
      name: $('name').value
    });
    localStorage.setItem('token', d.token);
    location.href = 'dashboard.html';
  } catch (x) {
    $('err').textContent = x.message;
    $('b').disabled = false;
  }
};