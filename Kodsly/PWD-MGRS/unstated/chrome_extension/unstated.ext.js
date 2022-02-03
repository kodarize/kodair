let pass, username, timeout;

if(location.href.indexOf('cubified.github.io/unstated') > -1){
  chrome.storage.local.get({
    masterpass: ''
  }, (items)=>{
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
    document.getElementById('masterpass').value = items.masterpass;
    document.getElementById('mnemonic').style.background = `linear-gradient(90deg, ${str_to_col(items.masterpass.substring(0, items.masterpass.length/2))}, ${str_to_col(items.masterpass.substring(items.masterpass.length/2, items.masterpass.length))})`;
  });

  let div = document.createElement('div');
  div.classList.add('fullwidth');
  div.innerHTML = `<button type="button" id="save" style="width:100%">Save as Exception</button>`;
  document.querySelector('form').appendChild(div);
  document.getElementById('save').addEventListener('click', ()=>{
    chrome.storage.local.get({
      exceptions: {}
    }, (items)=>{
      if(document.getElementById('site').value.trim() !== ''){
        items.exceptions[document.getElementById('site').value.trim().toLowerCase()] = {
          username: document.getElementById('username').value,
          disable: false,
          lowercase: document.getElementById('lowercase').checked,
          uppercase: document.getElementById('uppercase').checked,
          numbers:   document.getElementById('numbers').checked,
          specials:  document.getElementById('specials').checked,
          length:    parseInt(document.getElementById('length').innerText)
        };
        chrome.storage.local.set({
          exceptions: items.exceptions
        }, ()=>{
          document.getElementById('output').classList.add('success');
          setTimeout(()=>{
            document.getElementById('output').classList.remove('success');
          }, 300);
        });
      }
    });
  });

  document.getElementById('masterpass').addEventListener('change', ()=>{
    chrome.storage.local.set({
      masterpass: document.getElementById('masterpass').value
    }, ()=>{
      document.getElementById('masterpass').classList.add('success');
      setTimeout(()=>{
        document.getElementById('masterpass').classList.remove('success');
      }, 300);
    });
  });
} else {
  [].forEach.call(document.querySelectorAll('form'), (form)=>{
    let pass = form.querySelector('input[type="password"]'),
        username = form.querySelector('input[type="text"]');

    if(pass === null || username === null) return;

    function receive(){
      chrome.runtime.sendMessage({
        site: location.hostname.split('.').reverse()[1],
        username: username.value
      }, (response)=>{
        if(!response) return;
        if(response.error !== undefined) alert('Unstated error: ' + response.error);
        else pass.value = response.password;
      });
    }

    username.addEventListener('keydown', ()=>{
      if(timeout !== undefined) clearTimeout(timeout);
      timeout = setTimeout(receive, 1000);
    });
    username.addEventListener('change', receive);
    pass.addEventListener('focus', receive);
  });
}
