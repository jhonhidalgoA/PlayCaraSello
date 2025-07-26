let selectedChoice = null;
let gamesPlayed = 0;
let totalMoney = 0;
let gamesWon = 0;

function selectChoice(choice) {
    selectedChoice = choice;
    document.querySelectorAll('.choice-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById(choice + 'Btn').classList.add('selected');
}

function flipCoin() {
    if (!selectedChoice) {
        alert('Por favor, selecciona Cara o Sello');
        return;
    }

    const betAmount = parseInt(document.getElementById('betAmount').value);
    if (betAmount <= 0) {
        alert('Por favor, ingresa un valor de apuesta válido');
        return;
    }

    const coin = document.getElementById('coin');
    const resultMessage = document.getElementById('resultMessage');

    resultMessage.classList.remove('show');

    coin.classList.add('flipping');

    setTimeout(() => {
        const result = Math.random() < 0.5 ? 'cara' : 'sello';
        const won = result === selectedChoice;

        gamesPlayed++;
        if (won) {
            gamesWon++;
            totalMoney += betAmount;
        } else {
            totalMoney -= betAmount;
        }

        updateStats();
        showResult(won, result, betAmount);

        if (result === 'cara') {
            coin.style.transform = 'rotateY(0deg)';
        } else {
            coin.style.transform = 'rotateY(180deg)';
        }

        coin.classList.remove('flipping');
    }, 1000);
}

function showResult(won, result, betAmount) {
    const resultMessage = document.getElementById('resultMessage');
    const resultText = result === 'cara' ? 'CARA' : 'SELLO';

    if (won) {
        resultMessage.textContent = `¡Ganaste! Salió ${resultText}. +$${betAmount}`;
        resultMessage.className = 'result-message result-win show';
    } else {
        resultMessage.textContent = `Perdiste. Salió ${resultText}. -$${betAmount}`;
        resultMessage.className = 'result-message result-lose show';
    }
}

function updateStats() {
    document.getElementById('gamesPlayed').textContent = gamesPlayed;

    const moneyElement = document.getElementById('totalMoney');
    moneyElement.textContent = `$${totalMoney}`;
    moneyElement.className = 'stat-value ' + (totalMoney >= 0 ? 'money-positive' : 'money-negative');

    document.getElementById('gamesWon').textContent = gamesWon;

    const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
    document.getElementById('winRate').textContent = `${winRate}%`;
}

function newGame() {
    gamesPlayed = 0;
    totalMoney = 0;
    gamesWon = 0;
    selectedChoice = null;

    document.querySelectorAll('.choice-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('betAmount').value = 10;
    document.getElementById('resultMessage').classList.remove('show');
    document.getElementById('coin').style.transform = 'rotateY(0deg)';

    updateStats();
}

selectChoice('cara');