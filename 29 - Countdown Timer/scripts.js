let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]')

function timer(seconds) {
    // clear any existing timers
    clearInterval(countdown);
    // grabs current date
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    displayEndTime(then);

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        // check if we should stop countdown
        if (secondsLeft < 0) {
            clearInterval(countdown); 
            return;
        }
        // display console log
        displayTimeLeft(secondsLeft);
    }, 1000)
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    const display = `${minutes}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
    document.title = display; // will update on tab
    timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
    // grabs date
    const end = new Date(timestamp);
    const hours = end.getHours();
    const minutes = end.getMinutes();
    // ternary operator -> if hours greater than 12 - 12 to set back to regular US/Canada time
    const adjustTime = hours > 12 ? hours - 12 : hours;
    // if minutes less than '10' then return '0' otherwise ''
    endTime.textContent = `Will Be Back At ${adjustTime}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
    // returns object with time converted into a number
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
// document can target a name attribute directly w/o querySelector (i.e. 'customForm', nested names can be targeted with an additional '.')
document.customForm.addEventListener('submit', function(e){
    // prevents page from loading
    e.preventDefault();
    // grabs minutes value
    const mins = this.minutes.value;
    console.log(mins);
    // runs timer, converts mins into seconds
    timer(mins * 60);
    // clears screen after submit
    this.reset();
})