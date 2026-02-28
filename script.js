let waves = [];
let numWaves = 30;
let pointsPerWave = 200;
let mouseInfluenceRadius = 150;
let mouseStrength = 40;
let waveSpeed = 0.03;
let waveAmplitude = 25;

function setup() {
    let canvas = createCanvas(windowWidth, 3580);
    
    

    clear();
    
    smooth();
    initWaves();
}

function draw() {

    clear();
    

    stroke(245);
    strokeWeight(1.3);
    noFill();
    
    for (let w = 0; w < waves.length; w++) {
        beginShape();
        for (let p = 0; p < waves[w].length; p++) {
            let point = waves[w][p];
            
            let waveOffset = 0;
            waveOffset += sin(p * 0.08 + w * 0.6 + frameCount * waveSpeed) * waveAmplitude;
            waveOffset += sin(p * 0.25 + w * 1.1 + frameCount * 0.015) * (waveAmplitude * 0.4);
            
            let x = point.baseX + waveOffset;
            let y = point.baseY;
            
            let mouseDist = dist(mouseX, mouseY, x, y);
            if (mouseDist < mouseInfluenceRadius && mouseY > 0 && mouseY < 3580) {
                let force = map(mouseDist, 0, mouseInfluenceRadius, mouseStrength, 0);
                let dir = (x > mouseX) ? 1 : -1;
                x += force * dir;
            }
            
            vertex(x, y);
        }
        endShape();
    }
}

function initWaves() {
    waves = [];
    let margin = 80;
    let stepX = (width - margin * 2) / (numWaves - 1);
    
    for (let w = 0; w < numWaves; w++) {
        let wave = [];
        let baseX = margin + w * stepX;
        
        for (let p = 0; p <= pointsPerWave; p++) {
            let y = map(p, 0, pointsPerWave, margin, 3580 - margin);
            wave.push({
                baseX: baseX,
                baseY: y
            });
        }
        waves.push(wave);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, 3580);
    initWaves();
}