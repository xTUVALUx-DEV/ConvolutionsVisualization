let img;
let kernel = [[1, 0, -1], [1, 0, -1], [1, 0, -1]]; // Example kernel (sharpen)

let s2sketch;

IMAGE_PADDING = 50;



var s1 = function( sketch ) {
  sketch.setup = function() {
    sketch.createCanvas(540, 196);
    sketch.noLoop();
  
    document.getElementById('imageUpload').addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          img = sketch.loadImage(e.target.result, () => {
            sketch.redraw();
            sketch.resizeCanvas(img.width, img.height);
            s2sketch.resizeCanvas(img.width, img.height);

            s2sketch.redraw();

          });
        };
        reader.readAsDataURL(file);
      }
    });
  }
  sketch.draw = function() {
    if (img) {
      sketch.image(img, 0, 0, sketch.width, sketch.height);
    }
  }
};

var s2 = function( sketch ) {
  sketch.setup = function() {
    sketch.createCanvas(540, 980);
    s2sketch = sketch;
    sketch.noLoop();
    document.getElementById('gridSize').addEventListener('change', function (e) {
      s2sketch.redraw();
    });


  }
  sketch.draw = function() {
    filterKernel = parseGrid();
    kernelSideSize = Math.floor(filterKernel.length / 2);

    if (img) {
      sketch.pixelDensity(1);
      sketch.image(img.get(), 0, 0, sketch.width, sketch.height);
      sketch.loadPixels();
      if(img.height != sketch.height || img.width != sketch.width) {
          sketch.resizeCanvas(img.width, img.height);
      }
      p = sketch.pixelDensity();
      prev_pixels = [...sketch.pixels];
      // Apply convolution to each pixel
      for (let x = 0; x < sketch.width * p; x++) {
        for (let y = 0; y < sketch.height * p; y++) {

          let rtotal = 0;
          let gtotal = 0;
          let btotal = 0;
          for (let i = -kernelSideSize; i <= kernelSideSize; i++) {
            for (let j = -kernelSideSize; j <= kernelSideSize; j++) {
              if(y + j < 0 || y + j > sketch.height){
                continue;                
              }
              if(x + i < 0 || x + i > sketch.width){
                continue;                
              }
              if(filterKernel[i + 1] == undefined) {
                continue;
              }
              if(filterKernel[i + 1][j + 1] == undefined) {
                continue;
              }

              let loc = (x + i + (y + j) * sketch.width) * 4 * p;
              let r = prev_pixels[loc];
              let g = prev_pixels[loc + 1];
              let b = prev_pixels[loc + 2];
              rtotal += r * filterKernel[i + 1][j + 1];
              gtotal += g * filterKernel[i + 1][j + 1];
              btotal += b * filterKernel[i + 1][j + 1];
            }
          }
          let loc = (x + y * sketch.width) * 4 * p;
          sketch.pixels[loc] = sketch.constrain(rtotal, 0, 255);
          sketch.pixels[loc + 1] = sketch.constrain(gtotal, 0, 255);
          sketch.pixels[loc + 2] = sketch.constrain(btotal, 0, 255);
          sketch.pixels[loc + 3] = 255;

        }
      }
      console.log(filterKernel);
      console.log(sketch.width);

      sketch.updatePixels();
    }
  };

}

new p5(s1);
new p5(s2);


