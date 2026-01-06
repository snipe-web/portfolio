// === НАСТРОЙКИ ПОДКРУТКИ ===
// Укажи номер слота (1-8), который должен выпасть
const TARGET_SLOT = 2;
// ===========================

// Массив с названиями (для модалки), чтобы не парсить HTML
const prizes = [
    "Айфон 15",       // Слот 1
    "+550 к депозиту",    // Слот 2
    "Скидка 90%",     // Слот 3
    "Ничего :(",      // Слот 4
    "MacBook Pro",    // Слот 5
    "AirPods Max",    // Слот 6
    "Печенька",       // Слот 7
    "Tesla Model X"   // Слот 8
];

// Изображения дублируем для модалки (можно парсить, но так надежнее)
const images = [
    "https://img.icons8.com/color/96/gift--v1.png",
    "#",
    "https://img.icons8.com/color/96/discount--v1.png",
    "https://img.icons8.com/color/96/sad.png",
    "https://img.icons8.com/color/96/laptop--v1.png",
    "https://img.icons8.com/color/96/headphones.png",
    "https://img.icons8.com/color/96/cookie.png",
    "https://img.icons8.com/color/96/car--v1.png"
];

let isSpinning = false;
let currentRotation = 0;
const wheel = document.getElementById('wheel');
const spinButton = document.getElementById('spinButton');
const modalOverlay = document.getElementById('modalOverlay');
const modalPrizeText = document.getElementById('modalPrizeText');
const modalImage = document.getElementById('modalImage');

const SLOTS_COUNT = 8;
const SEGMENT_ANGLE = 360 / SLOTS_COUNT;

spinButton.addEventListener('click', () => {
    if (isSpinning) return;

    isSpinning = true;
    spinButton.disabled = true; // Отключаем кнопку, анимация hover пропадает

    // Расчет градусов (как в прошлом коде)
    const slotAngle = (TARGET_SLOT - 1) * SEGMENT_ANGLE + (SEGMENT_ANGLE / 2);
    const offsetToStop = 360 - slotAngle;
    const randomOffset = Math.floor(Math.random() * 20) - 10; // +/- 10 градусов рандом
    const fullSpins = 360 * 5; // 5 оборотов

    // Расчет поворота
    const currentMod = currentRotation % 360;
    const desiredPoint = offsetToStop + randomOffset;
    let rotationNeeded = desiredPoint - currentMod;

    if (rotationNeeded < 0) rotationNeeded += 360;

    // Крутим
    currentRotation += fullSpins + rotationNeeded;
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    // Ждем завершения анимации (5 секунд)
    setTimeout(() => {
        isSpinning = false;
        showModal();
    }, 5000);
});

function showModal() {
    // Подставляем данные в модалку
    const prizeIndex = TARGET_SLOT - 1;
    modalPrizeText.innerText = prizes[prizeIndex];
    modalImage.src = images[prizeIndex];

    // Показываем окно
    modalOverlay.classList.add('show');
}

function closeModal() {
    modalOverlay.classList.remove('show');
    // Если хочешь разрешить крутить снова, раскомментируй:
    spinButton.disabled = false;
}

// === ТВОЯ ЛОГИКА КОЛЕСА (БЕЗ ИЗМЕНЕНИЙ) ===
spinButton.addEventListener('click', () => {
    if (isSpinning) return;

    isSpinning = true;
    spinButton.disabled = true;

    const slotAngle = (TARGET_SLOT - 1) * SEGMENT_ANGLE + (SEGMENT_ANGLE / 2);
    const offsetToStop = 360 - slotAngle;
    const randomOffset = Math.floor(Math.random() * 20) - 10;
    const fullSpins = 360 * 5;

    const currentMod = currentRotation % 360;
    const desiredPoint = offsetToStop + randomOffset;
    let rotationNeeded = desiredPoint - currentMod;

    if (rotationNeeded < 0) rotationNeeded += 360;

    currentRotation += fullSpins + rotationNeeded;
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        isSpinning = false;
        showModal();
    }, 5000);
});

// === ОБНОВЛЕННАЯ МОДАЛКА (БЕЗОПАСНАЯ) ===
function showModal() {
    const prizeIndex = TARGET_SLOT - 1;

    // Ищем элементы. Если их нет в HTML — ошибки в консоли не будет
    const prizeTextElement = document.getElementById('modalPrizeText');
    const prizeImageElement = document.getElementById('modalImage');

    if (prizeTextElement) {
        prizeTextElement.innerText = prizes[prizeIndex];
    }

    if (prizeImageElement) {
        prizeImageElement.src = images[prizeIndex];
    }

    // Просто показываем само окно
    if (modalOverlay) {
        modalOverlay.classList.add('show');
    }
}


function showModal() {
    const prizeIndex = TARGET_SLOT - 1;
    const prizeTextElement = document.getElementById('modalPrizeText');
    const prizeImageElement = document.getElementById('modalImage');

    if (prizeTextElement) prizeTextElement.innerText = prizes[prizeIndex];
    if (prizeImageElement) prizeImageElement.src = images[prizeIndex];

    if (modalOverlay) {
        modalOverlay.classList.add('show');
        // Добавляем класс, который заморозит фон
        document.body.classList.add('modal-open');
    }
}


