var addon = require('../native');
var fs = require('fs');

let cam = new addon.Webcam("/dev/video0");
console.log(cam.index);

console.time("captures");
for(var i = 0; i < 120; i++) {
    img = cam.capture();
    fs.writeFileSync(`capture-${i}.jpg`, Buffer.from(img));
}
console.timeEnd("captures");
