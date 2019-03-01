/* Get Our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// https://www.w3schools.com/tags/ref_av_dom.asp (video/audio cmds reference)

/* Build out functions */
function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method]();
}

function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚'; // 'this' is bound to video itself
    console.log(icon);
    toggle.textContent = icon;
 }

 function skip() {
    video.currentTime += parseFloat(this.dataset.skip); // parseFloat converts str into # adding video skipping functionality
 }

 function handleRangeUpdate() {
    video[this.name] = this.value; // adjusts playback and volume rate 
 }

 function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100; // shows progress of video
    progressBar.style.flexBasis = `${percent}%`; // https://www.w3schools.com/jsref/prop_style_flexbasis.asp
 } 

 function scrub(e) { // drags video progress based on mouse
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration
    video.currentTime = scrubTime;
 }

/* Hook up the event listeners */
video.addEventListener('click', togglePlay); // clicking on video will pause/play
video.addEventListener('play', updateButton); // when video is played button updates
video.addEventListener('pause', updateButton); // when video is paused button updates
video.addEventListener('timeupdate', handleProgress); // timeupdate and progress will trigger when video is updating its timecode and when paused will not run progress update 

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change',handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove',handleRangeUpdate));

let mousedown = false; // is person currently clicking?
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e)); // if var is true and moves on
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);