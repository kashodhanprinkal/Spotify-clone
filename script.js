console.log("let start with js");
let currentSong = new Audio();
let play = document.getElementById("play"); // Assuming playButton is the ID of your play/pause button
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "invalid input";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a  = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
 
}


const playMusic = (track, pause = false) => {
  currentSong.src = '/${folder}/' + track
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

    

  // show the list of songs in the 
  async function main() {
    await getSongs("songs/nsc"); // Await the promise to get the resolved value
    playMusic(songs[0], true);
    
  //show all songs in playlist
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML += `
            <li>
                <img class="invert" src="img/music.svg" alt="">
                <div class="info">                                
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>pk</div>
                </div>
                <div class="playNow">
                    <span>play now</span>
                    <img class="invert" src="img/play.svg" alt="">
                </div>
            </li>`;
  }

  // attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });}

  // attach an event listener to play button, next, previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      console.log("Playing...");
      currentSong.play();
      play.src = "img/pause.svg"; // Change the src attribute to the pause icon
    } else {
      console.log("Pausing...");
      currentSong.pause();
      play.src = "img/play.svg"; // Change the src attribute to the play icon
    }
  });

  //listen for time update event
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
  });
   

  // Add an event listener to seekBar
  document.querySelector(".seekBar").addEventListener("click", (event) => {
    let percent =
      (event.offsetX / event.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });


//add an event tu humicon
document.querySelector(".hamburger").addEventListener("click", function () {
  document.querySelector(".left").style.left = "0";
});

// add an event to close img
document.querySelector(".close").addEventListener("click", function () {
  document.querySelector(".left").style.left = "-120%";
});

// Add an event listener to previous
previous.addEventListener("click", () => {
  currentSong.pause();
  console.log("Previous clicked");
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index - 1 >= 0) {
    playMusic(songs[index - 1]);
  }
});

// Add an event listener to next
next.addEventListener("click", () => {
  currentSong.pause();
  console.log("Next clicked");

  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index + 1 < songs.length) {
    playMusic(songs[index + 1]);
  }
});

//add event to volume
document
  .querySelector(".range")
  .getElementsByTagName("input")[0]
  .addEventListener("change", (e) => {
    console.log(e, e.target, e.target.value);
    currentSong.volume = parseInt(e.target.value) / 100;
  });


main();
