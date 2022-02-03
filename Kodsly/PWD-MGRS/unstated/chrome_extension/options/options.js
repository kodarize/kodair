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
function save(){
  chrome.storage.local.set({
    masterpass: d('masterpass').value
  }, ()=>{
    d('masterpass').classList.add('success');
    setTimeout(()=>{
      d('masterpass').classList.remove('success');
    }, 300);
  });
}
function save_exceptions(){
  let out = {};
  [].forEach.call(d('exceptions-container').querySelectorAll('.fullwidth div'), (el)=>{
    if(el.children.length > 0 && el.children[2].value.trim() !== ''){
      let id = el.parentNode.id;
      out[el.querySelector(`#name${id}`).value.trim().toLowerCase()] = {
        site: el.querySelector(`#site${id}`).value,
        username: el.querySelector(`#username${id}`).value,
        disable: el.querySelector(`#disable${id}`).checked,
        lowercase: el.querySelector(`#lowercase${id}`).checked,
        uppercase: el.querySelector(`#uppercase${id}`).checked,
        numbers: el.querySelector(`#numbers${id}`).checked,
        specials: el.querySelector(`#specials${id}`).checked,
        length: el.querySelector(`#length${id}`).value
      };
    }
  });
  chrome.storage.local.set({
    exceptions: out
  }, ()=>{
    [].forEach.call(d('exceptions-container').querySelectorAll('.fullwidth div'), (el)=>{
      if(el.children.length > 0){
        el.children[2].classList.add('success');
        setTimeout(()=>{
          el.children[2].classList.remove('success');
        }, 300);
      }
    });
  });
}
function add_exception(name, opts){
  if(opts === undefined) opts = {site: undefined, username: undefined, disable: false, lowercase: true, uppercase: true, numbers: true, specials: true, length: 32};

  let id = Math.floor(Math.random()*1000);
  let div = document.createElement('div');
  div.classList.add('fullwidth');
  div.style.justifyContent = 'center';
  div.id = id.toString();

  div.innerHTML = `
<div>
<button class='long' id='delete${id}'>x</button>
<br>

<input class='long' type='text' placeholder='Site name for exception' id='name${id}' value=${typeof name!=='string'?'':name}>
<br>

<input class='long' type='text' placeholder='Site name' id='site${id}' value=${opts.site || ''}>
<br>

<input class='long' type='text' placeholder='Username' id='username${id}' value=${opts.username || ''}>
<br><br>

<input type='checkbox' id='disable${id}' ${opts.disable ? 'checked' : ''}>
<label for='disable${id}'>Disable?</label>

<input type='checkbox' id='lowercase${id}' ${opts.lowercase ? 'checked' : ''}>
<label for='lowercase${id}'>a-z</label>

<input type='checkbox' id='uppercase${id}' ${opts.uppercase ? 'checked' : ''}>
<label for='uppercase${id}'>A-Z</label>

<input type='checkbox' id='numbers${id}' ${opts.numbers ? 'checked' : ''}>
<label for='numbers${id}'>0-9</label>

<input type='checkbox' id='specials${id}' ${opts.specials ? 'checked' : ''}>
<label for='specials${id}'>!/_</label>

<input type='number' id='length${id}' value='${opts.length}' style='width: 22pt'>
</div>
  `;
  let br = document.createElement('br');
  d('exceptions-container').appendChild(div);
  d('exceptions-container').appendChild(br);

  d(`name${id}`).addEventListener('change', save_exceptions);
  d(`site${id}`).addEventListener('change', save_exceptions);
  d(`username${id}`).addEventListener('change', save_exceptions);
  d(`disable${id}`).addEventListener('change', ()=>{
    [].forEach.call(div.querySelectorAll(`input[type="checkbox"]:not(#disable${id})`), (el)=>{
      el.disabled = d(`disable${id}`).checked;
    });
    d(`length${id}`).disabled = d(`disable${id}`).checked;
    save_exceptions();
  });
  d(`lowercase${id}`).addEventListener('change', save_exceptions);
  d(`uppercase${id}`).addEventListener('change', save_exceptions);
  d(`numbers${id}`).addEventListener('change', save_exceptions);
  d(`specials${id}`).addEventListener('change', save_exceptions);
  d(`length${id}`).addEventListener('change', save_exceptions);
  d(`delete${id}`).addEventListener('click', ()=>{
    d('exceptions-container').removeChild(div);
    d('exceptions-container').removeChild(br);
    save_exceptions();
  });

  if(typeof name !== 'string') d(`name${id}`).focus();
}

d('masterpass').addEventListener('keyup', ()=>{
  let inp = d('masterpass').value;

  d('mnemonic').style.background = `linear-gradient(90deg, ${str_to_col(inp.substring(0, inp.length/2))}, ${str_to_col(inp.substring(inp.length/2, inp.length))})`;
});
d('masterpass').addEventListener('keydown', (e)=>{
  if(e.keyCode === 13) save();
});
d('masterpass').addEventListener('blur', save);

d('add').addEventListener('click', add_exception);

window.addEventListener('DOMContentLoaded', ()=>{
  chrome.storage.local.get({
    masterpass: '',
    exceptions: {}
  }, (items)=>{
    let inp = items.masterpass;
    d('masterpass').value = inp;
    d('mnemonic').style.background = `linear-gradient(90deg, ${str_to_col(inp.substring(0, inp.length/2))}, ${str_to_col(inp.substring(inp.length/2, inp.length))})`;

    for(let key in items.exceptions){
      add_exception(key, items.exceptions[key]);
    }
  });
});
