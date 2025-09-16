const now = new Date();
const midnight = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() + 1,
  0,
  0,
  0
).getTime();

export function countdown() {
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the countdown date
  var distance = midnight - now;

  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result immediately
  document.getElementById("win-time-until-next").innerHTML =
    hours + "h " + minutes + "m " + seconds + "s ";

  // Update the countdown every 1 second
  var x = setInterval(function () {
    var now = new Date().getTime();
    var distance = midnight - now;

    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("win-time-until-next").innerHTML =
      hours + "h " + minutes + "m " + seconds + "s ";

    if (hours <= 0 && minutes <= 0 && seconds <= 0) {
      clearInterval(x);
      onMidnight();
    }
  }, 1000);
}

function onMidnight() {
  location.reload(); // force reload the page
}
