var graphList=[];
var  timeList=[];
var timeCount=[];
var maxGaugeList=[];
let uc = 0;

function textBox(value, mx, mn, x, y, w, h, name, unit, rad, padding, xOffset, yOffset, vc, contc, middle, midb) {
  x = (x*(rad + xOffset))+padding;
  y = (y*(rad + yOffset))+padding;
  w = w*(rad + xOffset)-xOffset;
  h = h*(rad + yOffset)-yOffset;
  let valLen = max(str(mx).length, str(mn).length) + unit.length;
  let textCol = colMode * 255;
  let lerpCol = colMode * 120;

  if(midb)x+=middle;
  else y+=middle;

  fill(contc);
  stroke(lerpColor(contc,color(lerpCol),0.1));
  strokeWeight(2);
  rect(x,y,w,h,5);
  strokeWeight(1);

  fill(textCol);
  noStroke();
  textAlign(CENTER,TOP);
  textSize(rad/10);
  text(name, x+w/2,y+3);

  fill(min(map(value,mn,mx,0,255*2),255),min(255*2-map(value,mn,mx,0,255*2),255),0);
  textAlign(CENTER,CENTER);
  textSize(min(w/(valLen/1.2),h));
  text(format(value," ")+unit,x+w/2,y+h/2+h/16);
  //text(round(min(map(value,mn,mx,0,255*2),255))+":"+round(min(255*2-map(value,mn,mx,0,255*2),255)),x+w/2,y+h/2+h/4);
}

function Gauge(index, value, mx, mn, x, y, name, unit, rad, padding, xOffset, yOffset, vc, bg, contc, middle, midb) {
  if (maxGaugeList.length - 1 < index)maxGaugeList.push(mn);
  x = x*(rad + xOffset) + rad/2 + padding;
  y = y*(rad + yOffset) + rad/2 + padding;
  let showValue = PI-map(min(value,mx), mn, mx, 0, -PI);
  let textCol = colMode * 255;
  let lerpCol = colMode * 120;

  if(midb)x+=middle;
  else y+=middle;
  
  maxGaugeList[index] = round(max(maxGaugeList[index],value),2);

  fill(contc);
  stroke(lerpColor(contc,color(lerpCol),0.1));
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
  fill(textCol);
  arc(x, y, (rad*1.1) / 1.2, rad*1.1, showValue-PI/128, showValue+PI/64);
  strokeWeight(1);
  fill(contc);
  arc(x, y, (rad / 1.2)/1.1, rad/1.1, -PI-PI/32, 0+PI/32);

  noStroke();
  textAlign(CENTER, CENTER);
  textSize(rad / 5.0);
  fill(textCol);
  text(format(value), x, y - rad / 8);
  textSize(rad / 10.0);
  text(name+" ["+unit+"]", x, y);
  fill(max(textCol-55,55));
  textSize(rad / 13.0);
  text("max: "+maxGaugeList[index], x, y + rad/9.5);
}

function bars(value, mx, mn, x, y, w, h, rev, name, unit, rad, padding, xOffset, yOffset, vc, contc, middle, midb) {
  let offset = rad/15;
  let rows = value.length;
  let bar = (rows*8)*(w/2)/(h);
  let Yoffset = (20/rows)*(rad/300);
  let Xoffset = (6/rows)*(rad/300);
  let dim = 0;
  let textCol = colMode * 255;
  let lerpCol = colMode * 120;

  x = (x*(rad + xOffset))+padding;
  y = (y*(rad + yOffset))+padding;
  w = w*(rad + xOffset)-xOffset;
  h = h*(rad + yOffset)-yOffset;
  rad = max(rad,0);

  if(midb)x+=middle;
  else y+=middle;

  fill(contc);
  stroke(lerpColor(contc,color(lerpCol),0.1));
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
  textSize(rad/12);
  textAlign(CENTER,CENTER);
  fill(textCol);
  text(name[name.length-1]+" ["+unit+"]", x+w/2, y-offset*1.5);

  for(let i=0;i<rows;i++){
    for(let k=0;k<bar;k++){
      fill(30);
      rect(x+columnWidth*k+k*Xoffset,y+rowHeight*i+i*Yoffset,columnWidth,rowHeight,(rowHeight/columnWidth)*(rad/225.0));
      if(round((bar/(mx[i]-mn[i]))*(value[i]-mn[i]))<=k)dim = 300/(colMode+2);
      else dim = 255;
      if(!rev)fill(min(k*(510/bar),255),min((bar-k)*(510/bar),255),0,dim);
      else fill(min((bar-k)*(510/bar),255),min((bar-(bar-k))*(510/bar),255),0,dim);
      rect(x+columnWidth*k+k*Xoffset,y+rowHeight*i+i*Yoffset,columnWidth,rowHeight,(rowHeight/columnWidth)*(rad/225.0));
    }
    fill(textCol);
    textAlign(CENTER,CENTER);
    text(name[i], x-offset*2, y+rowHeight*i+i*Yoffset+rowHeight/2)
    textAlign(CENTER,CENTER);
    text(format(value[i]), x+w+offset*2, y+rowHeight*i+i*Yoffset+rowHeight/2)
  }
}

function Graph(index, value, x, y, w, h, timeFrame, name, unit, rad, padding, xOffset, yOffset, vc, contc, middle, midb) {
  if (graphList.length - 1 < index)graphList.push([]);
  if (timeList.length - 1 < index)timeList.push([]);
  if (timeCount.length - 1 < index)timeCount.push(0);
  let maxVal = value;
  let minVal = value;
  let div = 1;
  let range = 1;
  let offset = rad/5;
  let repNum = 0;
  let textCol = colMode * 255;
  let lerpCol = colMode * 120;

  x = (x*(rad + xOffset))+padding;
  y = (y*(rad + yOffset))+padding;
  w = w*(rad + xOffset)-xOffset;
  h = h*(rad + yOffset)-yOffset;

  if(midb)x+=middle;
  else y+=middle;
  
  fill(contc);
  stroke(lerpColor(contc,color(lerpCol),0.1));
  strokeWeight(2);
  rect(x,y,w,h,5);
  strokeWeight(1);

  
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(rad/10);
  fill(textCol);
  text(name+" ["+unit+"]", x + w/2, y + offset/2);

  x += offset;
  y += offset;
  w -= offset*2;
  h -= offset*2;
  w = max(w,1);

  let k = 0;
  while(timeFrame > endTime(k,w))k++;
  if(timeFrame-endTime(k-1,w) > endTime(k,w)-timeFrame)repNum = k;
  else repNum = k-1;

  const d = new Date();
  if(timeCount[index] >= repNum)
  {
    graphList[index].unshift(value);
    timeList[index].unshift(d.toLocaleTimeString());
    timeCount[index]=0;
  }
  else timeCount[index]++;

  while(graphList[index].length > w)graphList[index].pop();
  while(timeList[index].length > w)timeList[index].pop();
  maxVal = max(graphList[index]);
  minVal = min(graphList[index]);

  if (maxVal - minVal < 2) {
    maxVal = value+2;
    minVal = value-2;
  }

  range = maxVal - minVal;
  div = range / h;

  strokeWeight(2);
  for (let i = graphList[index].length - 1; i > 0; i--) {
    //stroke((graphList[index][i] - minVal) * (255.0 / range), 0, 255 - ((graphList[index][i] - minVal) * (255.0 / range)));
    stroke(vc);
    line(
      i + x,     (h - (graphList[index][i] - minVal) / div) + y,
      i - 1 + x, (h - (graphList[index][i - 1] - minVal) / div) + y
    );
  }

  noStroke();
  textSize(rad / 15.0);
  textAlign(RIGHT, CENTER);
  text(format(maxVal), x - 2, y);
  text(format(minVal + range / 2.0 + range / 4.0), x - 2,  y + h/2 - h/4);
  text(format(minVal + range / 2.0), x - 2, y + h/2);
  text(format(minVal + range / 2.0 - range / 4.0), x - 2,  y + h/2 + h/4);
  text(format(minVal), x - 2, y + h);

  textAlign(CENTER,TOP);
  text(listCheck(timeList[index],floor(w-1)),x+w,y+h+5);
  text(listCheck(timeList[index],round(w/2)),x+w/2,y+h+5);
  text(listCheck(timeList[index],round(w/4)),x+w/4,y+h+5);
  text(listCheck(timeList[index],round(w/2+w/4)),x+w/2+w/4,y+h+5);
  textAlign(LEFT,BOTTOM);
  text("-"+round(endTime(repNum,w))+"s",x+w,y);

  stroke(textCol,10);
  line(x, y + h/2 - h/4, x + w, y + h/2 - h/4);
  line(x, y + h/2, x + w, y + h/2);
  line(x, y + h/2 + h/4, x + w, y + h/2 + h/4);

  line(x+w/4, y, x+w/4, y+h);
  line(x+w/2, y, x+w/2, y+h);
  line(x+w/2+w/4, y, x+w/2+w/4, y+h);

}
function mainTextBox(value, x, y, w, h, divValue, rad, padding, xOffset, yOffset, contc, middle, midb) {
  x = (x*(rad + xOffset))+padding;
  y = (y*(rad + yOffset))+padding;
  w = w*(rad + xOffset)-xOffset;
  h = h*(rad + yOffset)-yOffset;
  let textCol = colMode * 255;
  let lerpCol = colMode * 120;
  fsws = "";
  fswCol = 0;

  if(midb)x+=middle;
  else y+=middle;

  fill(contc);
  stroke(lerpColor(contc,color(lerpCol),0.1));
  strokeWeight(2);
  rect(x,y,w,h,5);
  strokeWeight(1);

  if(value[2]==0){fsws = "INIT"; fswCol=color(241,196,15);}
  else if(value[2]==1){fsws = "READY"; fswCol=lerpColor(color(92,240,72),color(46,204,113),colMode);}
  else if(value[2]==2){fsws = "ARM"; fswCol=color(231,76,60);}
  else if(value[2]==3){fsws = "LIFTOFF"; fswCol=textCol;}
  else if(value[2]==4){fsws = "DESCENT"; fswCol=color(62,100,240)}
  else if(value[2]==5){fsws = "LANDED"; fswCol=lerpColor(color(92,240,72),color(46,204,113),colMode);}

  tint(255,25+(colMode*50));
  image(img, x, y,w,h);
  fill(textCol);
  noStroke();
  textAlign(CENTER,CENTER);
  textStyle(BOLD);
  textSize(rad/divValue);
  text(value[1],x+w/2,y+h/4-h/32);
  text(value[0],x+w/2,y+h/2);
  fill(fswCol);
  text("Status: "+fsws,x+w/2,y+h/2+h/4+h/32);
  textStyle(NORMAL)
}
function listCheck(array, index){
  if(array.length-1 < index)return "";
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

}