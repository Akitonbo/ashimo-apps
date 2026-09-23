/* サイト共通のフォーム送信処理（アイコン追加希望・お問い合わせ） */
(() => {
  'use strict';

  // ===== 送信先の設定 =====
  // ① Formspree（https://formspree.io）などでフォームを作成
  // ② 発行された URL を FORM_ENDPOINT に貼り付ける
  //    例: const FORM_ENDPOINT = 'https://formspree.io/f/xxxxxxxx';
  // 空のままでも、送信ボタンでメールアプリが開く形で動きます。
  const FORM_ENDPOINT = '';
  const MAIL_TO = 'info@ashitanomotode.com';

  // opts = { form, status, submit, subject(values), fields: [{key, label, el, required}] }
  window.setupMailForm = function setupMailForm(opts) {
    const { form, status, submit, fields } = opts;
    const say = (msg, kind) => {
      status.textContent = msg;
      status.className = 'rf-status' + (kind ? ' is-' + kind : '');
    };
    const values = () => Object.fromEntries(fields.map(f => [f.key, (f.el.value || '').trim()]));

    function mailtoFallback(v, subject) {
      const body = fields.map(f => `【${f.label}】${v[f.key] || '（未記入）'}`).join('\n')
        + '\n\n※ サイトのフォームからの送信';
      location.href = `mailto:${MAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      say('メールアプリを開きました。そのまま送信してください。', 'ok');
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (form.querySelector('[name="_gotcha"]')?.value) return; // 迷惑送信よけ

      const v = values();
      const missing = fields.find(f => f.required && !v[f.key]);
      if (missing) { say(`${missing.label}を入力してください。`, 'err'); missing.el.focus(); return; }
      const mail = fields.find(f => f.key === 'email');
      if (mail && v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
        say('メールアドレスの形式をご確認ください。', 'err'); mail.el.focus(); return;
      }

      const subject = opts.subject(v);
      if (!FORM_ENDPOINT) return mailtoFallback(v, subject);

      submit.disabled = true;
      say('送信中…');
      try {
        const payload = { _subject: subject, email: v.email || '' };
        fields.forEach(f => { if (f.key !== 'email') payload[f.label] = v[f.key]; });
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        say('送信しました。ありがとうございます！', 'ok');
      } catch {
        say('送信できませんでした。メールアプリで送信してください。', 'err');
        mailtoFallback(v, subject);
      } finally {
        submit.disabled = false;
      }
    });
  };
})();
