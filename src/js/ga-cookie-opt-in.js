'use strict';

//設定
//GA_ID は必ず実際に使用しているプロファイル ID に変更してください
const GA_ID = 'G-XXXXXXXXXX';
//通知の見出し（デザイン上は不可視です）
const privacypolicy_title = 'Cookie 使用に関する同意確認';
//通知の本文
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
//CSS ファイルの設置ディレクトリ
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

    //通知バーのスタイルを読み込み
    const acceptcss = document.createElement('link');
    acceptcss.href = script_path + 'ga-cookie-opt-in.min.css';
    acceptcss.setAttribute('rel', 'stylesheet');
    document.head.appendChild(acceptcss);

    //通知の外枠を生成
    const accept = document.createElement('div');
    accept.setAttribute('class', 'module-ga-cookie-accept-bar');
    accept.setAttribute('id', 'name-ga-cookie-accept-bar');
    accept.setAttribute('role', 'dialog');
    accept.setAttribute('aria-labelledby', 'name-ga-cookie-accept-bar-header');

    const accept_inner = document.createElement('div');
    accept_inner.setAttribute('class', 'module-ga-cookie-accept-bar-inner');

    //通知のタイトルを生成（不可視）
    const accept_header = document.createElement('h2');
    accept_header.setAttribute('class', 'module-ga-cookie-accept-bar-header');
    accept_header.setAttribute('id', 'name-ga-cookie-accept-bar-header');
    accept_header.append(document.createTextNode(privacypolicy_title));

    //通知の本文を生成
    const accept_text = document.createElement('p');
    accept_text.append(document.createTextNode(text));

    //プライバシーポリシーへのリンクを生成
    const privacypolicy = document.createElement('a');
    privacypolicy.setAttribute('href', privacypolicy_link);
    privacypolicy.setAttribute('target', '_blank');
    privacypolicy.setAttribute('rel', 'noopener');
    privacypolicy.append(document.createTextNode(privacypolicy_text));

    //ボタンの親要素を生成
    const btn = document.createElement('div');
    btn.setAttribute('class', 'module-ga-cookie-btn');

    //同意するボタンを生成
    const accept_btn = document.createElement('button');
    accept_btn.setAttribute('class', 'module-ga-cookie-accept-btn');
    accept_btn.setAttribute('id', 'name-ga-cookie-accept-btn');
    accept_btn.append(document.createTextNode(cookie_accept_btn_text));

    //同意しないボタンの生成
    const deny_btn = document.createElement('button');
    deny_btn.setAttribute('class', 'module-ga-cookie-accept-btn module-ga-cookie-deny-btn');
    deny_btn.setAttribute('id', 'name-ga-cookie-deny-btn');
    deny_btn.append(document.createTextNode(cookie_deny_btn_text));

    //通知の HTML を組み立て
    accept_text.appendChild(privacypolicy);
    btn.appendChild(accept_btn);
    btn.appendChild(deny_btn);
    accept_inner.appendChild(accept_header);
    accept_inner.appendChild(accept_text);
    accept_inner.appendChild(btn);
    accept.appendChild(accept_inner);

    //通知の HTML をウェブページの body 要素に追加
    document.body.appendChild(accept);
  }

  //各ボタンの取得
  const elm_accept_btn = document.getElementById('name-ga-cookie-accept-btn');
  const elm_deny_btn = document.getElementById('name-ga-cookie-deny-btn');
  const elm_reset_btn = document.getElementById('name-ga-cookie-reset-btn');

  //「同意する」ボタンのクリックでオプトイン（ga_cookie_opt_in = yes）
  if (elm_accept_btn) {
    elm_accept_btn.onclick = () => {
      setCookie('ga_cookie_opt_in', 'yes', { 'max-age': cookie_max_age });
      document.getElementById('name-ga-cookie-accept-bar').classList.add('state-remove');
      location.reload();
    };
  }

  //「同意しない」ボタンのクリックでオプトアウト（ga_cookie_opt_in = no）
  if (elm_deny_btn) {
    elm_deny_btn.onclick = () => {
      setCookie('ga_cookie_opt_in', 'no', { 'max-age': cookie_max_age });
      document.getElementById('name-ga-cookie-accept-bar').classList.add('state-remove');
      location.reload();
    };
  }

  //「設定をリセット」ボタンのクリックで ga_cookie_opt_in を削除（リセットボタンは別途設置が必要）
  // <button class="module-ga-cookie-accept-btn" id="name-ga-cookie-reset-btn">Cookie の同意設定をリセット</button>
  if (elm_reset_btn) {
    elm_reset_btn.onclick = () => {
      deleteCookie('ga_cookie_opt_in');
      location.reload();
    };
  }

});