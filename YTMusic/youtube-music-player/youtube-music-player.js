
// youtube-music-player
(function(){
  this.YMP = {
    list: [
      // songlist
    ],
    player: {
      // youtube div
    },
    now: false,
    shuffle: true,

    init: function(){
      var no = 0;
      if(YMP.shuffle){
        no = Math.floor(Math.random()*YMP.list.length);
      }
      YMP.player.loadVideoById(YMP.list[no].src, 0, "large");
      YMP.now = no;
      YMP.play();
    },

    play: function(){
      YMP.player.playVideo();
    },

    pause: function(){
      YMP.player.pauseVideo();
    },

    next: function(){
      var no = YMP.now;
      no++;
      if(no >= YMP.list.length){
        no = 0;
      }
      YMP.player.loadVideoById(YMP.list[no].src, 0, "large");
      YMP.now = no;
    },

    prev: function(){
      var no = YMP.now;
      no--;
      if(no < 0){
        no = YMP.list.length-1;
      }
      YMP.player.loadVideoById(YMP.list[no].src, 0, "large");
      YMP.now = no;
    },

    change: function(option){
      var no = YMP.now;
      switch(option){
        case 'random':
          while(no == YMP.now){
            no = Math.floor(Math.random()*YMP.list.length);
          }
          YMP.player.loadVideoById(YMP.list[no].src, 0, "large");
          YMP.now = no;
        break;

        case undefined:
          if(YMP.shuffle){
            YMP.change('random');
          }
          else{
            YMP.next();
          }
        break;

        default:
          if(YMP.list[no].name == option){
            return 'same';
          }
          for(var i in YMP.list){
            if(YMP.list[i].name == option){
              YMP.player.loadVideoById(YMP.list[i].src, 0, "large");
              YMP.now = i;
              return;
            }
          }
          return 'no result';
        break;
      }
    }
  };

// youtube-api
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();

function onYouTubeIframeAPIReady() {
  document.body.innerHTML+='<div id="youtube-music-player-div" style="display:none"></div>';
  YMP.player = new YT.Player('youtube-music-player-div', {
    videoId: 'M7lc1UVf-VE',
    events: {
      'onReady': function(){
        YMP.init();
      },
      'onStateChange': function(event){
        if(event.data == YT.PlayerState.ENDED){
          YMP.change();
        }
        else if(event.data == YT.PlayerState.UNSTARTED){
          setTimeout(function(){
            if(YMP.player.getPlayerState() == YT.PlayerState.UNSTARTED){
              console.warn('link error: ' + YMP.list[YMP.now].src);
              YMP.change();
            }
          }, 3000);
        }
      }
    }
  });
}

// controller
window.addEventListener('DOMContentLoaded', function(){
  document.getElementById('ymp-play').style.display = 'none';
});
window.addEventListener('load', function(){
  var play = document.getElementById('ymp-play');
  var pause = document.getElementById('ymp-pause');
  var change = document.getElementById('ymp-change');

  play.addEventListener('click', function(){
    YMP.play();
    play.style.display = 'none';
    pause.style.display = 'inline';
  });
  pause.addEventListener('click', function(){
    YMP.pause();
    pause.style.display = 'none';
    play.style.display = 'inline';
  });
  change.addEventListener('click', function(){
    YMP.change();
    play.style.display = 'none';
    pause.style.display = 'inline';
  });
});
