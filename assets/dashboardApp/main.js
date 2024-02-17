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
let colMode = -1;
let rd;
let img;
let isGetting = false;
let data = 0;

function preload() {
  img = loadImage('/assets/dashboardApp/crs_logo.png');
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  columnCount = 8; // X size of grid
  rowCount = 4; // Y size of grid
  padding = 15;
  yOffset = 10;
  xOffset = 10;
  middle = 0;
}

function draw() {

  if(colMode>=0){

    if(!isGetting){
      isGetting = true;
      req().then((e)=>{
        data = JSON.parse(e);
        console.log(data);
        isGetting = false;
      })
    }
      
      //This code resizes the grid according to the width and height. Good luck trying to understand it!
      radius = min( round((width-(padding*2)-((columnCount-1)*xOffset))/columnCount), round((height-(padding*2)-((rowCount-1)*yOffset))/rowCount) );
      middle = max((width-((columnCount*(radius + xOffset)-xOffset)+padding*2))/2,(height-((rowCount*(radius + yOffset)-yOffset)+padding*2))/2);
      if(round((width-(padding*2)-((columnCount-1)*xOffset))/columnCount) > round((height-(padding*2)-((rowCount-1)*yOffset))/rowCount))midb = true;
      else midb = false;

      background(background_color);

      Gauge(0,mouseX, 170, 0, 5, 0, "Velocity", "m/s", radius, padding, xOffset, yOffset, visuals_color, background_color, container_color, middle, midb);
      Gauge(1,mouseX, 1100, 0, 6, 0, "Altitude", "m", radius, padding, xOffset, yOffset, visuals_color, background_color, container_color, middle, midb);
      Gauge(2,mouseY*(1.5/height), 1.5, 0, 5, 1, "Rotation", "rps", radius, padding, xOffset, yOffset, visuals_color, background_color, container_color, middle, midb);
      Gauge(3,mouseX*(150/width), 150, 0, 6, 1, "Temperature", "°C", radius, padding, xOffset, yOffset, visuals_color, background_color, container_color, middle, midb);

      const dt = new Date();
      mainTextBox(["Sherpa DEMO1",dt.toLocaleTimeString()+" UTC",data.fsw_state], 3, 0, 2, 2, 5, radius, padding, xOffset, yOffset, container_color, middle, midb);
      textBox(round(mouseX/100), 0, width/200, 7, 0, 1, 1, "Satellite", "", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);
      textBox(round(mouseX/100), 0, width/200, 7, 1, 1, 1, "Satellite", "", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);

      bars([mouseX*(12.6/width),mouseX*(30/width)], [12.6,30], [9.3,0], 6, 2, 2, 1, true, ["U","I","Power"], "V,A", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);
      bars([mouseX*(200/width),mouseX*(200/width),mouseY*(400/height)], [300,300,300], [0,0,0], 6, 3, 2, 1, false, ["X","Y","Z","Acceleration"], "m/s²", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);
      
      Graph(0, height-mouseY, 0, 0, 3, 2, 30, "Altitude", "m", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);
      Graph(1, mouseX, 0, 2, 3, 2, 60, "Distance", "m", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);
      Graph(2, mouseY/10, 3, 2, 3, 2, 60, "Acceleration", "m/s²", radius, padding, xOffset, yOffset, visuals_color, container_color, middle, midb);

      //for(let k=0;k<rowCount;k++)for(let l=0;l<columnCount;l++)Graph(0, round(mouseX*(15/width)), l, k, 1, 1, radius, padding, xOffset, visuals_bgcolor, "Sattelites");
      textSize(radius / 10.0);
      fill(255);
      textAlign(LEFT, BOTTOM);
      text("Fps:" + round(frameRate()) + ":" + fps, width-100, height - 10);
      fps += round((frameRate() - fps) * 0.2);
  }
  else {
    rd = (width*height)/103680;
    background(15);
    strokeWeight(3);
    fill(240);
    stroke(lerpColor(color(240),color(0),0.1));
    rect(width/4,height/2-height/8,width/4-rd,height/4,rd);
    fill(30);
    stroke(lerpColor(color(30),color(120),0.1));
    rect(width/2+rd,height/2-height/8,width/4,height/4,rd);

    textAlign(CENTER,CENTER);
    textSize(rd*3);
    strokeWeight(1);
    stroke(0);
    fill(0);
    text("SVĚTLÝ REŽIM\nLIGHT MODE",width/4+width/8-rd,height/2);
    stroke(255);
    fill(255);
    text("TMAVÝ REŽIM\nDARK MODE",width/2+width/8+rd,height/2);
  }
}
function windowResized(){
  resizeCanvas(window.innerWidth, window.innerHeight);
}
function mouseClicked() {
  if(colMode<0){
    if(clickCheck(width/4,height/2-height/8,width/4-rd,height/4,rd)){
      colMode = 0;
      background_color = 250;
      visuals_color = color(56, 62, 200);
      container_color = color(167, 183, 251);
    }
    else if(clickCheck(width/2+rd,height/2-height/8,width/4,height/4,rd)){
      colMode=1;
      background_color = 15;
      visuals_color = color(106, 132, 251);
      container_color = color(30);
    }
  }
}
function clickCheck(x,y,w,h){
  if(mouseX>x && mouseX<x+w && mouseY>y && mouseY<y+h)return true;
  else return false;
}
function req() {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://czechrockets.euweb.cz/get.php', true);
    //xhr.open('GET', 'http://gspi.local:8000/', true);
    xhr.send();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let text = xhr.responseText;
          let realData = text.split("<!--WZ-REKLAMA-1.0IK-->")[1];
          resolve(realData);
        } else {
          reject(new Error(`Failed with status ${xhr.status}`));
        }
      }
    };
  });
}