const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// live video feeds
function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
        console.log(localMediaStream);
        // convert video into a readable URL
        // video.src = window.URL.createdObjectURL(localMediaStream); < --- WARNING: DEPRECATED!!! --- >
        video.srcObject = localMediaStream;
        video.play(); // start video
    })
    .catch(err => {
        console.log(`Nooo! did not work properly...`, err);
    })
}

function paintCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    // set up video or img onto screen based on width, height above (every 16 ms), 'return' can be used to clear setInterval function
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // take pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // mess with them
        // pixels = redEffect(pixels);
        pixels = rgbSplit(pixels);
        //globalAlpha sets or returns the current alpha or transparency value of the drawing 
        // ctx.globalAlpha = 0.8;
        // pixels = greenScreen(pixels);
        // put them back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    // play snap sound
    snap.currentTime = 0;
    snap.play();

    // grab data from canvas
    const data = canvas.toDataURL('/image/jpeg');
    const link = document.createElement('a');
    link.href = data; // The href property sets or returns the entire URL of the current page.
    // // The setAttribute() method adds the specified attribute to an element, and gives it the specified value.  If the specified attribute already exists, only the value is set/changed.
    link.setAttribute('download', 'handsome'); // name of file
    // link.textContent = 'Download Image';
    link.innerHTML = `<img src="${data}" alt="Handsome man" />`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    // pixels.data is an array
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // Green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    // pixels.data is an array
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // RED
        pixels.data[i + 100] = pixels.data[i + 1]; // Green
        pixels.data[i - 150] = pixels.data[i + 2]; // Blue
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
        }
    }
    
    return pixels;
}

getVideo();

video.addEventListener('canplay', paintCanvas);

