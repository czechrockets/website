p5.disableFriendlyErrors = true;

var graphList=[];
var  timeList=[];
var timeCount=[];
var maxGaugeList=[];
var signalString = "No Data";
var longBlink = false;

function textBox(value, mn, mx, div, x, y, w, h, mode, name, unit, rad, padding, xOffset, yOffset, vc, contc, middle, midb) {
  x = (x*(rad + xOffset))+padding;
  y = (y*(rad + yOffset))+padding;
  w = w*(rad + xOffset)-xOffset;
  h = h*(rad + yOffset)-yOffset;

  if(midb)x+=middle;
  else y+=middle;

  fill(contc);
  stroke(contc+10);
  strokeWeight(2);
  rect(x,y,w,h,5);
  strokeWeight(1);

  fill(255);
  noStroke();
  textAlign(CENTER,TOP);
  textSize(rad/10);
  text(name, x+w/2,y+3);

  if(mode)fill(min(map(value,mn,mx,0,255*2),255),min(255*2-map(value,mn,mx,0,255*2),255),0);
  else fill(vc);
  textAlign(CENTER,CENTER);
  textSize(rad/div);
  if(!isNaN(value))text(format(value,"")+unit,x+w/2,y+h/2+h/16);

  if(isNaN(value)){
    fill(0,150);
    noStroke();
    rect(x,y,rad,rad,5);
    fill(signalRed);
    textAlign(CENTER,CENTER);
    textSize(rad/5)
    text(signalString,x+w/2,y+h/2);
  }
}

function Gauge(index, value, mn, mx, x, y, name, unit, rad, padding, xOffset, yOffset, vc, bg, contc, middle, midb) {
  if (maxGaugeList.length - 1 < index)maxGaugeList.push(mn);
  x = x*(rad + xOffset) + rad/2 + padding;
  y = y*(rad + yOffset) + rad/2 + padding;
  let showValue = PI-map(cap(value,mn,mx), mn, mx, 0, -PI);

  if(midb)x+=middle;
  else y+=middle;
  
  if(!isNaN(value))maxGaugeList[index] = round(max(maxGaugeList[index],value),2);

  fill(contc);
  stroke(contc+10);
  strokeWeight(2);
  rect(x-rad/2,y-rad/2,rad,rad,5);

  y += rad/4;
  
  stroke(bg);
  strokeWeight(rad / 20.0);
  noFill();
  arc(x, y, rad / 1.2, rad, -PI, 0);
  stroke(vc);
  if(value>0.01+mn)arc(x, y, rad / 1.2, rad, -PI, showValue);
  noStroke();
  fill(255);
  arc(x, y, (rad*1.1) / 1.2, rad*1.1, showValue-PI/128, showValue+PI/64);
  strokeWeight(1);
  fill(contc);
  arc(x, y, (rad / 1.2)/1.1, rad/1.1, -PI-PI/32, 0+PI/32);

  noStroke();
  textAlign(CENTER, CENTER);
  textSize(rad / 5.0);
  fill(255);
  text(format(value), x, y - rad / 8);
  textSize(rad / 10.0);
  text(name+" ["+unit+"]", x, y);
  fill(200);
  textSize(rad / 13.0);
  text("max: "+maxGaugeList[index], x, y + rad/9.5);

  if(isNaN(value)){
    fill(0,150);
    noStroke();
    rect(x-rad/2,y-rad/2-rad/4,rad,rad,5);
    fill(signalRed);
    textAlign(CENTER,CENTER);
    textSize(rad/5)
    text(signalString,x,y-rad/4);
  }
}

function bars(value, mn, mx, x, y, w, h, rev, name, unit, rad, padding, xOffset, yOffset, vc, contc, middle, midb) {
  let offset = rad/15;
  let rows = value.length;
  let bar = (rows*8)*(w/2)/(h);
  let Yoffset = (20/rows)*(rad/300);
  let Xoffset = (6/rows)*(rad/300);
  let dim = 0;
  let nn = 0;
  let sz = (w+h)/2;

  x = (x*(rad + xOffset))+padding;
  y = (y*(rad + yOffset))+padding;
  w = w*(rad + xOffset)-xOffset;
  h = h*(rad + yOffset)-yOffset;
  rad = max(rad,0);

  if(midb)x+=middle;
  else y+=middle;

  fill(contc);
  stroke(contc+10);
  strokeWeight(2);
  rect(x,y,w,h,5);
  strokeWeight(1);

  if((value.length!=mx.length)||(value.length!=mn.length)||(value.length!=name.length-1)){
    if(second() % 2 == 0)fill(255,0,0,255);
    else fill(255,0,0,100);
    noStroke();
    textSize(w/15);
    textAlign(CENTER,CENTER);
    text("Arrays have different lengths!",x+w/2,y+h/2);
    return;
  }

  x += offset*4;
  y += offset*3;
  w -= offset*8;
  h -= offset*4;

  rowHeight = (h-(rows-1)*Yoffset)/rows;
  columnWidth = (w-(bar-1)*Xoffset)/bar;

  noStroke();
  textSize(rad/10);
  textAlign(CENTER,CENTER);
  fill(255);
  text(name[name.length-1]+" ["+unit+"]", x+w/2, y-offset*1.5);

  for(let i=0;i<rows;i++){
    for(let k=0;k<bar;k++){
      fill(30);
      rect(x+columnWidth*k+k*Xoffset,y+rowHeight*i+i*Yoffset,columnWidth,rowHeight,(rowHeight/columnWidth)*(rad/225.0));
      if(round((bar/(mx[i]-mn[i]))*(value[i]-mn[i]))<=k)dim = 100;
      else dim = 255;
      if(isNaN(value[i]))dim = 50;
      if(!rev)fill(min(k*(510/bar),255),min((bar-k)*(510/bar),255),0,dim);
      else fill(min((bar-k)*(510/bar),255),min((bar-(bar-k))*(510/bar),255),0,dim);
      rect(x+columnWidth*k+k*Xoffset,y+rowHeight*i+i*Yoffset,columnWidth,rowHeight,(rowHeight/columnWidth)*(rad/225.0));
    }
    fill(255);
    if(isNaN(value[i]))fill(signalRed);
    textAlign(CENTER,CENTER);
    text(name[i], x-offset*2, y+rowHeight*i+i*Yoffset+rowHeight/2)
    textAlign(CENTER,CENTER);
    text(format(value[i]), x+w+offset*2, y+rowHeight*i+i*Yoffset+rowHeight/2)
    if(isNaN(value[i]))nn++;
  }

  if(nn>=value.length){
    fill(0,150);
    noStroke();
    rect(x-offset*4,y-offset*3,w+offset*8,h+offset*4,5);
    fill(signalRed);
    textAlign(CENTER,CENTER);
    textSize((rad/5)*sz);
    text(signalString,x+w/2,y+h/2);
  }
}

function Graph(index, value, x, y, w, h, timeFrame, disTime, name, unit, rad, padding, xOffset, yOffset, vc, contc, middle, midb) {
  if (graphList.length - 1 < index)graphList.push([]);
  if (timeList.length - 1 < index)timeList.push([]);
  if (timeCount.length - 1 < index)timeCount.push(0);
  let maxVal = value;
  let minVal = value;
  let div = 1;
  let range = 1;
  let offset = rad/5;
  let repNum = 0;
  let sz = (w+h)/2;
  if(typeof disTime !== 'string')disTime = "";

  x = (x*(rad + xOffset))+padding;
  y = (y*(rad + yOffset))+padding;
  w = w*(rad + xOffset)-xOffset;
  h = h*(rad + yOffset)-yOffset;

  if(midb)x+=middle;
  else y+=middle;
  
  fill(contc);
  stroke(contc+10);
  strokeWeight(2);
  rect(x,y,w,h,5);
  strokeWeight(1);

  
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(rad/10);
  fill(255);
  text(name+" ["+unit+"]", x + w/2, y + offset/2);

  x += offset;
  y += offset;
  w -= offset*2;
  h -= offset*2;
  w = max(w,1);

  if(disTime == null || disTime.length < 1 || !disTime.includes(":"))disTime = new Date().toLocaleTimeString() + "1";
  else disTime += "0";

  let k = 0;
  while(timeFrame > endTime(k,w))k++;
  if(timeFrame-endTime(k-1,w) > endTime(k,w)-timeFrame)repNum = k;
  else repNum = k-1;

  if(timeCount[index] >= repNum && !isNaN(value) && !LOSpause)
  {
    graphList[index].unshift(value);
    timeList[index].unshift(disTime);
    timeCount[index]=0;
  }
  else timeCount[index]++;

  while(graphList[index].length > w)graphList[index].pop();
  while(timeList[index].length > w)timeList[index].pop();
  maxVal = max(graphList[index])+0.00001;
  minVal = min(graphList[index])-0.00001;

  range = maxVal - minVal;
  div = range / h;

  strokeWeight(2);
  for (let i = graphList[index].length - 1; i >= 0; i--) {
    //stroke((graphList[index][i] - minVal) * (255.0 / range), 0, 255 - ((graphList[index][i] - minVal) * (255.0 / range)));
    stroke(vc);
    line(
      i + x,     (h - (graphList[index][i] - minVal) / div) + y,
      i - 1 + x, (h - (graphList[index][i - 1] - minVal) / div) + y
    );
  }

  noStroke();
  fill(255);
  textSize(rad / 15.0);
  textAlign(RIGHT, CENTER);
  text(format(maxVal), x - 2, y);
  text(format(minVal + range / 2.0 + range / 4.0), x - 2,  y + h/2 - h/4);
  text(format(minVal + range / 2.0), x - 2, y + h/2);
  text(format(minVal + range / 2.0 - range / 4.0), x - 2,  y + h/2 + h/4);
  text(format(minVal), x - 2, y + h);

  let tmd = [color(255),color(241,196,76)];

  textAlign(CENTER,TOP);
  fill(tmd[parseInt(listCheck(timeList[index],floor(w-1)).slice(-1))]);
  text(listCheck(timeList[index],floor(w-1)).slice(0, -1),x+w,y+h+5);
  fill(tmd[parseInt(listCheck(timeList[index],round(w/2)).slice(-1))]);
  text(listCheck(timeList[index],round(w/2)).slice(0, -1),x+w/2,y+h+5);
  fill(tmd[parseInt(listCheck(timeList[index],round(w/4)).slice(-1))]);
  text(listCheck(timeList[index],round(w/4)).slice(0, -1),x+w/4,y+h+5);
  fill(tmd[parseInt(listCheck(timeList[index],round(w/2+w/4)).slice(-1))]);
  text(listCheck(timeList[index],round(w/2+w/4)).slice(0, -1),x+w/2+w/4,y+h+5);
  fill(255);
  textAlign(LEFT,BOTTOM);
  text("-"+round(endTime(repNum,w))+"s",x+w,y);

  stroke(255,10);
  line(x, y + h/2 - h/4, x + w, y + h/2 - h/4);
  line(x, y + h/2, x + w, y + h/2);
  line(x, y + h/2 + h/4, x + w, y + h/2 + h/4);

  line(x+w/4, y, x+w/4, y+h);
  line(x+w/2, y, x+w/2, y+h);
  line(x+w/2+w/4, y, x+w/2+w/4, y+h);

  if(isNaN(value)){
    fill(0,150);
    noStroke();
    rect(x-offset,y-offset,w+offset*2,h+offset*2,5);
    fill(signalRed);
    textAlign(CENTER,CENTER);
    textSize((rad/5)*sz)
    text(signalString,x+w/2,y+h/2);
  }
}
function mainTextBox(value, x, y, w, h, div, rad, padding, xOffset, yOffset, contc, middle, midb) {
  let fsws = ["INIT","READY","ARM","ASCENT", "APOGEE", "DESCENT","LANDING","LANDED","FAIL","UNKNOWN"];
  let fswCol = [color(241,196,15),color(46,204,102),color(231,76,60),color(255), color(0,220,250),color(62,100,240),color(241,196,15),color(46,204,102),color(231,76,60),color(150)];

  x = (x*(rad + xOffset))+padding;
  y = (y*(rad + yOffset))+padding;
  w = w*(rad + xOffset)-xOffset;
  h = h*(rad + yOffset)-yOffset;

  if(midb)x+=middle;
  else y+=middle;

  value[2] = round(value[2]);
  if(value[2] < 0 || value[2] > 8 || isNaN(value[2]))value[2] = 9;

  fill(contc);
  stroke(contc+10);
  strokeWeight(2);
  rect(x,y,w,h,5);
  strokeWeight(1);

  if(img){
    tint(255,100);
    image(img, x, y, w, h);
  }

  fill(255);
  noStroke();
  textAlign(CENTER,CENTER);
  textStyle(BOLD);
  textSize(rad/div);
  text(value[1],x+w/2,y+h/4-h/32);
  text(value[0],x+w/2,y+h/2-h/60);
  fill(fswCol[value[2]]);
  text("Status: "+fsws[value[2]],x+w/2,y+h/2+h/4);
  textSize(rad/(div*2));
  if(warningStatus.includes("data"))fill(46,204,102);
  else if(longBlink)fill(231,76,60);
  else fill(231,76,60,50);
  text("Signal status: "+warningStatus,x+w/2,y+h-h/12);
  fill(241,196,15);
  textSize(rad/(div*3));
  if(autoPauseOverride)text("(overridden)",x+w/2,y+h-h/32);
  textStyle(NORMAL)
  
}
function listCheck(array, index){
  if(array.length-1 < index)return "--:--:--0";
  else return array[index];
}

function endTime(input, w){
  return w/(1000.0/((1+input)*(1000.0/fps)));
}

function format(input, b=""){
  if(input == 0)return nf(input, 1, 2)+b;
  else if(input>=1000)return nf(input/1000, 1, 1)+b+"k";
  else if(input<1000 && input>=100)return nf(input, 3, 0)+b;
  else if(input<100 && input>=10)return nf(input, 2, 1)+b;
  else if(input<10 && input>=1)return nf(input, 1, 2)+b;
  else if(input<1 && input>-1)return nf(input, 0, 3)+b;
  else if(input<=-1 && input>-10)return nf(input, 1, 2)+b;
  else if(input<=-10 && input>-100)return nf(input, 2, 1)+b;
  else if(input<=-100 && input>-1000)return nf(input, 3, 0)+b;
  else if(input<=-1000)return nf(input/1000, 1, 1)+b+"k";
  else return "";
}

function cap(value,mn,mx){
  return max(min(value,mx),mn);
}

setInterval(() => {
  longBlink = !longBlink;
}, 750);

//Made by @tomas-pribyl