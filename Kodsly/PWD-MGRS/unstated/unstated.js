/*
 * unstated.js: Stateless password manager
 */

/*
 * Encodes input data according to
 *   given options (length, special
 *   characters, etc.)
 *
 * Modified version of a base64
 *   encoding algorithm
 */
function encode(data, options){
  let charset = '',
      clen = 0,
      out = '';

  if(options.lowercase){
    charset += 'abcdefghijklmnopqrstuvwxyz';
  }
  if(options.uppercase){
    charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  if(options.numbers){
    charset += '0123456789';
  }
  if(options.specials){
    charset += '!/+{}[]_-';
  }
  clen = charset.length;

  data = data.padEnd(data.length+(3-(data.length%3)), 'o');

  for(let c=0;c<data.length;c+=3){
    let n = (data.charCodeAt(c) << 16) + (data.charCodeAt(c+1) << 8) + (data.charCodeAt(c+2));
    n = [(n >>> 18) % clen, (n >>> 12) % clen, (n >>> 6) % clen, n % clen];
    out += charset[n[0]] + charset[n[1]] + charset[n[2]] + charset[n[3]];
  }

  return out.substring(0, options.length).padEnd(options.length, out);
}

/*
 * Returns a password
 */
function unstated(site, username, masterpass, options){
  let data = site.trim() + username.trim() + masterpass.trim();

  return encode(sha512_224(data), options);
}

/*
 * UI
 */

function d(i){return document.getElementById(i);}
window.onerror = (e)=>{alert(e);};
function str_to_col(str){
  let hash = 0;
  for(let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for(let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

d('masterpass').addEventListener('keyup', ()=>{
  let inp = d('masterpass').value;

  d('mnemonic').style.background = `linear-gradient(90deg, ${str_to_col(inp.substring(0, inp.length/2))}, ${str_to_col(inp.substring(inp.length/2, inp.length))})`;
});

d('gen').addEventListener('click', ()=>{
  let err = false;

  d('site').classList.remove('invalid');
  d('username').classList.remove('invalid');
  d('masterpass').classList.remove('invalid');

  if(d('site').value.trim() == ''){
    d('site').classList.add('invalid');
    err = true;
  }
  if(d('username').value.trim() == ''){
    d('username').classList.add('invalid');
    err = true;
  }
  if(d('masterpass').value.trim() == ''){
    d('masterpass').classList.add('invalid');
    err = true;
  }

  if(!d('lowercase').checked &&
     !d('uppercase').checked &&
     !d('numbers').checked   &&
     !d('specials').checked){
    d('lowercase').checked = true;
  }

  if(err) return;

  d('output').value = unstated(
    d('site').value,
    d('username').value,
    d('masterpass').value,
    {
      lowercase: d('lowercase').checked,
      uppercase: d('uppercase').checked,
      numbers:   d('numbers').checked,
      specials:  d('specials').checked,
      length:    parseInt(d('length').innerText)
    }
  );

  d('output').select();
  d('output').setSelectionRange(0, d('output').value.length);
});

d('form').addEventListener('submit', (e)=>{
  d('gen').click();
  e.preventDefault();
});

let intr;
function change_len(amt){
  d('length').innerText = parseInt(d('length').innerText)+amt;
}

d('len_inc').addEventListener('click', ()=>{
  change_len(1);
});
d('len_inc').addEventListener('mousedown', ()=>{
  intr = setInterval(()=>{change_len(1);}, 100);
});
d('len_inc').addEventListener('mouseup', ()=>{
  clearInterval(intr);
});
d('len_inc').addEventListener('touchstart', ()=>{
  intr = setInterval(()=>{change_len(1);}, 100);
});
d('len_inc').addEventListener('touchend', ()=>{
  clearInterval(intr);
});

d('len_dec').addEventListener('click', ()=>{
  change_len(-1);
});
d('len_dec').addEventListener('mousedown', ()=>{
  intr = setInterval(()=>{change_len(-1);}, 100);
});
d('len_dec').addEventListener('mouseup', ()=>{
  clearInterval(intr);
});
d('len_dec').addEventListener('touchstart', ()=>{
  intr = setInterval(()=>{change_len(-1);}, 100);
});
d('len_dec').addEventListener('touchend', ()=>{
  clearInterval(intr);
});

d('output').addEventListener('click', ()=>{
  d('output').setSelectionRange(0, d('output').value.length);
});

d('copy').addEventListener('click', ()=>{
  let temp_flip = (d('output').type==='password');

  d('output').select();
  d('output').setSelectionRange(0, d('output').value.length);
  if(temp_flip){
    d('output').type = 'text';
  }
  document.execCommand('copy');
  if(temp_flip){
    d('output').type = 'password';
  }

  d('output').classList.add('success');
  setTimeout(()=>{
    d('output').classList.remove('success');
  }, 300);
});
d('show').addEventListener('click', ()=>{
  d('output').type = (d('output').type==='password'?'text':'password');
  d('show').innerText = (d('output').type==='password'?'Show':'Hide');
});
