import "./js/libs/weapp-adapter.js";
import "./js/libs/symbol.js";
import Main from "./js/main.js";

// THREE.js is loaded via script tag before this module runs
// Ensure THREE is available globally for ES modules that reference it directly
// Note: Files using THREE should reference window.THREE or we need to declare it globally

// Get canvas element
const canvas = document.getElementById('gameCanvas');

// Prevent blur on high-resolution screens
canvas.height = window.innerHeight * 2;
canvas.width = window.innerWidth * 2;

// Set up global canvas reference
window.canvas = canvas;

// Prevent issues
if (typeof GameGlobal === 'undefined') {
    window.GameGlobal = {};
}
GameGlobal.ImageBitmap = () => {};

// Toast notification system
window.showToast = (message, duration = 2000) => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, duration);
};

// Keyboard input system
let keyboardCallback = null;
window.showKeyboard = (options = {}) => {
    const dialog = document.getElementById('inputDialog');
    const input = document.getElementById('inputField');
    dialog.style.display = 'block';
    input.value = options.value || '';
    input.placeholder = options.placeholder || '请输入';
    input.focus();
    input.select();
    
    keyboardCallback = options.confirm || null;
};

window.hideKeyboard = () => {
    const dialog = document.getElementById('inputDialog');
    dialog.style.display = 'none';
    keyboardCallback = null;
};

window.confirmInput = () => {
    const input = document.getElementById('inputField');
    if (keyboardCallback) {
        keyboardCallback({ value: input.value });
    }
    window.hideKeyboard();
};

// Handle Enter key in input
document.getElementById('inputField').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        window.confirmInput();
    }
});

// Handle Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        window.hideKeyboard();
    }
});

// Initialize game
new Main();
