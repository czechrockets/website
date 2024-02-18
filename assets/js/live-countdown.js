// var upgradeTime = 172801;
// var seconds = upgradeTime;

// // calculate secounds between now and 25/11/2023
// var now = new Date();
// // date 26/11/2023 14:00:00 GMT+0200 (Eastern European Standard Time)
// var then = new Date(2023, 10, 26, 13, 0, 0, 0);

// var diff = then.getTime() - now.getTime();
// diff = Math.floor(diff / 1000);

// seconds = diff;


// function timer() {
//     // now create days, hours, minutes, seconds
//     var days        = Math.floor(seconds/24/60/60);
//     var hoursLeft   = Math.floor((seconds) - (days*86400));
//     var hours       = Math.floor(hoursLeft/3600);
//     var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
//     var minutes     = Math.floor(minutesLeft/60);
//     var remainingSeconds = seconds % 60;
    
//   function pad(n) {
//     return (n < 10 ? "0" + n : n);
//   }
//   document.getElementById('live-countdown').innerHTML = pad(days) + ":" + pad(hours) + ":" + pad(minutes) + ":" + pad(remainingSeconds);
//   if (seconds == 0) {
//     clearInterval(live-countdownTimer);
//     document.getElementById('live-countdown').innerHTML = "Live!";
//   } else {
//     seconds--;
//   }
// }
// var liveCountdownTimer = setInterval('timer()', 1000);