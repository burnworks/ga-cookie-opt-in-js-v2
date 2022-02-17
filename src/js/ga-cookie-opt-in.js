'use strict';

//設定
//GA_ID は必ず実際に使用しているプロファイル ID に変更してください
const GA_ID = 'G-XXXXXXXXXX';
//本文
const text = 'このサイトでは Google アナリティクスの Cookie（クッキー）を使用して、ユーザーのウェブサイト閲覧データを記録しています。 '
//プライバシーポリシーへのリンクテキスト。本文の後ろに挿入されます
const privacypolicy_text = '弊社の個人情報保護方針はこちらでご確認ください。'
//プライバシーポリシーページの URL。上記テキストにリンクとして設定されます
const privacypolicy_link = '/'
//同意するボタンのラベル
const cookie_accept_btn_text = '同意して Cookie を受け入れる'
//同意しないボタンのラベル
const cookie_deny_btn_text = '同意しない'
//Cookie の有効期限（1年 = 31536000秒）
const cookie_max_age = 60 * 60 * 24 * 365;
//CSSファイルの設置ディレクトリ
const script_path = '/ga-cookie-opt-in-js-v2/dist/';

//Cookie を取得
const getCookie = (name) => {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

//Cookie をセット
const setCookie = (name, value, options = {}) => {
  options = {
    path: '/',
    secure: true,
    samesite: 'Lax',
    ...options
  };

  if (options.expires) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }
  document.cookie = updatedCookie;
}

//Cookie を削除
const deleteCookie = (name) => {
  setCookie(name, "", {
    'max-age': 0
  })
}

window.addEventListener('DOMContentLoaded', () => {

  const cookie = getCookie('ga_cookie_opt_in');
  const ga_disable = 'ga-disable-' + GA_ID;

  //Cookie をチェックして ga_cookie_opt_in が存在するかを確認
  if (cookie != null) {
    //ga_cookie_opt_in が存在する場合、Cookie をチェックして ga_cookie_opt_in の値を取得
    if (cookie == 'yes') {
      //ga_cookie_opt_in = yes なら Google Analytics トラッキングコードを発行
      console.log('ga_cookie_opt_in = yes');
      window[ga_disable] = false;
    } else if (cookie == 'no') {
      //ga_cookie_opt_in = no なら Google Analytics を無効に
      console.log('ga_cookie_opt_in = no / ga-disable = true');
      window[ga_disable] = true;
    } else {
      //ga_cookie_opt_in の値が yes でも no でもない場合は例外なので Google Analytics を無効に
      console.log('ga_cookie_opt_in = Unpredictable value');
      window[ga_disable] = true;
    }
  } else {
    //ga_cookie_opt_in が存在しない場合は一旦 Google Analytics を無効にして通知を表示
    console.log('ga_cookie_opt_in = null');
    window[ga_disable] = true;

    // 通知バーのスタイル（パスは必要に応じて変更してください）
    const acceptcss = document.createElement('link');
    acceptcss.href = script_path + 'ga-cookie-opt-in.min.css';
    acceptcss.setAttribute('rel', 'stylesheet');
    document.head.appendChild(acceptcss);

    //通知の表示（テキストの内容やプライバシーポリシーへのリンクは必要に応じて変更してください）
    const accept = document.createElement('div');
    accept.setAttribute('class', 'module-ga-cookie-accept-bar');
    accept.setAttribute('id', 'name-ga-cookie-accept-bar');

    const accept_inner = document.createElement('div');
    accept_inner.setAttribute('class', 'module-ga-cookie-accept-bar-inner');

    const accept_text = document.createElement('p');
    accept_text.append(document.createTextNode(text));

    const privacypolicy = document.createElement('a');
    privacypolicy.setAttribute('href', privacypolicy_link);
    privacypolicy.setAttribute('target', '_blank');
    privacypolicy.setAttribute('rel', 'noopener');
    privacypolicy.append(document.createTextNode(privacypolicy_text));

    const btn = document.createElement('div');
    btn.setAttribute('class', 'module-ga-cookie-btn');

    const accept_btn = document.createElement('button');
    accept_btn.setAttribute('class', 'module-ga-cookie-accept-btn');
    accept_btn.setAttribute('id', 'name-ga-cookie-accept-btn');
    accept_btn.append(document.createTextNode(cookie_accept_btn_text));

    const deny_btn = document.createElement('button');
    deny_btn.setAttribute('class', 'module-ga-cookie-accept-btn module-ga-cookie-deny-btn');
    deny_btn.setAttribute('id', 'name-ga-cookie-deny-btn');
    deny_btn.append(document.createTextNode(cookie_deny_btn_text));

    accept_text.appendChild(privacypolicy);
    btn.appendChild(accept_btn);
    btn.appendChild(deny_btn);
    accept_inner.appendChild(accept_text);
    accept_inner.appendChild(btn);
    accept.appendChild(accept_inner);

    document.body.appendChild(accept);
  }

  //各ボタンの取得
  const acceptBtn = document.getElementById('name-ga-cookie-accept-btn');
  const denyBtn = document.getElementById('name-ga-cookie-deny-btn');
  const resetBtn = document.getElementById('name-ga-cookie-reset-btn');

  //「同意する」ボタンのクリックでオプトイン（ga_cookie_opt_in = yes）
  if (acceptBtn) {
    acceptBtn.onclick = () => {
      setCookie('ga_cookie_opt_in', 'yes', { 'max-age': cookie_max_age });
      document.getElementById('name-ga-cookie-accept-bar').classList.add('state-remove');
      location.reload();
    };
  }

  //「同意しない」ボタンのクリックでオプトアウト（ga_cookie_opt_in = no）
  if (denyBtn) {
    denyBtn.onclick = () => {
      setCookie('ga_cookie_opt_in', 'no', { 'max-age': cookie_max_age });
      document.getElementById('name-ga-cookie-accept-bar').classList.add('state-remove');
      location.reload();
    };
  }

  //「設定をリセット」ボタンのクリックで ga_cookie_opt_in を削除（リセットボタンは別途設置が必要）
  // <button class="module-ga-cookie-accept-btn" id="name-ga-cookie-reset-btn">Cookie の同意設定をリセット</button>
  if (resetBtn) {
    resetBtn.onclick = () => {
      deleteCookie('ga_cookie_opt_in');
      location.reload();
    };
  }

});