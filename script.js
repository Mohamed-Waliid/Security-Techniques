function openTab(evt, tabName) {
    let tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    let tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".tablinks").click();
});

// Rail-Fence
function encryptRail() {
    const text = document.getElementById("railText").value;
    const depth = parseInt(document.getElementById("railDepth").value);
    let rails = Array.from({ length: depth }, () => []);
    for (let i = 0; i < text.length; i++) {
        rails[i % depth].push(text[i]);
    }
    const result = rails.flat().join('');
    document.getElementById("railResult").textContent = "Encrypted: " + result;
}

function decryptRail() {
    const text = document.getElementById("railText").value;
    const depth = parseInt(document.getElementById("railDepth").value);
    const len = Math.ceil(text.length / depth);
    let grid = Array.from({ length: depth }, () => []);
    let idx = 0;
    for (let i = 0; i < depth; i++) {
        for (let j = 0; j < len; j++) {
            if (idx < text.length) {
                grid[i].push(text[idx++]);
            }
        }
    }
    let result = '';
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < depth; j++) {
            if (grid[j][i]) result += grid[j][i];
        }
    }
    document.getElementById("railResult").textContent = "Decrypted: " + result;
}

// Polyalphabetic
function encryptPoly() {
    const text = document.getElementById("polyInputText").value.toUpperCase();
    const key = document.getElementById("polyKey").value.toUpperCase();
    let result = "";

    for (let i = 0, j = 0; i < text.length; i++) {
        const c = text[i];
        if (c >= 'A' && c <= 'Z') {
            const code = ((c.charCodeAt(0) - 65 + (key[j % key.length].charCodeAt(0) - 65)) % 26) + 65;
            result += String.fromCharCode(code);
            j++;
        } else {
            result += c;
        }
    }
    document.getElementById("polyResult").textContent = "Encrypted: " + result;
}

function decryptPoly() {
    const text = document.getElementById("polyInputText").value.toUpperCase();
    const key = document.getElementById("polyKey").value.toUpperCase();
    let result = "";

    for (let i = 0, j = 0; i < text.length; i++) {
        const c = text[i];
        if (c >= 'A' && c <= 'Z') {
            const code = ((c.charCodeAt(0) - 65 - (key[j % key.length].charCodeAt(0) - 65) + 26) % 26) + 65;
            result += String.fromCharCode(code);
            j++;
        } else {
            result += c;
        }
    }
    document.getElementById("polyResult").textContent = "Decrypted: " + result;
}

// Playfair Cipher
function preparePlayfair(text) {
    text = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let output = '';
    for (let i = 0; i < text.length; i += 2) {
        let a = text[i], b = text[i + 1] || 'X';
        if (a === b) {
            output += a + 'X';
            i--;
        } else {
            output += a + b;
        }
    }
    return output;
}

function getPlayfairMatrix(keyword) {
    keyword = keyword.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let seen = new Set(), keyStr = '';
    for (let ch of keyword + 'ABCDEFGHIKLMNOPQRSTUVWXYZ') {
        if (!seen.has(ch)) {
            seen.add(ch);
            keyStr += ch;
        }
    }
    let matrix = [];
    for (let i = 0; i < 5; i++) {
        matrix.push(keyStr.slice(i * 5, i * 5 + 5).split(''));
    }
    return matrix;
}

function findPosition(matrix, ch) {
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            if (matrix[r][c] === ch) return [r, c];
        }
    }
}

function encryptPlayfair() {
    const text = preparePlayfair(document.getElementById("playfairText").value);
    const keyword = document.getElementById("playfairKey").value;
    const matrix = getPlayfairMatrix(keyword);
    let result = '';
    for (let i = 0; i < text.length; i += 2) {
        const [a, b] = [text[i], text[i + 1]];
        const [r1, c1] = findPosition(matrix, a);
        const [r2, c2] = findPosition(matrix, b);
        if (r1 === r2) {
            result += matrix[r1][(c1 + 1) % 5] + matrix[r2][(c2 + 1) % 5];
        } else if (c1 === c2) {
            result += matrix[(r1 + 1) % 5][c1] + matrix[(r2 + 1) % 5][c2];
        } else {
            result += matrix[r1][c2] + matrix[r2][c1];
        }
    }
    document.getElementById("playfairResult").textContent = "Encrypted: " + result;
}

function decryptPlayfair() {
    const text = document.getElementById("playfairText").value.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    const keyword = document.getElementById("playfairKey").value;
    const matrix = getPlayfairMatrix(keyword);
    let result = '';
    for (let i = 0; i < text.length; i += 2) {
        const [a, b] = [text[i], text[i + 1]];
        const [r1, c1] = findPosition(matrix, a);
        const [r2, c2] = findPosition(matrix, b);
        if (r1 === r2) {
            result += matrix[r1][(c1 + 4) % 5] + matrix[r2][(c2 + 4) % 5];
        } else if (c1 === c2) {
            result += matrix[(r1 + 4) % 5][c1] + matrix[(r2 + 4) % 5][c2];
        } else {
            result += matrix[r1][c2] + matrix[r2][c1];
        }
    }
    document.getElementById("playfairResult").textContent = "Decrypted: " + result;
}
