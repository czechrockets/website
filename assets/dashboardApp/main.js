p5.disableFriendlyErrors = true;
document.title = "CRS Dashboard";

let columnCount;
let rowCount;
let padding;
let yOffset;
let xOffset;
let background_color, visuals_color, container_color, signalRed;
let radius;
let middle;
let midb = false;
let fps = 0;
let img;
let isGetting = false;
let data = "";
let oldData = "", oldTime = "", tempData = "";
let LOSgs = false, LOSrc = false;
let timerGs, timerRc;
let timerGsRun = false, timerRcRun = false;
let autoPauseOverride = false, LOSpause = false;
let passPauseOnChange = -1;
let pauseFade = 0;
let warningStatus = "";
let d = 0;
let isPaused = false;
let isLocal = false;

function preload() {
  loadImage('./assets/dashboardApp/crs_logo.png', imageLoaded, imageError);
}

function imageLoaded(loadedImage) {
  img = loadedImage;
}
function imageError(error) {
  console.error('Error loading image:', error);
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  background_color = 15;
  visuals_color = color(106, 132, 251);
  container_color = 30;
  signalRed = color(211,56,40);

  columnCount = 8; // X size of grid
  rowCount = 4; // Y size of grid
  padding = 15;
  yOffset = 10;
  xOffset = 10;
  middle = 0;
}

function draw() {

  if(isPaused && (passPauseOnChange == width*height) && pauseFade > 95)return;
  passPauseOnChange = width*height;
  if(isPaused && pauseFade > 95)console.warn("Paused data has been refreshed!");

  if(!isGetting){
    isGetting = true;
    //console.log("Requesting data");
    try {
      req().then((e)=>{
        e = e.replace("null","\"u\"");
        e = e.replace("\\","");
  
        try {
          data = JSON.parse(e);
          isGetting = false;
          //console.log("Correct data");
        } catch (error) {
          console.log("Error in parsing data");
          isGetting = false; //new
        }
  
      }).catch((error) => {
        console.log("Error in getting data");
        isGetting = false;
      });
    } catch (error) {
      console.log(error);
      isGetting = false;
    }
  }


  tempData = { ...data };
  delete tempData["timestamp_gs"];
  if(oldTime == data.timestamp_gs && !timerGsRun && !LOSgs && data.timestamp_gs != null){
    timerGsRun = true;
    startGSTimer(data.timestamp_gs);
  }
  if(oldTime != data.timestamp_gs)LOSgs = false;
  if(compareJSON(oldData, tempData) && !timerRcRun && !LOSrc && (Object.keys(data).length != 0)){
    timerRcRun = true;
    startRCTimer({ ...tempData});
  }
  if(!compareJSON(oldData, tempData))LOSrc = false;
  oldData = { ...tempData};
  oldTime = data.timestamp_gs;

  if(!LOSrc)LOSgs = false;

  LOSpause = (LOSgs || LOSrc  || Object.keys(data).length == 0) && !autoPauseOverride;

  if(Object.keys(data).length == 0)warningStatus = "Signal lost";
  else if(LOSgs)warningStatus = "Groundstation signal lost";
  else if(LOSrc)warningStatus = "Sherpa signal lost";
  else warningStatus = "Recieving data";

  //console.log("LOSGS: "+LOSgs+"| LOSRC: "+LOSrc);

  let rat = (width + height)/2;
  xOffset = rat / 143;
  yOffset = rat / 143;
  padding = rat / 95;

  //For phone users
  if(width*1.02>height)d = 0;
  else d = 1;

  columnCount = [8,4][d];
  rowCount = [4,8][d];
      
  //This code resizes the grid according to the width and height. Good luck trying to understand it!
  radius = min( round((width-(padding*2)-((columnCount-1)*xOffset))/columnCount), round((height-(padding*2)-((rowCount-1)*yOffset))/rowCount) );
  middle = max((width-((columnCount*(radius + xOffset)-xOffset)+padding*2))/2,(height-((rowCount*(radius + yOffset)-yOffset)+padding*2))/2);
  if(round((width-(padding*2)-((columnCount-1)*xOffset))/columnCount) > round((height-(padding*2)-((rowCount-1)*yOffset))/rowCount))midb = true;
  else midb = false;

  background(background_color);
  
  Gauge(0,data.pos_data?.est_velocity, 0, 180, [5,0][d], [0,2][d], "Velocity", "m/s", radius, padding, xOffset, yOffset, visuals_color, background_color, container_color, middle, midb);
  Gauge(1,data.pos_data?.rel_altitude, 0, 1200, [5,1][d], [1,2][d], "Altitude", "m", radius, padding, xOffset, yOffset, visuals_color, background_color, container_color, middle, midb);
  Gauge(2,abs(data.bno_data?.rotation/360.0), 0, 1.5, [6,2][d], [0,2][d], "Rotation", "rps", radius, padding, xOffset, yOffset, visuals_color, background_color, container_color, middle, midb);
  if(d)Gauge(3,data.gps_data?.altitude, 0, 1200, [5,0][d], [2,3][d], "GPS Altitude", "m", radius, padding, xOffset, yOffset, visuals_color, background_color, container_color, middle, midb);
  
  mainTextBox(["CanSat FINALE", data.timestamp_gs+" CET", data.fsw_state?.state], [3,0][d], 0, 2, 2, 5, radius, padding, xOffset, yOffset, container_color, middle, midb);
  if(d)textBox(data.gps_data?.satellite, 10, 0, 3, [7,1][d], [0,3][d], 1, 1, true, "Satellite", "", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);
  textBox(data.bmp_data?.temperature, 0, 0, 4, [7,3][d], [0,2][d], 1, 1, false, "Temperature", "°C", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);

  bars([data.ina_data?.voltage,data.ina_data?.current], [9.3,0], [12.6,3], [6,2][d], [1,3][d], 2, 1, true, ["U","I","Power"], "V,A", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);
  //bars([abs(data.mpu_accel_x),abs(data.mpu_accel_y),abs(data.mpu_accel_z)], [0,0,0], [16,16,16], [6,2][d], [3,2][d], 2, 1, false, ["X","Y","Z","Acceleration"], "G", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);
     
  Graph(0, data.pos_data?.rel_altitude, 0, [0,4][d], [3,4][d], 2, 60, data.timestamp_gs, "Altitude", "m", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);
  Graph(1, data.pos_data?.est_velocity, 0, [2,6][d], [3,4][d], 2, 60, data.timestamp_gs, "Velocity", "m/s", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);
  if(!d)Graph(2, data.pos_data?.est_acceleration, [5,0][d], 2, 3, 2, 60, data.timestamp_gs, "Acceleration", "m/s²", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);

  ArtHor([data.fsw_state?.state, data.eject_output?.doors, data.eject_output?.payload, data.eject_output?.drogue, data.eject_output?.parachute], [data.board_status?.pwb_status, data.board_status?.cnb_status, data.board_status?.snb_status, data.board_status?.cmb_status],data.bno_data?.euler_p, data.bno_data?.euler_r, data.bno_data?.euler_h, [3,2][d], [2,0][d], 2, 2, "NAVBALL", radius, padding, xOffset, yOffset, container_color, middle, midb);

  /*textSize(radius / 10.0);
  fill(255);
  textAlign(LEFT, BOTTOM);
  text("Fps:" + round(frameRate()) + ":" + fps, width-100, height - 10);*/
  fps += round((frameRate() - fps) * 0.2);

  if(isPaused)pauseFade += (100 - pauseFade) * 0.1;
  else pauseFade += (0 - pauseFade) * 0.1;
  if(pauseFade < 2)pauseFade = 0;

  noStroke();
  fill(100,pauseFade);
  rect(-1,-1,width+2,height+2);
  fill(255,pauseFade);
  noStroke();
  textStyle(BOLD); 
  textSize(width/5);
  text("PAUSED",width/2, height/2);
  textStyle(NORMAL);
  
}
function windowResized(){
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function req() {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    if(!isLocal)xhr.open('GET', 'https://czechrockets.euweb.cz/get.php', true);
    else xhr.open('GET', 'http://gspi.local:8000/', true);
    try {
      xhr.send();
    } catch (error) {
      reject(error);
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          console.log(`Failed with status ${xhr.status}`);
          reject();
        }
      }
    };
  });
}

function keyPressed() {
  if (key === ' ') {
    isPaused = !isPaused;
    if(isPaused)passPauseOnChange = -1;
  }
  if(key === 'o' || key === 'O')autoPauseOverride = !autoPauseOverride;
}

function compareJSON(obj1, obj2) {
  // Convert objects to sorted JSON strings
  const sortedObj1 = JSON.stringify(obj1);
  const sortedObj2 = JSON.stringify(obj2);//Object.keys(obj2).sort()

  // Compare the sorted JSON strings
  return sortedObj1 === sortedObj2;
}

function startGSTimer(sTime) {
  let seconds = 0;
  timerGs = setInterval(() => {
      seconds++;
      if (seconds >= 3) {
        if(sTime == data.timestamp_gs)LOSgs = true;
        timerGsRun = false;
        clearInterval(timerGs); // Stop the timer
      }
  }, 1000); // Run every second
}
function startRCTimer(sData) {
  let seconds = 0;
  timerRc = setInterval(() => {
      seconds++;
      if (seconds >= 3) {
        if(compareJSON(sData, tempData))LOSrc = true;
        timerRcRun = false;
        clearInterval(timerRc); // Stop the timer
      }
  }, 1000); // Run every second
}