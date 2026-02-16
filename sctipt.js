import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- НАСТРОЙКИ ---
const modelPath = 'assets/game_ready_eye.glb'; 
const sensitive = 1.5;         // Чувствительность поворота глаза
const smoothness = 0.1;        // Плавность (0.01 - медленно, 1 - мгновенно)

// 1. Создаем сцену, камеру и рендерер
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0); // Цвет фона

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // Отодвигаем камеру назад

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Свет (чтобы модель была видна)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(2, 5, 5);
scene.add(dirLight);

// 3. Переменные для отслеживания мыши
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let eyeObject = null; // Сюда загрузится модель

// 4. Загрузка модели
const loader = new GLTFLoader();

loader.load(
    modelPath,
    function (gltf) {
        eyeObject = gltf.scene;
        
        // Настройка позиции/размера, если нужно
        // eyeObject.scale.set(2, 2, 2); 
        // eyeObject.position.y = -1;

        scene.add(eyeObject);
        console.log('Модель успешно загружена!');
    },
    undefined,
    function (error) {
        console.error('Ошибка загрузки:', error);
    }
);

// 5. Обработчик движения мыши
document.addEventListener('mousemove', (event) => {
    // Вычисляем положение мыши относительно центра экрана
    // Значения будут от -1 до 1 (примерно)
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;
});

// 6. Анимация (цикл рендеринга)
function animate() {
    requestAnimationFrame(animate);

    if (eyeObject) {
        // Вычисляем целевой угол поворота
        // Мышь влево (X меняется) -> Глаз крутится вокруг оси Y
        // Мышь вверх (Y меняется) -> Глаз крутится вокруг оси X
        let targetRotationY = mouseX * sensitive;
        let targetRotationX = mouseY * sensitive;

        // Плавное движение (Интерполяция)
        eyeObject.rotation.y += (targetRotationY - eyeObject.rotation.y) * smoothness;
        eyeObject.rotation.x += (targetRotationX - eyeObject.rotation.x) * smoothness;
    }

    renderer.render(scene, camera);
}
animate();

// 7. Обновление при изменении размера окна
window.addEventListener('resize', () => {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});