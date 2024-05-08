p5.disableFriendlyErrors = true;

let fade = [255,255,255,255];
var blink = false, shortBlink = false;

function ArtHor(eject, boardState, pitch, roll, yaw, x, y, w, h, name, rad, padding, xOffset, yOffset, contc, middle, midb) {
  x = (x*(rad + xOffset))+padding;
  y = (y*(rad + yOffset))+padding;
  w = w*(rad + xOffset)-xOffset;
  h = h*(rad + yOffset)-yOffset;

  if(midb)x+=middle;
  else y+=middle;

  pitch += 90;

  fill(contc);
  stroke(contc+10);
  strokeWeight(2);
  rect(x,y,w,h,5);
  strokeWeight(1);

  //pitch = ((mouseY/height)-0.5)*-800+90;
  //roll = ((mouseX/width)-0.5)*-800;
  //yaw = ((mouseX/width)-0.5)*-800;

  noStroke();
  textAlign(CENTER, TOP);
  textSize(rad/10);
  fill(255);
  text(name, x + w/2, y+rad/30);
  

  let boxWidth = rad/2;
  let boxHeight = rad/4.2;
  let boxPadding = rad/18;

  //"ptch: "+round(abs((abs(pitch) % 180 > 90 ? 180 : 0)-(abs(pitch) % 180))*Math.sign(sin(radians(pitch))),1)+"°"

  fill(contc-8);
  rect(x+boxPadding/2, y+boxPadding/2,boxWidth, boxHeight+boxPadding/2, 5);

  textSize(rad/12);
  textAlign(LEFT, TOP);
  fill(255);
  noStroke();
  if(isNaN(pitch))fill(signalRed);
  text("ptch: "+round(pitch%360,1)+"°",x+boxPadding,y+boxPadding/1.5);
  fill(255);
  if(isNaN(roll))fill(signalRed);
  textAlign(LEFT,CENTER);
  text("roll: "+round(roll%360,1)+"°",x+boxPadding,y+rad/8+boxPadding/1.5);
  fill(255);
  if(isNaN(yaw))fill(signalRed);
  textAlign(LEFT, BOTTOM);
  text("yaw: "+round(yaw%360,1)+"°",x+boxPadding,y+rad/4+boxPadding/1.5);

  boxWidth = rad/3;
  boxHeight = rad/2;
  boxPadding = rad/30;

  let state = ["DRS", "CAN", "DRG", "PAR"];
  let cols = [color(106,132,251,50),color(231,76,60,50),color(241,196,15,50),color(46,204,102,50)];
  if(eject[0]>=3 || (eject[0] == 1 && !blink) || (eject[0] == 2 && shortBlink))cols[0]=color(106,132,251);
  if(eject[1]>=3 || (eject[1] == 1 && blink) || (eject[1] == 2 && !shortBlink))cols[1]=color(231,76,60);
  if(eject[2]>=3 || (eject[2] == 1 && !blink) || (eject[2] == 2 && shortBlink))cols[2]=color(241,196,15);
  if(eject[3]>=3 || (eject[3] == 1 && blink) || (eject[3] == 2 && !shortBlink))cols[3]=color(46,204,102);

  let ho = 2;
  let barh = ((boxHeight-boxPadding)-(ho*5))/4;

  textAlign(CENTER, CENTER);
  textSize(rad/12);
  strokeWeight(1);
  for(let i=0; i < 4; i++){
    let barOffset = ho + (barh+ho)*i;
    fill(cols[i]);
    noStroke();
    rect(x+w-boxPadding, y+h-boxHeight+barOffset,-boxWidth, barh, rad/35);
    fill(0);
    stroke(0);
    if(isNaN(eject[i])){
      fill(signalRed);
      stroke(signalRed);
    }
    text(state[i],x+w-boxPadding-boxWidth/2,y+h-boxHeight+barOffset+barh/1.8);
  }

  state = ["PWB", "CNB", "SNB", "CMB"];

  ho = 2;
  barh = ((boxHeight-boxPadding)-(ho*5))/4;

  textAlign(CENTER, CENTER);
  textSize(rad/12);
  strokeWeight(1);
  for(let i=0; i < 4; i++){
    let barOffset = ho + (barh+ho)*i;
    fill(231,76,60,50);
    if(round(boardState[i]) == 1)fill(46,204,102);
    noStroke();
    rect(x+boxPadding, y+h-boxHeight+barOffset,boxWidth, barh, rad/35);
    fill(0);
    stroke(0);
    if(isNaN(boardState[i])){
      fill(signalRed);
      stroke(signalRed);
    }
    text(state[i],x+boxPadding+boxWidth/2,y+h-boxHeight+barOffset+barh/1.8);
  }

  
  let pnan = false;
  let rnan = false;
  let ynan = false;
  if(isNaN(pitch)){
    pitch = 90;
    pnan = true;
  }
  if(isNaN(roll)){
    roll = 0;
    rnan = true;
  }
  if(isNaN(yaw)){
    yaw = 0;
    ynan = true;
  }

  rad = (rad*2) - rad/1.5;
  let centX = x+w/2;
  let centY = y+h/2-h/64;

  //Grey circle
  fill(contc-6);
  stroke(contc-8);
  strokeWeight(3);
  circle(centX,centY,rad+rad/4);
  //Blue circle
  noStroke();
  fill(50,110,240);
  circle(centX,centY,rad);

  push();

    translate(centX,centY);

    //Main colored shape
    let hh = (rad / 2) * cos(radians(90));
    let lh = sqrt(sq(rad / 2) - sq(hh));

    let Zchange = 0;
    let tx1=0, ty1=0, tx2=0, ty2=0;
    let loopTillUnder = true;
    let addToFor = 0;
    let poleDetect = false;

    noStroke();
    fill(129,76,30);  
    beginShape();
    for (let theta = 0; theta <= TWO_PI+addToFor; theta += PI/20) {
      let x = lh * cos(theta);
      let y = hh;
      let z = lh * sin(theta);

      let rotatedRX = x * cos(radians(roll)) - y * sin(radians(roll));
      let rotatedRY = x * sin(radians(roll)) + y * cos(radians(roll));

      let rotatedRPY = z * sin(radians(pitch)) + rotatedRY * cos(radians(pitch));
      let rotatedRPZ = z * cos(radians(pitch)) - rotatedRY * sin(radians(pitch));


      if(rotatedRPZ<-10 || addToFor>TWO_PI)loopTillUnder = false;
      if(addToFor>TWO_PI)poleDetect = true;
      if(loopTillUnder){
        addToFor += PI/20;
        continue;
      }
      

      if(Math.sign(Zchange) > Math.sign(rotatedRPZ+10)){
        tx1 = rotatedRX;
        ty1 = rotatedRPY;
      }
      if(Math.sign(Zchange) < Math.sign(rotatedRPZ+10)){
        tx2 = rotatedRX;
        ty2 = rotatedRPY;
      }
      Zchange = Math.sign(rotatedRPZ+10);


      if(rotatedRPZ>-10)vertex(rotatedRX, rotatedRPY);
    }

    ta1 = atan2(ty1,tx1);
    ta2 = atan2(ty2,tx2);

    ta1 = angleFromXYA(tx1,ty1,ta1)-HALF_PI;
    ta2 = angleFromXYA(tx2,ty2,ta2)-HALF_PI;

    startA = ta1;
    endA = (startA-ta2);
    
    if(endA<0)endA += TWO_PI;

    if(poleDetect){
      startA = 0;
      endA = TWO_PI;
    }

    for(let i=startA;i>startA-endA;i-=endA/15)vertex((rad/2) * cos(i), (rad/2) * sin(i));
    endShape();
    

    //Latitude lines
    noFill();
    strokeWeight(2);
    stroke(255);
    step = 3;
    for (let i = 0; i <= 9; i += step) {
      let la2 = i * 10;
      let h = (rad / 2) * cos(radians(la2));
      let l = sqrt(sq(rad / 2) - sq(h));

      for(let k=0;k<=1;k++){
        let p = createVector(0,0);
        let c = 0;
        for (let theta = 0; theta <= TWO_PI; theta += PI/20) {
            let x = l * cos(theta);
            let y = h;
            let z = l * sin(theta);

            let rotatedRX = x * cos(radians(roll * (k ? 1 : -1))) - y * sin(radians(roll * (k ? 1 : -1)));
            let rotatedRY = x * sin(radians(roll * (k ? 1 : -1))) + y * cos(radians(roll * (k ? 1 : -1)));

            let rotatedRPY = z * sin(radians(pitch)) + rotatedRY * cos(radians(pitch));
            let rotatedRPZ = z * cos(radians(pitch)) - rotatedRY * sin(radians(pitch));

            if(rotatedRPZ>-10 != !k){
              if(c > 0 && dist(p.x, p.y*(k-0.5)*2, rotatedRX, rotatedRPY*(k-0.5)*2) < rad/8)line(p.x, p.y*(k-0.5)*2, rotatedRX, rotatedRPY*(k-0.5)*2);
              p = createVector(rotatedRX,rotatedRPY);
              c++;
            }
        }
      }
    }

    //Longtitude lines
    stroke(255); 
    strokeWeight(2);
    step = 90;
    for (let i = 0; i < 360; i+=step) {
      beginShape();
      
      for (let phi = 0; phi <= PI; phi += PI/15) {
          let x = rad / 2 * sin(phi) * cos(radians(i + yaw));
          let y = rad / 2 * cos(phi);
          let z = rad / 2 * sin(phi) * sin(radians(i + yaw));

          // Apply roll rotation around the z-axis
          let rotatedRX = x * cos(radians(roll)) - y * sin(radians(roll));
          let rotatedRY = x * sin(radians(roll)) + y * cos(radians(roll));

          let rotatedRPY = z * sin(radians(pitch)) + rotatedRY * cos(radians(pitch));
          let rotatedRPZ = z * cos(radians(pitch)) - rotatedRY * sin(radians(pitch));


          if(rotatedRPZ>0)vertex(rotatedRX, rotatedRPY);
      }
      endShape();
    }

    //Pitch lines
    step = 90;
    for (let i = 0; i < 360; i+=step) {
      stroke(255); 
      noFill();

      for (let phi = 5; phi < 180; phi += 5) {
        beginShape();
        l = 24-(((phi/5) % 2)+1)*8;
        strokeWeight(l/12);
        for(let k=-l;k<=l;k++){
          let x = rad / 2 * sin(radians(phi)) * cos(radians(i + yaw + k));
          let y = rad / 2 * cos(radians(phi));
          let z = rad / 2 * sin(radians(phi)) * sin(radians(i + yaw + k));

          let rotatedRX = x * cos(radians(roll)) - y * sin(radians(roll));
          let rotatedRY = x * sin(radians(roll)) + y * cos(radians(roll));

          let rotatedRPY = z * sin(radians(pitch)) + rotatedRY * cos(radians(pitch));
          let rotatedRPZ = z * cos(radians(pitch)) - rotatedRY * sin(radians(pitch));

          if(rotatedRPZ>0)vertex(rotatedRX, rotatedRPY);
        }
        endShape();
      }
    }

    //Cicle around sphere
    stroke(255);
    noFill();
    strokeWeight((rad/500)*3);
    circle(0,0,rad+(rad/500)*3);

    //Compass circles
    step = 90;
    oh = rad/14;
    let letter = ["E","S","W","N"];
    
    textAlign(CENTER,CENTER);
    textSize(oh/1.2);
    for (let i = 0; i < 360; i+=step) {
      stroke(0);
      fill(0);
      strokeWeight(1);
      oh = rad/14;
      r = rad/2;

      let x = (r+oh) * sin(radians(90)) * cos(radians(i + yaw));
      let y = (r+oh) * cos(radians(90));
      let z = (r+oh) * sin(radians(90)) * sin(radians(i + yaw));

      let rotatedRX = x * cos(radians(roll)) - y * sin(radians(roll));
      let rotatedRY = x * sin(radians(roll)) + y * cos(radians(roll));

      let rotatedRPY = z * sin(radians(pitch)) + rotatedRY * cos(radians(pitch));
      let rotatedRPZ = z * cos(radians(pitch)) - rotatedRY * sin(radians(pitch));

      oh *= 1.5;
      let distance = (r + oh) * acos(r / (r + oh));
      let distDiv = ((r+oh)*TWO_PI) / ((r + oh)*4);

      let f = 0;
      if(rotatedRPZ*distDiv>-distance)f = 255;
      fade[round(i/90)] += ((f - fade[round(i/90)])*0.2);

      push()
        translate(rotatedRX, rotatedRPY);
        //rotate(roll);
        fill(255,fade[round(i/90)]);
        stroke(255,fade[round(i/90)]);
        circle(0, 0, oh);
        stroke(0,fade[round(i/90)]);
        fill(0,fade[round(i/90)]);
        text(letter[round(i/90)],0, 0);
      pop()
      
    }

  pop();

  //Crosshair at the end
  strokeWeight((rad/500)*5);
  stroke(80, 220, 60);
  noFill();
  let ll = rad/14;
  circle(centX,centY,rad/9);
  line(centX, centY+ll/2,centX,centY+ll);
  line(centX+ll,centY,centX+ll/2,centY);
  line(centX, centY-ll/2,centX,centY-ll);
  line(centX-ll,centY,centX-ll/2,centY);
  point(centX,centY);

  if(pnan && rnan && ynan){
    fill(0,150);
    noStroke();
    rect(x,y,w,h,5);
    fill(signalRed);
    textAlign(CENTER,CENTER);
    textSize(rad/3);
    text(signalString,x+w/2,y+h/2);
  }

}
setInterval(() => {
  blink = !blink
}, 300);

setInterval(() => {
  shortBlink = !shortBlink
}, 100);

function angleFromXYA(px,py,a){
  if(px > 0 && py > 0)return (a+HALF_PI);
  else if(px > 0 && py < 0)return (HALF_PI-(a*-1));
  else if(px < 0 && py > 0)return (a+HALF_PI);
  else if(px < 0 && py < 0)return ((HALF_PI+TWO_PI)-(a*-1));
  else return 0;
}

//Made by @tomas-pribyl