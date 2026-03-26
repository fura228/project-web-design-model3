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

    const pieces = document.querySelectorAll('.piece');
    const dropZone = document.getElementById('drop-zone');
    const skullComplete = document.getElementById('skull-complete');
    let droppedCount = 0;
    const totalPieces = pieces.length;

    pieces.forEach(piece => {
        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
        });
    });

    dropZone.addEventListener('dragover', (e) => e.preventDefault());

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text');
        const draggedPiece = document.getElementById(id);
        
        if (draggedPiece && !draggedPiece.classList.contains('dropped')) {
            draggedPiece.classList.add('dropped'); // Прячем кусок
            droppedCount++;

            // Если все куски перенесены, показываем целую картинку
            if (droppedCount === totalPieces) {
                dropZone.style.border = 'none'; // Убираем рамку
                skullComplete.classList.remove('hidden'); // Показываем собранный череп
            }
        }
    });

 /* =========================================
       2. ИГРА В НАПЕРСТКИ (АГНОЗИЯ)
       ========================================= */
    const items = Array.from(document.querySelectorAll('.game-item-smooth'));
    const modal = document.getElementById('game-modal');
    const taskText = document.getElementById('game-task');
    const startBtn = document.getElementById('start-game-btn');
    
    let targetItem = '';
    let isPlaying = false;
    
    // Позиции в процентах для красивого центрирования (10%, 40%, 70%)
    const positions = ['10%', '40%', '70%']; 

    items.forEach((item, index) => {
        item.style.left = positions[index];
    });

    function startShellGame() {
        // Убеждаемся, что блюр снят перед началом новой игры, если это перезапуск
        items.forEach(item => {
            item.classList.remove('is-blurred', 'is-guessing');
        });

        const targets = ['cat', 'lamp', 'hat'];
        const names = {'cat': 'Кота', 'lamp': 'Лампу', 'hat': 'Шляпу'};
        targetItem = targets[Math.floor(Math.random() * targets.length)];
        taskText.innerText = `Найди: ${names[targetItem]}`;
        modal.classList.remove('hidden');
    }

    const observer = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && !isPlaying && modal.classList.contains('hidden')) {
            startShellGame();
        }
    });
    observer.observe(document.querySelector('.game-area-smooth'));

    startBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        isPlaying = true;
        
        // Накладываем жесткий блюр на время анимации (без возможности клика)
        items.forEach(item => item.classList.add('is-blurred'));

        let shuffles = 0;
        const shuffleInterval = setInterval(() => {
            let shuffledPositions = [...positions].sort(() => Math.random() - 0.5);
            
            items.forEach((item, index) => {
                item.style.left = shuffledPositions[index];
            });
            shuffles++;

            if(shuffles >= 6) { 
                clearInterval(shuffleInterval);
                setTimeout(() => {
                    // Анимация закончилась. Оставляем блюр, но разрешаем кликать!
                    items.forEach(item => {
                        item.classList.remove('is-blurred');
                        item.classList.add('is-guessing');
                        item.addEventListener('click', checkWin);
                    });
                }, 600);
            }
        }, 800);
    });

    function checkWin(e) {
        if(!isPlaying) return;
        isPlaying = false; // Блокируем двойные клики

        // Игрок сделал выбор! Снимаем блюр со ВСЕХ предметов, чтобы он увидел результат
        items.forEach(item => {
            item.classList.remove('is-guessing');
            item.removeEventListener('click', checkWin);
        });

        // Проверяем
        if(e.currentTarget.getAttribute('data-id') === targetItem) {
            // Небольшая задержка, чтобы юзер успел увидеть разблюренный предмет перед алертом
            setTimeout(() => alert('Верно! Это то, что нужно. Знаменитый случай невролога Оливера Сакса. Музыкант-профессионал с агнозией (неспособностью узнавать объекты) пытался надеть на голову собственную жену, приняв её за головной убор'), 300);
        } else {
            setTimeout(() => alert('Ошибка! Ты выбрал не тот предмет. Знаменитый случай невролога Оливера Сакса. Музыкант-профессионал с агнозией (неспособностью узнавать объекты) пытался надеть на голову собственную жену, приняв её за головной убор'), 300);
        }
        
        // Перезапуск через 2 секунды после результата
        setTimeout(startShellGame, 2000);
    }
    /* =========================================
       3. РАСПУТЫВАНИЕ КЛУБКА (ТЕРАПИЯ) - Эффект вытягивания
       ========================================= */
    const tangleSvg = document.getElementById('tangle-svg');
    const straightSvg = document.getElementById('straight-svg');
    const tangleContainer = document.getElementById('tangle-container');
    
    let clickCount = 0;
    const maxClicks = 5;

    tangleContainer.addEventListener('click', () => {
        if(clickCount < maxClicks) {
            clickCount++;
            
            // Клубок бледнеет
            tangleSvg.style.opacity = 1 - (clickCount / maxClicks);
            
            // Прямая линия "рисуется" (уменьшаем clip-path inset справа)
            const revealPercentage = 100 - (clickCount * (100 / maxClicks));
            straightSvg.style.clipPath = `inset(0 ${revealPercentage}% 0 0)`;
        }
    });
