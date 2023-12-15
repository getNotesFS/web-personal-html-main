import tracks from '../data/tracks.js';
let tracks_global = tracks;


class AudioPlayer {
    constructor(audioElement, tracks) {
        this.audioElement = audioElement;
        this.tracks = tracks;
        this.currentTrackIndex = 0;
        this.isPlaying = false;

        this.initAudioElement();
        this.initEventListeners();
    }

    initAudioElement() {
        this.setTrack(this.currentTrackIndex);
    }

    initEventListeners() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        playPauseBtn.addEventListener('click', () => this.togglePlayPause());

        const nextBtn = document.getElementById('nextBtn');
        nextBtn.addEventListener('click', () => this.nextTrack());

        const previousBtn = document.getElementById('previousBtn');
        previousBtn.addEventListener('click', () => this.previousTrack());

        const skipForwardBtn = document.getElementById('skipForwardBtn');
        skipForwardBtn.addEventListener('click', () => this.skipForward());

        const skipBackwardBtn = document.getElementById('skipBackwardBtn');

        skipBackwardBtn.addEventListener('click', () => this.skipBackward());

        const muteVolumeBtn = document.getElementById('muteVolumeBtn');
        muteVolumeBtn.addEventListener('click', () => this.muteVolume());

        const volumeSlider = document.getElementById('volumeSlider');
        volumeSlider.addEventListener('input', () => this.setVolume(volumeSlider.value));

        const progressBarRange = document.getElementById('progressBarRange');
        progressBarRange.addEventListener('input', () => this.setProgressBar(progressBarRange.value));

        this.audioElement.addEventListener('timeupdate', () => this.updateProgressBar());

        this.audioElement.addEventListener('ended', () => this.nextTrack());

        this.audioElement.addEventListener('loadedmetadata', () => {
            this.updateProgressBar();
            this.updateTrackInfo();
        });

        this.audioElement.addEventListener('volumechange', () => this.updateVolume());

        this.audioElement.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayPauseButton();
        });

        this.audioElement.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayPauseButton();
        });

        this.audioElement.addEventListener('seeking', () => {
            this.updateProgressBar();
        });

        this.audioElement.addEventListener('seeked', () => {
            this.updateProgressBar();
        });



    }
    updateProgressBar() {
        const progressBarRange = document.getElementById('progressBarRange');
        const currentTime = this.audioElement.currentTime;
        const duration = this.audioElement.duration;
        const progress = (currentTime / duration) * 100;
        progressBarRange.value = progress;
        progressBarRange.style.setProperty('--range-progress', `${progress}%`);


        this.updateCurrentTime();
    }
    updateCurrentTime() {
        const currentTimeElement = document.querySelector('.time.current');
        currentTimeElement.textContent = this.formatTime(this.audioElement.currentTime);
    }

    formatTime(time) {
        if (time && !isNaN(time)) {
            const minutes = Math.floor(time / 60);
            const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
            const seconds = Math.floor(time % 60);
            const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
            return `${formatMinutes}:${formatSeconds}`;
        }
        return '00:00';
    };

    setProgressBar(progress) {
        const progressBarRange = document.getElementById('progressBarRange');
        const duration = this.audioElement.duration;
        const currentTime = (progress * duration) / 100;
        this.audioElement.currentTime = currentTime;
        this.updateCurrentTime();
    }

    setVolume(volume) {
        this.audioElement.volume = volume / 100;
    }

    updateVolume() {
        const volumeSlider = document.getElementById('volumeSlider');
        volumeSlider.value = this.audioElement.volume * 100;
    }

    muteVolume() {
        if (this.audioElement.volume > 0) {
            this.audioElement.volume = 0;
        } else {
            this.audioElement.volume = 1;
        }
        this.updateVolume();
    }

    skipForward() {
        this.audioElement.currentTime += 5;
        this.updateCurrentTime();
    }

    skipBackward() {
        this.audioElement.currentTime -= 5;
        this.updateCurrentTime();
    }



    updatePlayPauseButton = () => {
        playPauseBtn.innerHTML = this.isPlaying ? '<em class="fa fa-pause" aria-hidden="true"></em> ' : '<em class="fa fa-play" aria-hidden="true"></em> ';
    };
    togglePlayPause() {
        if (this.isPlaying) {
            this.audioElement.pause();
        } else {
            this.audioElement.play().catch(error => console.error('Error al intentar reproducir:', error));
        }
        this.isPlaying = !this.isPlaying;
        this.updatePlayPauseButton();
    }

    nextTrack() {
        if (this.currentTrackIndex < this.tracks.length - 1) {
            this.currentTrackIndex++;
        } else {
            this.currentTrackIndex = 0;
        }
        this.setTrack(this.currentTrackIndex);
    }

    previousTrack() {
        if (this.currentTrackIndex > 0) {
            this.currentTrackIndex--;
        } else {
            this.currentTrackIndex = this.tracks.length - 1;
        }
        this.setTrack(this.currentTrackIndex);
    }

    setTrack(index) {
        console.log("setTrack", index)
        this.currentTrackIndex = index;
        const currentTrack = this.tracks[this.currentTrackIndex];
        this.audioElement.src = currentTrack.src;
        this.audioElement.load();
        if (this.isPlaying) {
            this.audioElement.play();
        }
        this.updateTrackInfo();

        const playlist = new Playlist(document.getElementById('playlist'), this);
        playlist.updateSelectedTrack(index);
    }

    updateTrackInfo() {
        const titleElement = document.querySelector('.title');
        const authorElement = document.querySelector('.author');
        const audioImage = document.getElementById('audioImage');
        const audioDuration = document.querySelector('.audioDuration');
        const currentTrack = this.tracks[this.currentTrackIndex];
        titleElement.textContent = currentTrack.title;
        authorElement.textContent = currentTrack.author;
        console.log("Author", currentTrack.author);
        audioImage.src = currentTrack.thumbnail;
        audioDuration.textContent = this.formatTime(this.audioElement.duration);
    }


}

class Playlist {
    constructor(playlistElement, audioPlayer) {
        this.playlistElement = playlistElement;
        this.audioPlayer = audioPlayer;

        this.render();
    }

    render() {
        this.playlistElement.innerHTML = '';
        this.audioPlayer.tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = `${track.title} - ${track.author}`;
            li.classList.add('playlist-item');
            if (index === this.audioPlayer.currentTrackIndex) {
                li.classList.add('selected');
            }
            li.addEventListener('click', () => {
                this.audioPlayer.setTrack(index);
                this.updateSelectedTrack(index);
            });
            this.playlistElement.appendChild(li);
        });
    }

    updateSelectedTrack(selectedIndex) {
        const playlistItems = this.playlistElement.querySelectorAll('.playlist-item');
        playlistItems.forEach((item, index) => {
            item.classList.toggle('selected', index === selectedIndex);
        });
    }
}




// Uso de las clases
document.addEventListener('DOMContentLoaded', function () {
    const audioElement = document.getElementById('audio');
    const playlistElement = document.getElementById('playlist');
    const tracks = tracks_global;

    const audioPlayer = new AudioPlayer(audioElement, tracks);
    new Playlist(playlistElement, audioPlayer);

    document.addEventListener('keydown', function (event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            // Permitir que las teclas se escriban en campos de entrada de texto o áreas de texto.
            return;
        }

        if (event.shiftKey) {
            switch (event.key) {
                case 'P': // Shift + P
                case 'p': // Shift + p
                    event.preventDefault();
                    audioPlayer.togglePlayPause();
                    break;
                case 'F': // Shift + F
                case 'f': // Shift + f
                    event.preventDefault();
                    audioPlayer.skipForward();
                    break;
                case 'B': // Shift + B
                case 'b': // Shift + b
                    event.preventDefault();
                    audioPlayer.skipBackward();
                    break;
                // Agregar más casos si es necesario
            }
        } else {
            switch (event.key) {
                case 'ArrowRight': // Flecha derecha para la siguiente pista
                    event.preventDefault();
                    audioPlayer.nextTrack();
                    break;
                case 'ArrowLeft': // Flecha izquierda para la pista anterior
                    event.preventDefault();
                    audioPlayer.previousTrack();
                    break;
                // Agregar más casos si es necesario
            }
        }
    });
});

