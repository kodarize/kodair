# youtube-music-player
Mini music player for website  
[sample](http://nupamore.github.io/youtube-music-player/sample.html)

# Usage

Load js file

``` html
<script src="youtube-music-player.js"></script>
```

Set list

``` js
YMP.list = [                  // youtube link
  { name:'The sun of spring', src:'EpNp6gFzFZ0' },
  { name:'Cold winter',       src:'hDyfnSb7zZ0' },
  { name:'Silence',           src:'_WXHjb01IOg' }
];
```
... It's over!

# Expert  

Use Controller

``` html
<div>
  <a id="ymp-play">play</a>
  <a id="ymp-pause">pause</a>
  <a id="ymp-change">change</a>
</div>
```

JS control

``` js
// play
YMP.play();
// pause
YMP.pause();
// next song
YMP.next();
// prev song
YMP.prev();
// change song
YMP.change(name);
// change song (shuffle or not shuffle)
YMP.change();
// not shuffle
YMP.shuffle = false;

// access Youtube API
YMP.player.setVolume(10);
```

Customize!

``` html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
<style>
  a {
    color: #999;
    transition: 0.3s;
  }
  a:hover {
    color:#FFF;
    background-color: #444;
    cursor: pointer;
  }
</style>
<body>
  <a><i id="ymp-play" class="fa fa-play fa-2x"></i></a>
  <a><i id="ymp-pause" class="fa fa-pause fa-2x"></i></a>
  <a><i id="ymp-change" class="fa fa-step-forward fa-2x"></i></a>
</body>
```

# license

MIT
