const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player  = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio   = $('#audio')
const playBtn = $('.btn.btn-toggle-play')
const progress= $('#progress');
const nextBtn = $('.btn.btn-next')
const preBtn = $('.btn.btn-prev');
const repeatBtn = $('.btn.btn-repeat');
const randomBtn = $('.btn.btn-random');
const playList = $('.play-list');
const app = {
    isRandom:false ,
    isRepeat:false,
    currentIndex : 2 ,
    songs : [
        {
            name:'Nevada',
            singer:'Victone',
            image:'https://th.bing.com/th?id=OIP.iXtmMYq97upuJjB5oF0bhAHaFH&w=300&h=207&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
            audio:'Bill Withers - Just The Two Of Us (Lyrics).mp3',
    
        },
        {
            name:'One Love',
            singer:'Billie Eilish',
            image:'https://th.bing.com/th?id=OIP.r0HHsEiAZc_cG9B7GzESGgHaKt&w=207&h=300&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
            audio:'The Weeknd, JENNIE, Lily Rose Depp - One Of The Girls.mp3',
        },
        {
            name:'Bohemian Rhapsody',
            singer:'Queen',
            image:'https://th.bing.com/th?id=OIP.9u1Gnb5EDnYxIoZ0gPHKUAHaHp&w=246&h=254&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
            audio:'Travis Scott - FE!N (Lyrics).mp3',
        },
        {
            name:'Heavens',
            singer:'Unknown',
            image:'https://img-cache.coccoc.com/image2?i=3&l=42/1057223801',
            audio:'Lana Del Rey - Say Yes To Heaven (Lyrics).mp3',
        },
        {
            name:'Neighborhood',
            singer:'Unknown',
            image:'https://th.bing.com/th?id=OIP.FvIQTlvQHQ933BXclVQkEgHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
            audio:'The Neighbourhood - Sweater Weather (Lyrics).mp3',
        },
        
    ],

    render : function (){
        const htmls = this.songs.map((song,index) => {
            return `
                <div class="song ${index === this.currentIndex?'active' :''}" data-index="${index}">
                    <div class="thumb"
                    style ="background-image:url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title"> ${song.name} </h3>
                    <p class=" author"> ${song.singer} </p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h" ></i>
                </div>
                </div>
            `
        }) 
        $('.play-list').innerHTML = htmls.join('')
    
    },// render song list

        
    defindProperties: function() {
        Object.defineProperty(this, 'currentSong',{
            get:function(){
                return this.songs[this.currentIndex];
            }
        });
    },//currentSong


    handleEvent : function(){
        const _this =  this;
        playBtn.onclick = function(){
             if(playBtn.classList.contains('playing')){
                audio.pause();
                playBtn.classList.remove('playing');
                cdThumbAnimate.pause();
             }else {
                audio.play();
                playBtn.classList.add('playing');
                cdThumbAnimate.play();
             }
            
        };
     
      
    const cdThumbAnimate = cdThumb.animate([
        {transform:'rotate(360deg)'}
    ],{
        duration: 2000,
        iterations:Infinity,
    })
    cdThumbAnimate.pause();



    audio.ontimeupdate = function(){
        if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = progressPercent;
    
        }
        
    }

    playList.onclick = function(e){
        const songNode =e.target.closest('.song:not(.active)');
        if(songNode||e.target.closest('.option')){
            //handle song click
            if(songNode){
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render();
                audio.play();
            }

        }
    }

    progress.onchange = function(e){
        const seekTime =  audio.duration * (e.target.value /100); 
        audio.currentTime = seekTime;
    }

    repeatBtn.onclick = function(e){
        _this.isRepeat = !_this.isRepeat;
        repeatBtn.classList.toggle('active',_this.isRepeat);
    }

    preBtn.onclick = function(){
        _this.previousSong();
        if(_this.isRandom){
            _this.randomSong();
        } else{
            _this.previousSong();
        }
        if(playBtn.classList.contains('playing')){
            playBtn.classList.remove('playing')
            cdThumbAnimate.pause();
            progress.value = 0 ;
        }
    }
    
    nextBtn.onclick = function(){   
        _this.nextSong();
        if(_this.isRandom){
            _this.randomSong();
        }else{
            _this.nextSong();
        }
        if(playBtn.classList.contains('playing')){
            playBtn.classList.remove('playing')
            cdThumbAnimate.pause();
            progress.value = 0 ;
        }
        _this.render();
        _this.scrollToActiveSong();
    }
     
    randomBtn.onclick = function(){
        _this.isRandom=!_this.isRandom;
        
        randomBtn.classList.toggle('active',_this.isRandom);
    }

    audio.onended = function(){
        if(_this.isRepeat){
            audio.play();
        }else{
            nextBtn.click();
        }
        

    }


    },
    
    scrollToActiveSong(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'nearest',
            }
            );
        },500)
    },
   
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.audio
        
    },
    
    previousSong : function () {
        this.currentIndex --;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    nextSong :function(){
        this.currentIndex ++;
        if(this.currentIndex >= this.songs.length){
        this.currentIndex = 0;
    }
        this.loadCurrentSong();
    },
    
    randomSong: function(){

        if(this.currentIndex != Math.floor(Math.random() * this.songs.length)){
            this.currentIndex = Math.floor(Math.random() * this.songs.length);
        }
        this.loadCurrentSong();
        
    },
    
   
    start: function (){
        this.defindProperties();
        this.render();
        this.loadCurrentSong();
        this.handleEvent();
        
     },
     
};

app.start({
    
});

