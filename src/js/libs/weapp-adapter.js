// Web-compatible adapter - replaces WeChat mini-game APIs with web equivalents

// Canvas handling
if (typeof window.canvas === 'undefined') {
    window.canvas = document.getElementById('gameCanvas') || document.createElement('canvas');
}

// Touch event handling
const touchEvents = {
    touches: [],
    targetTouches: [],
    changedTouches: []
};

function createTouchEvent(type, e) {
    const touches = [];
    const changedTouches = [];
    
    if (e.touches) {
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            touches.push({
                clientX: touch.clientX,
                clientY: touch.clientY,
                identifier: touch.identifier
            });
        }
    }
    
    if (e.changedTouches) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            changedTouches.push({
                clientX: touch.clientX,
                clientY: touch.clientY,
                identifier: touch.identifier
            });
        }
    } else if (e.touches) {
        changedTouches.push(...touches);
    }
    
	      return {
        type,
        touches,
        targetTouches: touches,
        changedTouches,
        timeStamp: e.timeStamp || Date.now(),
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation()
    };
}

// Touch event listeners are handled directly in controller/index.js
// No need to set them up here to avoid infinite recursion

// Mock wx object for compatibility
if (typeof wx === 'undefined') {
    window.wx = {
        getSystemInfoSync: () => ({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1,
            platform: 'web'
        }),
        createCanvas: () => window.canvas,
        createImage: () => new Image(),
        createInnerAudioContext: () => {
            const audio = new Audio();
            return {
                src: '',
                play: () => audio.play(),
                pause: () => audio.pause(),
                stop: () => { audio.pause(); audio.currentTime = 0; },
                set src(value) { audio.src = value; },
                get src() { return audio.src; },
                set loop(value) { audio.loop = value; },
                get loop() { return audio.loop; },
                onCanplay: (cb) => { audio.addEventListener('canplay', cb); },
                onPlay: (cb) => { audio.addEventListener('play', cb); },
                onPause: (cb) => { audio.addEventListener('pause', cb); },
                onEnded: (cb) => { audio.addEventListener('ended', cb); },
                onError: (cb) => { audio.addEventListener('error', cb); }
            };
        },
        onTouchStart: (cb) => {
            window.canvas.addEventListener('touchstart', (e) => {
                cb(createTouchEvent('touchstart', e));
            });
        },
        onTouchMove: (cb) => {
            window.canvas.addEventListener('touchmove', (e) => {
                cb(createTouchEvent('touchmove', e));
            });
        },
        onTouchEnd: (cb) => {
            window.canvas.addEventListener('touchend', (e) => {
                cb(createTouchEvent('touchend', e));
            });
        },
        onTouchCancel: (cb) => {
            window.canvas.addEventListener('touchcancel', (e) => {
                cb(createTouchEvent('touchcancel', e));
            });
        },
        showToast: (options) => {
            if (window.showToast) {
                window.showToast(options.title || options.message || '', options.duration || 2000);
            }
        },
        showModal: (options) => {
            if (window.confirm) {
                const result = window.confirm(options.content || options.title || '');
                if (options.success) {
                    options.success({ confirm: result, cancel: !result });
                }
            }
        },
        onKeyboardConfirm: (cb) => {
            window.keyboardConfirmCallback = cb;
        },
        offKeyboardConfirm: () => {
            window.keyboardConfirmCallback = null;
        },
        showKeyboard: (options) => {
            if (window.showKeyboard) {
                window.showKeyboard({
                    value: options.value || '',
                    placeholder: options.placeholder || '请输入',
                    confirm: (result) => {
                        if (window.keyboardConfirmCallback) {
                            window.keyboardConfirmCallback(result);
                        }
                    }
                });
            }
        },
        hideKeyboard: () => {
            if (window.hideKeyboard) {
                window.hideKeyboard();
            }
        },
        getOpenDataContext: () => ({
            postMessage: () => {},
            canvas: window.canvas
        }),
        getSharedCanvas: () => window.canvas,
        getFriendCloudStorage: (options) => {
            // Mock empty friend data for web
            if (options.success) {
                options.success({ data: [] });
            }
        },
        onMessage: () => {},
        setUserCloudStorage: () => {},
        getStorageSync: (key) => {
            return localStorage.getItem(key);
        },
        setStorageSync: (key, value) => {
            localStorage.setItem(key, value);
        },
        removeStorageSync: (key) => {
            localStorage.removeItem(key);
        },
        clearStorageSync: () => {
            localStorage.clear();
        },
        getStorageInfoSync: () => {
            return {
                keys: Object.keys(localStorage)
            };
        }
    };
}

export default {};
