p5.disableFriendlyErrors = true;
document.title = "CRS Dashboard";

let columnCount;
let rowCount;
let padding;
let yOffset;
let xOffset;
let background_color;
let visuals_color;
let container_color;
let radius;
let middle;
let midb = false;
let fps = 0;
let img;
let isGetting = false;
let data = "";
let d = 0;
let isPaused = false;
let isLocal = false;

function preload() {
  img = loadImage('/assets/dashboardApp/crs_logo.png');
}
function setup() {
  createCanvas(windowWidth, windowHeight);

  background_color = 15;
  visuals_color = color(106, 132, 251);
  container_color = 30;

  columnCount = 8; // X size of grid
  rowCount = 4; // Y size of grid
  padding = 15;
  yOffset = 10;
  xOffset = 10;
  middle = 0;
}

function draw() {

  if(isPaused)return;

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

  let rat = (width + height)/2;
  xOffset = rat / 143;
  yOffset = rat / 143;
  padding = rat / 95;

  //For phone users
  if(width*1.02>height)d = 0;
  else d = 1;

  columnCount = [8,4][d];
  rowCount = [4,7][d];
  if(height/2>width)rowCount = 9;
      
  //This code resizes the grid according to the width and height. Good luck trying to understand it!
  radius = min( round((width-(padding*2)-((columnCount-1)*xOffset))/columnCount), round((height-(padding*2)-((rowCount-1)*yOffset))/rowCount) );
  middle = max((width-((columnCount*(radius + xOffset)-xOffset)+padding*2))/2,(height-((rowCount*(radius + yOffset)-yOffset)+padding*2))/2);
  if(round((width-(padding*2)-((columnCount-1)*xOffset))/columnCount) > round((height-(padding*2)-((rowCount-1)*yOffset))/rowCount))midb = true;
  else midb = false;

  background(background_color);
  
  Gauge(0,data.velocity, 0, 180, [5,0][d], 0, "Velocity", "m/s", radius, padding, xOffset, yOffset, visuals_color, background_color, container_color, middle, midb);
  Gauge(1,data.rel_alti, 0, 1200, [5,0][d], 1, "Altitude", "m", radius, padding, xOffset, yOffset, visuals_color, background_color, container_color, middle, midb);
  Gauge(2,abs(data.mpu_gyro_y/360), 0, 1.5, [6,3][d], 1, "Rotation", "rps", radius, padding, xOffset, yOffset, visuals_color, background_color, container_color, middle, midb);
  if(!d)Gauge(3,data.gps_alt, 0, 1200, 6, 0, "GPS Altitude", "m", radius, padding, xOffset, yOffset, visuals_color, background_color, container_color, middle, midb);
  
  mainTextBox(["Sherpa DEMO2", data.time+" CET", data.fsw_state, data.payload_released, data.drogue_released, data.parachute_released], [3,1][d], 0, 2, 2, 5, radius, padding, xOffset, yOffset, container_color, middle, midb);
  if(!d)textBox(data.gps_sat, 10, 0, 3, 7, 0, 1, 1, true, "Satellite", "", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);
  textBox(data.bmp_temp, 0, 0, 4, [7,3][d], [1,0][d], 1, 1, false, "Temperature", "°C", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);

  bars([data.ina_Voltage,data.ina_Curr], [9.3,0], [12.6,3000], [6,0][d], 2, 2, 1, true, ["U","I","Power"], "V,mA", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);
  bars([abs(data.mpu_accel_x),abs(data.mpu_accel_y),abs(data.mpu_accel_z)], [0,0,0], [16,16,16], [6,2][d], [3,2][d], 2, 1, false, ["X","Y","Z","Acceleration"], "G", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);
     
  Graph(0, data.rel_alti, 0, [0,3][d], [3,4][d], 2, 60, data.time, "Altitude", "m", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);
  Graph(1, data.velocity, 0, [2,5][d], [3,4][d], 2, 60, data.time, "Velocity", "m/s", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);
  if((height/2>width) || !d)Graph(2, -data.mpu_accel_y, [3,0][d], [2,7][d], [3,4][d], 2, 60, data.time, "Acceleration", "G", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);

  /*textSize(radius / 10.0);
  fill(255);
  textAlign(LEFT, BOTTOM);
  text("Fps:" + round(frameRate()) + ":" + fps, width-100, height - 10);*/
  fps += round((frameRate() - fps) * 0.2);
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
    if(isPaused)document.title = "CRS Dashboard (paused)";
    else document.title = "CRS Dashboard";
  }
}