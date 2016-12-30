function makeScreen(letterW, letterH, font, fadeRate) {
  var ascii = " `````````````````````....................~~~~~~~~~~~~~~~~^^^____--'''||||||||:::::\\\\\\/!!!**}}}}++;;;;<<<>[)7777?iiii11lllll\"\"\"rrrrIIvjJJo%%3333333CsuuYYYVVVn2f&&00000Oy$U4x69ZkkkkGwwhDDDDXXXXXXXX8Abbddddmmm@@@@pRgHH#EqQQQNNBBBBBBWWWWWWWWWWWWWWWWMMMMMMMMMM";

  var canvas = document.createElement('canvas');
  var real_context = canvas.getContext('2d');
  var buffer_canvas = document.createElement('canvas');
  var buffer = buffer_canvas.getContext('2d');
  fadeRate = Math.max(Math.min(fadeRate,1),0);

  $('body').append(canvas);

  var w = 0;
  var h = 0;
  var pixelW = 0;
  var pixelH = 0;
  var factorX = 0;
  var factorY = 0;
  var height_to_width_ratio = letterH/letterW;
  var pixels = [];

  function resetScreen() {
    pixelW = $(document).width();
    pixelH = $(document).height();
    w = Math.floor(pixelW/letterW)+1;
    h = Math.floor(pixelH/letterH)+1;
    factor = Math.min(pixelW,pixelH);
    factorX = Math.min(pixelW,pixelH)/letterW;
    factorY = Math.min(pixelW,pixelH)/letterH;
    if (pixelW/pixelH > 1) {
      screen.maxX = pixelW/pixelH;
      screen.maxY = 1
    } else {
      screen.maxX = 1
      screen.maxY = pixelH/pixelW;
    }
    canvas.height = buffer_canvas.height = pixelH;
    canvas.width = buffer_canvas.width = pixelW;

    console.log("W: "+w+" H: "+h);
    console.log("W: "+factorX+" H: "+factorY);
  }

  function hsl(h,s,l) {
    return "hsl("+h+","+s+"%,"+l+"%)";
  }
  function redraw() {
    buffer.fillStyle="rgba(0,0,0,"+fadeRate+")";
    buffer.fillRect(0,0,canvas.offsetWidth,canvas.offsetHeight);
    buffer.font=font;
    screen.callback(i);
    real_context.drawImage(buffer_canvas, 0, 0);
  }
  function drawPixel(x,y,value,color) {
    value = Math.max(0, value);
    if (value > 0) {
      x = letterW*x;
      y = letterH*(y+1);
      buffer.fillStyle=color;
      buffer.fillText(ascii[value], x,y);
    }
  }

  function convert_x(c) {
    return Math.floor(c*factorX);
  }
  function convert_y(c) {
    return Math.floor(c*factorY);
  }
  function convert_y_frac(c) {
    return c*factorY;
  }
  function convert_x_frac(c) {
    return c*factorX;
  }

  var screen = {
    pixels: pixels,
    draw: redraw,
    drawPixel: function(x,y,value,color) {
      y = convert_y(y);
      x = convert_x(x);
      drawPixel(x,y,value,color);
    },
    drawRound: function(x,y,r, color,value) {
      var start_y = Math.max(0, convert_y(y-r));
      var start_x = Math.max(0, convert_x(x-r));
      var end_y = convert_y(Math.min(y+r, screen.maxY));
      var end_x = convert_x(Math.min(x+r, screen.maxX));
      var dist = convert_y_frac(r);
      var dist2 = dist*dist;
      y = convert_y_frac(y);
      x = convert_x_frac(x);

      for(var cy = start_y; cy <= end_y; cy++) {
        for(var cx = start_x; cx <= end_x; cx++) {
          var dx = (cx-x);
          var dy = (cy-y)*height_to_width_ratio;
          var cur_dist2 = (dx*dx+dy*dy);
          if (cur_dist2 < dist2) {
            var cur_r = (dist2-cur_dist2)/dist2;
            drawPixel(cx,cy,
              Math.ceil(cur_r*value*2.55), 
              hsl(color,100,Math.min(100,value*0.8+(cur_r*30)))
            );
          }
        }
      }

      /* var cw = convert_x(r);
      var d = ch*ch
      for(var cy = y-ch; cy<y+ch; cy++) {
        for(var cx = x-cw; cx<x+cw; cx++) {
          var dx = (cx-x);
          var dy = (cy-y)*height_to_width_ratio;
          var cd = (dx*dx+dy*dy);
          if (cd < d) {
            drawPixel(cx,cy,
              Math.ceil((d-cd)/d*value*2.55), 
              hsl(color,100,Math.min(100,0.5+value*0.8+((d-cd)/d*10)))
            );
          }
        }
        } */
    },
    hsl: hsl,
    callback: function(i) {
    }
  }

  resetScreen();
  $(window).resize(resetScreen);

  var i = 0;
  setInterval(function() {
    redraw(i);
    i++;
  }, 30);
  return screen;
}
