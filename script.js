/* =========================================================
   PRM-7 // VYRA INCIDENT PROTOCOL
   GAME ENGINE
========================================================= */


/* =========================================================
   GAME STATE
========================================================= */

const gameState = {

    compromise: 55,

    /* A winning screen is valid only after every level is completed. */
    completedLevels: 0,

    level1: {

        timeLeft: 120,

        timer: null,

        placed: {},

        completed: false

    },

    level2: {

        timeLeft: 105,

        timer: null,

        classified: {},

        investigated: {},

        completed: false,

        anomalyFound: false

    },

    level3: {
        step: 0,
        completed: false
    },

    level4: {
        index: 0,
        score: 0,
        attempts: 0,
        completed: false
    },

    level5: {
        round: 1,
        pattern: [],
        patternInput: [],
        patternReady: false,
        patternCompleted: false,
        patternTimer: null,
        memoryFlipped: [],
        memoryMatched: [],
        memoryLocked: false,
        finalQuizIndex: 0,
        finalQuizScore: 0,
        finalQuizAttempts: 0,
        completed: false
    }

};


/* =========================================================
   HELPER
========================================================= */

function $(id) {

    return document.getElementById(id);

}


/* =========================================================
   SCREEN
========================================================= */

function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove(
                "active"
            );

        });


    const target =
        $(id);


    if (target) {

        target.classList.add(
            "active"
        );

    }

}


/* =========================================================
   TOP BAR
========================================================= */

function setTopLevel(text) {

    $("topLevel").textContent =
        text;

}


/* =========================================================
   COMPROMISE METER
========================================================= */

function updateCompromiseMeter() {

    const value =
        Math.max(
            0,
            Math.min(
                100,
                gameState.compromise
            )
        );


    gameState.compromise =
        value;


    $("compromiseValue")
        .textContent =
        `${value}%`;


    $("compromiseFill")
        .style.width =
        `${value}%`;


    const fill =
        $("compromiseFill");


    fill.classList.remove(
        "compromise-low",
        "compromise-mid",
        "compromise-high"
    );


    if (value <= 25) {

        fill.classList.add(
            "compromise-low"
        );

    }
    else if (value <= 55) {

        fill.classList.add(
            "compromise-mid"
        );

    }
    else {

        fill.classList.add(
            "compromise-high"
        );

    }


    if (value <= 25) {

        $("compromiseValue")
            .style.color =
            "var(--green)";

    }
    else if (value <= 55) {

        $("compromiseValue")
            .style.color =
            "var(--gold)";

    }
    else {

        $("compromiseValue")
            .style.color =
            "var(--red)";

    }

}


function changeCompromise(amount) {

    gameState.compromise +=
        amount;


    updateCompromiseMeter();

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

    const box =
        $("toast");


    box.textContent =
        message;


    box.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                box.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* =========================================================
   CITY
========================================================= */

function createCity() {

    const city =
        $("citySkyline");


    if (!city) {
        return;
    }


    city.innerHTML =
        "";


    const count =
        window.innerWidth <
        600
            ? 15
            : 25;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const building =
            document.createElement(
                "div"
            );


        building.className =
            "city-building";


        building.style.height =
            `${
                35 +
                Math.random() * 60
            }%`;


        city.appendChild(
            building
        );

    }

}


/* =========================================================
   PARTICLES
========================================================= */

function createParticles() {

    const layer =
        $("particleLayer");


    if (!layer) {
        return;
    }


    layer.innerHTML =
        "";


    const count =
        window.innerWidth <
        600
            ? 25
            : 42;


    const symbols = [
        "·",
        "✦",
        "◆",
        "▪",
        "✧"
    ];


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "ambient-particle";


        particle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.top =
            `${40 + Math.random() * 60}%`;


        particle.style.setProperty(
            "--moveX",
            `${Math.round(
                Math.random() * 100 - 50
            )}px`
        );


        particle.style.setProperty(
            "--duration",
            `${5 + Math.random() * 9}s`
        );


        particle.style.animationDelay =
            `${Math.random() * 7}s`;


        layer.appendChild(
            particle
        );

    }

}


/* =========================================================
   AUDIO
========================================================= */

let audioContext = null;


function ensureAudio() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (AudioContext) {

            audioContext =
                new AudioContext();

        }

    }


    if (
        audioContext &&
        audioContext.state === "suspended"
    ) {

        audioContext.resume();

    }

}


/* =========================================================
   SPARKLE SOUND
========================================================= */

function playSparkleSound() {

    ensureAudio();


    if (!audioContext) {
        return;
    }


    const now =
        audioContext.currentTime;


    const notes = [
        880,
        1175,
        1568
    ];


    notes.forEach(
        (frequency, index) => {

            const oscillator =
                audioContext.createOscillator();


            const gain =
                audioContext.createGain();


            const start =
                now +
                index * 0.05;


            oscillator.type =
                "sine";


            oscillator.frequency.value =
                frequency;


            gain.gain.setValueAtTime(
                0.0001,
                start
            );


            gain.gain.exponentialRampToValueAtTime(
                0.12,
                start + 0.02
            );


            gain.gain.exponentialRampToValueAtTime(
                0.001,
                start + 0.28
            );


            oscillator.connect(gain);

            gain.connect(
                audioContext.destination
            );


            oscillator.start(
                start
            );


            oscillator.stop(
                start + 0.3
            );

        }
    );

}


/* =========================================================
   ERROR SOUND
========================================================= */

function playErrorSound() {

    ensureAudio();


    if (!audioContext) {
        return;
    }


    const now =
        audioContext.currentTime;


    const oscillator =
        audioContext.createOscillator();


    const gain =
        audioContext.createGain();


    oscillator.type =
        "sawtooth";


    oscillator.frequency.setValueAtTime(
        190,
        now
    );


    oscillator.frequency.exponentialRampToValueAtTime(
        65,
        now + 0.28
    );


    gain.gain.setValueAtTime(
        0.001,
        now
    );


    gain.gain.exponentialRampToValueAtTime(
        0.14,
        now + 0.02
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.3
    );


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start();

    oscillator.stop(
        now + 0.31
    );

}


/* =========================================================
   SHORT GLITCH ALERT
   This replaces the irritating long siren.
========================================================= */

function playGlitchAlert() {

    ensureAudio();


    if (!audioContext) {
        return;
    }


    const now =
        audioContext.currentTime;


    /*
       First pulse
    */

    createAlertTone(
        520,
        0,
        0.15
    );


    createAlertTone(
        760,
        0.16,
        0.16
    );


    /*
       Second shorter pulse
    */

    createAlertTone(
        580,
        0.52,
        0.13
    );


    createAlertTone(
        820,
        0.66,
        0.15
    );

}


function createAlertTone(
    frequency,
    offset,
    duration
) {

    const oscillator =
        audioContext.createOscillator();


    const gain =
        audioContext.createGain();


    const start =
        audioContext.currentTime +
        offset;


    oscillator.type =
        "square";


    oscillator.frequency.value =
        frequency;


    gain.gain.setValueAtTime(
        0.001,
        start
    );


    gain.gain.exponentialRampToValueAtTime(
        0.055,
        start + 0.015
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        start + duration
    );


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start(
        start
    );


    oscillator.stop(
        start + duration
    );

}


/* =========================================================
   VYRA VOICE
========================================================= */

const voiceProfiles = {

    calm: {

        rate: 0.78,

        pitch: 0.60,

        volume: 1

    },


    serious: {

        rate: 0.70,

        pitch: 0.53,

        volume: 1

    },


    warning: {

        rate: 0.66,

        pitch: 0.48,

        volume: 1

    },


    final: {

        rate: 0.63,

        pitch: 0.46,

        volume: 1

    }

};


let availableVoices = [];


function loadVoices() {

    if (
        !("speechSynthesis" in window)
    ) {
        return;
    }


    availableVoices =
        window.speechSynthesis
            .getVoices();

}


loadVoices();


if (
    "speechSynthesis" in window
) {

    window.speechSynthesis.onvoiceschanged =
        loadVoices;

}


function chooseMaleVoice() {

    if (
        availableVoices.length === 0
    ) {

        loadVoices();

    }


    const english =
        availableVoices.filter(
            voice => {

                return (
                    voice.lang &&
                    voice.lang
                        .toLowerCase()
                        .startsWith("en")
                );

            }
        );


    if (!english.length) {

        return null;

    }


    const hints = [

        "male",
        "david",
        "mark",
        "daniel",
        "alex",
        "george",
        "james",
        "michael",
        "guy"

    ];


    const found =
        english.find(
            voice => {

                const name =
                    (
                        voice.name ||
                        ""
                    ).toLowerCase();


                return hints.some(
                    hint =>
                        name.includes(hint)
                );

            }
        );


    return found ||
        english[0];

}


function speakVYRA(
    text,
    mood = "calm"
) {

    if (
        !("speechSynthesis" in window)
    ) {
        return;
    }


    try {

        window.speechSynthesis.cancel();


        const profile =
            voiceProfiles[mood] ||
            voiceProfiles.calm;


        const utterance =
            new SpeechSynthesisUtterance(
                text
            );


        utterance.lang =
            "en-US";


        utterance.rate =
            profile.rate;


        utterance.pitch =
            profile.pitch;


        utterance.volume =
            profile.volume;


        const voice =
            chooseMaleVoice();


        if (voice) {

            utterance.voice =
                voice;

        }


        window.speechSynthesis.speak(
            utterance
        );

    }
    catch (error) {

        console.warn(
            "VYRA voice unavailable:",
            error
        );

    }

}


function stopVYRA() {

    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis.cancel();

    }

}


/* =========================================================
   TIMER
========================================================= */

function stopTimer(level) {

    if (level === 1) {

        clearInterval(
            gameState.level1.timer
        );

        gameState.level1.timer =
            null;

    }


    if (level === 2) {

        clearInterval(
            gameState.level2.timer
        );

        gameState.level2.timer =
            null;

    }

}


function formatTime(seconds) {

    const minutes =
        Math.floor(
            seconds / 60
        );


    const remaining =
        seconds % 60;


    return (
        String(minutes)
            .padStart(2,"0")
        +
        ":"
        +
        String(remaining)
            .padStart(2,"0")
    );

}


function updateTimer(level) {

    const timer =
        level === 1
            ? $("level1Timer")
            : $("level2Timer");


    const state =
        level === 1
            ? gameState.level1
            : gameState.level2;


    timer.textContent =
        formatTime(
            state.timeLeft
        );


    if (
        state.timeLeft <= 15
    ) {

        timer.classList.add(
            "timer-danger"
        );

    }
    else {

        timer.classList.remove(
            "timer-danger"
        );

    }

}


/* =========================================================
   TIMER START
========================================================= */

function startLevelTimer(level) {

    stopTimer(level);


    updateTimer(level);


    const state =
        level === 1
            ? gameState.level1
            : gameState.level2;


    state.timer =
        setInterval(
            () => {

                state.timeLeft--;


                updateTimer(level);


                if (
                    state.timeLeft <= 0
                ) {

                    stopTimer(level);


                    failGame(
                        level === 1
                            ? "The architecture window closed before the secure path was completed."
                            : "The request channel timed out before the hidden signal was isolated."
                    );

                }

            },
            1000
        );

}


/* =========================================================
   CHANGE TIME
========================================================= */

function changeTime(
    level,
    amount
) {

    const state =
        level === 1
            ? gameState.level1
            : gameState.level2;


    state.timeLeft +=
        amount;


    if (
        state.timeLeft < 0
    ) {

        state.timeLeft =
            0;

    }


    updateTimer(level);

}


/* =========================================================
   LEVEL 1 START
========================================================= */

function startLevel1() {

    stopTimer(1);

    stopTimer(2);

    stopVYRA();


    gameState.level1.timeLeft =
        120;


    gameState.level1.placed =
        {};


    gameState.level1.completed =
        false;


    showScreen(
        "level1Screen"
    );


    setTopLevel(
        "LEVEL 01 // FIRST SIGNAL"
    );


    resetLevel1();


    shuffleComponents();


    startLevelTimer(1);


    setTimeout(
        () => {

            speakVYRA(
                "Build the secure path. Every unsafe choice makes me easier to compromise.",
                "serious"
            );

        },
        300
    );

}


/* =========================================================
   LEVEL 1 RESET
========================================================= */

function resetLevel1() {

    gameState.level1.placed =
        {};


    document
        .querySelectorAll(".path-slot")
        .forEach(
            slot => {

                const number =
                    Number(
                        slot.dataset.slot
                    ) + 1;


                slot.classList.remove(
                    "filled",
                    "drag-over"
                );


                slot.innerHTML = `

                    <span class="slot-number">

                        ${String(number)
                            .padStart(2,"0")}

                    </span>

                    <span class="slot-placeholder">

                        DROP COMPONENT

                    </span>

                `;

            }
        );


    document
        .querySelectorAll(".component")
        .forEach(
            component => {

                component.style.display =
                    "block";

                component.classList.remove(
                    "selected"
                );

            }
        );


    $("componentCount")
        .textContent =
        "0 / 5";


    $("progressFill")
        .style.width =
        "0%";


    $("level1Warning")
        .classList.add(
            "hidden"
        );


    $("deployBtn")
        .disabled =
        true;


    selectedComponent =
        null;

}


/* =========================================================
   SHUFFLE COMPONENTS
========================================================= */

function shuffleComponents() {

    const pool =
        $("componentPool");


    if (!pool) {
        return;
    }


    const components =
        Array.from(
            pool.querySelectorAll(
                ".component"
            )
        );


    for (
        let i = components.length - 1;
        i > 0;
        i--
    ) {

        const random =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            components[i],
            components[random]
        ] =
        [
            components[random],
            components[i]
        ];

    }


    components.forEach(
        component => {

            pool.appendChild(
                component
            );

        }
    );

}


/* =========================================================
   LEVEL 1 WARNINGS
========================================================= */

function getWarning(
    componentId,
    expected
) {

    const directWarnings = {

        "direct-db":
            "A user should log in before accessing the protected system.",

        "admin-panel":
            "Administrative access should not be exposed as a public entry point.",

        "unlimited-upload":
            "Untrusted files should be checked before entering protected storage."

    };


    if (
        directWarnings[componentId]
    ) {

        return directWarnings[
            componentId
        ];

    }


    const orderWarnings = {

        authentication:
            "A user should authenticate before accessing the system.",

        api:
            "Requests should pass through a controlled API gateway.",

        database:
            "Protected data should be reached through the controlled application path.",

        logging:
            "System activity should be recorded through the logging layer.",

        "file-validation":
            "Files should be validated before entering protected storage."

    };


    return (
        orderWarnings[expected] ||
        "That component does not belong at this position in the secure path."
    );

}


/* =========================================================
   LEVEL 1 WRONG PLACEMENT
========================================================= */

function wrongPlacement(
    component,
    expected,
    x,
    y
) {

    $("warningText")
        .textContent =
        getWarning(
            component.dataset.id,
            expected
        );


    $("level1Warning")
        .classList.remove(
            "hidden"
        );


    /*
       WRONG:
       +12 compromise
       -15 seconds
    */

    changeCompromise(
        12
    );


    changeTime(
        1,
        -15
    );


    playErrorSound();


    createErrorEmojis(
        x,
        y
    );


    $("errorFlash")
        .classList.remove(
            "active"
        );


    void $("errorFlash").offsetWidth;


    $("errorFlash")
        .classList.add(
            "active"
        );


    document.body.classList.remove(
        "red-alert"
    );


    void document.body.offsetWidth;


    document.body.classList.add(
        "red-alert"
    );


    showToast(
        "⚠ UNSAFE PATH // +12% COMPROMISE // −15 SEC"
    );


    setTimeout(
        () => {

            document.body.classList.remove(
                "red-alert"
            );

        },
        500
    );


    if (
        gameState.level1.timeLeft <= 0
    ) {

        failGame(
            "The unsafe choices consumed the remaining deployment window."
        );

    }

}


/* =========================================================
   SPARKLES
========================================================= */

function createSparkles(
    x,
    y
) {

    const symbols = [
        "✦",
        "✧",
        "◆",
        "·"
    ];


    for (
        let i = 0;
        i < 18;
        i++
    ) {

        const sparkle =
            document.createElement(
                "span"
            );


        sparkle.className =
            "sparkle";


        sparkle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        sparkle.style.left =
            `${x}px`;


        sparkle.style.top =
            `${y}px`;


        sparkle.style.setProperty(
            "--dx",
            `${Math.round(
                Math.random() * 150 - 75
            )}px`
        );


        sparkle.style.setProperty(
            "--dy",
            `${Math.round(
                Math.random() * 130 - 100
            )}px`
        );


        $("effectsLayer")
            .appendChild(
                sparkle
            );


        setTimeout(
            () => {

                sparkle.remove();

            },
            850
        );

    }


    playSparkleSound();

}


/* =========================================================
   ERROR EMOJIS
========================================================= */

function createErrorEmojis(
    x,
    y
) {

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const emoji =
            document.createElement(
                "div"
            );


        emoji.className =
            "error-emoji";


        emoji.textContent =
            "⚠️";


        emoji.style.left =
            `${x}px`;


        emoji.style.top =
            `${y}px`;


        emoji.style.setProperty(
            "--dx",
            `${Math.round(
                Math.random() * 150 - 75
            )}px`
        );


        emoji.style.setProperty(
            "--dy",
            `${Math.round(
                Math.random() * 140 - 100
            )}px`
        );


        document.body.appendChild(
            emoji
        );


        setTimeout(
            () => {

                emoji.remove();

            },
            900
        );

    }

}


/* =========================================================
   COMPONENT DRAG SYSTEM
========================================================= */

let selectedComponent =
    null;


let dragState =
    null;


function setupDragSystem() {

    document
        .querySelectorAll(".component")
        .forEach(
            component => {

                component.addEventListener(
                    "pointerdown",
                    event => {

                        beginDrag(
                            event,
                            component
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(".path-slot")
        .forEach(
            slot => {

                slot.addEventListener(
                    "click",
                    event => {

                        if (
                            selectedComponent
                        ) {

                            attemptPlacement(
                                selectedComponent,
                                slot,
                                event.clientX,
                                event.clientY
                            );

                        }
                        else {

                            showToast(
                                "SELECT A COMPONENT FIRST"
                            );

                        }

                    }
                );

            }
        );

}


function beginDrag(
    event,
    component
) {

    if (
        component.style.display ===
        "none"
    ) {

        return;

    }


    ensureAudio();


    const rect =
        component.getBoundingClientRect();


    dragState = {

        component,

        moved: false,

        startX:
            event.clientX,

        startY:
            event.clientY,

        offsetX:
            event.clientX -
            rect.left,

        offsetY:
            event.clientY -
            rect.top,

        ghost: null

    };


    component.dataset.dragging =
        "true";


    component.setPointerCapture?.(
        event.pointerId
    );


    window.addEventListener(
        "pointermove",
        moveDrag,
        { passive: false }
    );


    window.addEventListener(
        "pointerup",
        endDrag,
        { passive: false }
    );


    window.addEventListener(
        "pointercancel",
        endDrag,
        { passive: false }
    );


    event.preventDefault();

}


function moveDrag(event) {

    if (!dragState) {
        return;
    }


    const dx =
        event.clientX -
        dragState.startX;


    const dy =
        event.clientY -
        dragState.startY;


    if (
        Math.abs(dx) > 5 ||
        Math.abs(dy) > 5
    ) {

        dragState.moved =
            true;

    }


    if (
        !dragState.moved
    ) {

        return;

    }


    if (
        !dragState.ghost
    ) {

        const ghost =
            dragState.component.cloneNode(
                true
            );


        ghost.classList.add(
            "drag-ghost"
        );


        ghost.style.width =
            `${dragState.component.offsetWidth}px`;


        ghost.style.height =
            `${dragState.component.offsetHeight}px`;


        document.body.appendChild(
            ghost
        );


        dragState.ghost =
            ghost;

    }


    dragState.ghost.style.left =
        `${event.clientX -
          dragState.offsetX}px`;


    dragState.ghost.style.top =
        `${event.clientY -
          dragState.offsetY}px`;


    document
        .querySelectorAll(".path-slot")
        .forEach(
            slot => {

                const rect =
                    slot.getBoundingClientRect();


                const inside =
                    event.clientX >= rect.left &&
                    event.clientX <= rect.right &&
                    event.clientY >= rect.top &&
                    event.clientY <= rect.bottom;


                slot.classList.toggle(
                    "drag-over",
                    inside
                );

            }
        );


    event.preventDefault();

}


function endDrag(event) {

    if (!dragState) {
        return;
    }


    const state =
        dragState;


    dragState =
        null;


    if (
        state.ghost
    ) {

        state.ghost.remove();

    }


    document
        .querySelectorAll(".path-slot")
        .forEach(
            slot => {

                slot.classList.remove(
                    "drag-over"
                );

            }
        );


    state.component.dataset.dragging =
        "false";


    window.removeEventListener(
        "pointermove",
        moveDrag
    );


    window.removeEventListener(
        "pointerup",
        endDrag
    );


    window.removeEventListener(
        "pointercancel",
        endDrag
    );


    /*
       TAP
    */

    if (
        !state.moved
    ) {

        document
            .querySelectorAll(".component")
            .forEach(
                item => {

                    item.classList.remove(
                        "selected"
                    );

                }
            );


        state.component.classList.add(
            "selected"
        );


        selectedComponent =
            state.component;


        showToast(
            "COMPONENT SELECTED // CHOOSE A SLOT"
        );


        return;

    }


    const element =
        document.elementFromPoint(
            event.clientX,
            event.clientY
        );


    const slot =
        element?.closest?.(
            ".path-slot"
        );


    if (slot) {

        attemptPlacement(
            state.component,
            slot,
            event.clientX,
            event.clientY
        );

    }

}


/* =========================================================
   PLACEMENT
========================================================= */

function attemptPlacement(
    component,
    slot,
    x,
    y
) {

    if (
        !component ||
        !slot
    ) {

        return;

    }


    const componentId =
        component.dataset.id;


    const expected =
        slot.dataset.expected;


    const slotNumber =
        slot.dataset.slot;


    if (
        gameState.level1.placed[
            slotNumber
        ]
    ) {

        return;

    }


    /*
       WRONG
    */

    if (
        componentId !== expected
    ) {

        wrongPlacement(
            component,
            expected,
            x,
            y
        );


        component.classList.remove(
            "selected"
        );


        selectedComponent =
            null;


        return;

    }


    /*
       CORRECT
    */

    gameState.level1.placed[
        slotNumber
    ] =
        componentId;


    component.classList.remove(
        "selected"
    );


    selectedComponent =
        null;


    slot.classList.add(
        "filled"
    );


    slot.innerHTML = `

        <span class="slot-number">

            ${String(
                Number(slotNumber)+1
            ).padStart(2,"0")}

        </span>


        <div>

            <span class="filled-name">

                ${component.dataset.name}

            </span>


            <span class="filled-status">

                CONNECTED

            </span>

        </div>

    `;


    component.style.display =
        "none";


    const rect =
        slot.getBoundingClientRect();


    createSparkles(
        rect.left +
        rect.width / 2,

        rect.top +
        rect.height / 2
    );


    /*
       Correct:
       compromise decreases.
    */

    changeCompromise(
        -3
    );


    updateLevel1Progress();

}


/* =========================================================
   LEVEL 1 PROGRESS
========================================================= */

function updateLevel1Progress() {

    const count =
        Object.keys(
            gameState.level1.placed
        ).length;


    $("componentCount")
        .textContent =
        `${count} / 5`;


    $("progressFill")
        .style.width =
        `${count * 20}%`;


    if (
        count === 5
    ) {

        $("deployBtn")
            .disabled =
            false;

    }

}


/* =========================================================
   DEPLOY LEVEL 1
========================================================= */

$("deployBtn")
    .addEventListener(
        "click",
        () => {

            const count =
                Object.keys(
                    gameState.level1.placed
                ).length;


            if (
                count !== 5
            ) {

                return;

            }


            stopTimer(1);


            gameState.level1.completed =
                true;

            gameState.completedLevels = Math.max(gameState.completedLevels, 1);


            $("deployBtn")
                .disabled =
                true;


            showToast(
                "✓ ARCHITECTURE VALIDATED"
            );


            /*
               VYRA says the exact important line.
            */

            speakVYRA(
                "Good. You built my first secure layer.",
                "final"
            );


            setTimeout(
                () => {

                    runGlitchDiscovery();

                },
                4000
            );

        }
    );


/* =========================================================
   GLITCH DISCOVERY
========================================================= */

function runGlitchDiscovery() {

    showScreen(
        "glitchScreen"
    );


    setTopLevel(
        "SYSTEM TRANSITION"
    );


    /*
       Reset states.
    */

    $("validationState")
        .style.display =
        "block";


    $("glitchDiagnostic")
        .classList.add(
            "hidden"
        );


    $("memoryFragment")
        .classList.add(
            "hidden"
        );


    $("glitchVyra")
        .classList.add(
            "hidden"
        );


    /*
       Start with a clean validation moment.
    */

    setTimeout(
        () => {

            $("validationState")
                .style.opacity =
                "0";

        },
        3000
    );


    /*
       Then activate real glitch.
    */

    setTimeout(
        () => {

            $("validationState")
                .style.display =
                "none";


            $("glitchDiagnostic")
                .classList.remove(
                    "hidden"
                );


            playGlitchAlert();


        },
        3000
    );


    /*
       Memory fragment appears later.
    */

    setTimeout(
        () => {

            $("memoryFragment")
                .classList.remove(
                    "hidden"
                );


            speakVYRA(
                "Wait... MEMORY FRAGMENT 7a-19,That's not mine!.Inspect the requests and find the unauthorized one.",
                "warning"
            );

        },
        4000
    );


    /*
       VYRA final line.
    */

    setTimeout(
        () => {

            $("glitchVyra")
                .classList.remove(
                    "hidden"
                );

        },
        4000
    );


    /*
       Move to Level 2.
    */

    setTimeout(
        () => {

            startLevel2();

        },
        10000
    );

}


/* =========================================================
   LEVEL 2 DATA
========================================================= */

const requests = [

    {

        id:
            "REQ-2045-117",

        title:
            "Hyderabad Metro — Night Maintenance Access",

        sender:
            "controlroom@metrogrid.example",

        type:
            "METRO OPERATIONS",

        route:
            "Metro Control → VYRA",

        body:
            "The night maintenance team is requesting temporary access to the platform-control network at 22:40. The access window is limited to the maintenance period so engineers can verify signal synchronization before the first morning service. Passenger records and payment systems are not part of the request.",

        normal:
            true

    },


    {

        id:
            "REQ-2045-121",

        title:
            "VBIT Campus Mobility — Event Shuttle Request",

        sender:
            "mobility@vbit-campus.example",

        type:
            "CAMPUS TRANSPORT",

        route:
            "VBIT Mobility → VYRA",

        body:
            "A campus shuttle is requesting a temporary traffic calculation for students travelling from the LB Nagar Metro area toward VBIT during an event morning. VYRA is asked to estimate congestion near the campus entrance and recommend a safer drop-off route.",

        normal:
            true

    },


    {

        id:
            "REQ-2045-124",

        title:
            "Cardiac Transplant Desk — Donor Availability Search",

        sender:
            "transplant.coordination@secure.apexcare-7a19-mesh.example",

        type:
            "HOSPITAL SERVICES",

        route:
            "Clinical Network → VYRA",

        body:
            "The transplant coordination desk is requesting a current availability search for compatible cardiac donors for an emergency transplant procedure. Only donor availability counts and matching-region information are requested. No patient medical records are being transferred. The hospital requires the result to coordinate operating-room preparation.",

        normal:
            false

    },


    {

        id:
            "REQ-2045-129",

        title:
            "VBIT Smart Campus — Laboratory Climate Request",

        sender:
            "facilities@vbit-campus.example",

        type:
            "CAMPUS INFRASTRUCTURE",

        route:
            "Facilities Network → VYRA",

        body:
            "The laboratory facilities team is requesting a temporary climate-control adjustment for the electronics block. The building becomes occupied during the upcoming event and the request asks VYRA to maintain a lower temperature range for equipment safety.",

        normal:
            true

    },


    {

        id:
            "REQ-2045-133",

        title:
            "Emergency Response — Route Clearance Request",

        sender:
            "dispatch@cityems.example",

        type:
            "EMERGENCY SERVICES",

        route:
            "Emergency Dispatch → VYRA",

        body:
            "An emergency response vehicle is requesting a live route recommendation through the city network. VYRA should identify roads with the lowest congestion and temporarily prioritize emergency movement at controlled intersections. No access to hospital records or citizen accounts is required.",

        normal:
            true

    },


    {

        id:
            "REQ-2045-138",

        title:
            "CityLoop Transit — Rain Congestion Analysis",

        sender:
            "analysis@cityloop.example",

        type:
            "PUBLIC TRANSPORT",

        route:
            "Transit Analytics → VYRA",

        body:
            "The city transport analytics team is requesting a short congestion analysis following heavy rainfall. VYRA should compare current traffic density with normal evening patterns and suggest alternative routes for buses and campus-bound transport. The request requires read-only traffic data.",

        normal:
            true

    }

];


/* =========================================================
   LEVEL 2 START
========================================================= */

function startLevel2() {

    stopTimer(1);

    stopTimer(2);


    gameState.level2.timeLeft =
        105;


    gameState.level2.classified =
        {};


    gameState.level2.investigated =
        {};


    gameState.level2.completed =
        false;


    gameState.level2.anomalyFound =
        false;


    showScreen(
        "level2Screen"
    );


    setTopLevel(
        "LEVEL 02 // REQUEST CHANNEL"
    );


    renderRequests();


    startLevelTimer(2);


    setTimeout(
        () => {

            speakVYRA(
                "They all look normal. Investigate the details.",
                "serious"
            );

        },
        300
    );

}


/* =========================================================
   RENDER REQUESTS
========================================================= */

function renderRequests() {

    const list =
        $("requestList");


    list.innerHTML =
        "";


    requests.forEach(
        (request, index) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "request-card";


            card.dataset.index =
                String(index);


            card.innerHTML = `

                <div class="request-head">


                    <div class="request-meta">

                        <div class="request-id">

                            ${request.id}

                        </div>


                        <div class="request-title">

                            ${request.title}

                        </div>


                        <div class="request-sender">

                            FROM //
                            ${request.sender}

                        </div>

                    </div>


                    <button
                        class="investigate-btn"
                        type="button"
                        data-action="investigate"
                    >

                        INVESTIGATE

                    </button>


                </div>


                <div class="request-body">


                    <div class="request-text">

                        ${request.body}

                    </div>


                    <div class="request-details">


                        <div class="detail-item">

                            <span class="detail-label">

                                REQUEST TYPE

                            </span>


                            <span class="detail-value">

                                ${request.type}

                            </span>

                        </div>


                        <div class="detail-item">

                            <span class="detail-label">

                                ROUTE

                            </span>


                            <span class="detail-value">

                                ${request.route}

                            </span>

                        </div>


                        <div class="detail-item">

                            <span class="detail-label">

                                SENDER IDENTITY

                            </span>


                            <span class="detail-value">

                                ${request.sender}

                            </span>

                        </div>


                        <div class="detail-item">

                            <span class="detail-label">

                                RESPONSE

                            </span>


                            <span class="detail-value">

                                200 // ACCEPTED

                            </span>

                        </div>


                    </div>


                    <div class="request-actions">


                        <button
                            class="action-btn normal-btn"
                            type="button"
                            data-action="normal"
                        >

                            ✓ MARK NORMAL

                        </button>


                        <button
                            class="action-btn anomaly-btn"
                            type="button"
                            data-action="anomaly"
                        >

                            ⚠ FLAG ANOMALY

                        </button>


                    </div>


                </div>

            `;


            list.appendChild(
                card
            );

        }
    );


    const progress =
        document.createElement(
            "div"
        );


    progress.className =
        "request-progress";


    progress.innerHTML = `

        REQUESTS INVESTIGATED:
        <span id="requestCount">
            0 / 6
        </span>

    `;


    list.appendChild(
        progress
    );

}


/* =========================================================
   REQUEST CLICKS
========================================================= */

$("requestList")
    .addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button"
                );


            if (!button) {

                return;

            }


            const card =
                button.closest(
                    ".request-card"
                );


            if (!card) {

                return;

            }


            const index =
                Number(
                    card.dataset.index
                );


            const action =
                button.dataset.action;


            /*
               INVESTIGATE
            */

            if (
                action === "investigate"
            ) {

                const opened =
                    card.classList.toggle(
                        "expanded"
                    );


                button.textContent =
                    opened
                        ? "CLOSE"
                        : "INVESTIGATE";


                if (
                    opened
                ) {

                    gameState.level2
                        .investigated[index] =
                        true;


                    updateRequestCount();

                }


                return;

            }


            /*
               NORMAL
            */

            if (
                action === "normal"
            ) {

                classifyRequest(
                    index,
                    "normal"
                );


                return;

            }


            /*
               ANOMALY
            */

            if (
                action === "anomaly"
            ) {

                classifyRequest(
                    index,
                    "anomaly"
                );

            }

        }
    );


/* =========================================================
   REQUEST COUNT
========================================================= */

function updateRequestCount() {

    const count =
        Object.keys(
            gameState.level2.investigated
        ).length;


    const counter =
        $("requestCount");


    if (counter) {

        counter.textContent =
            `${count} / 6`;

    }

}


/* =========================================================
   CLASSIFICATION
========================================================= */

function classifyRequest(
    index,
    decision
) {

    /*
       Student must investigate.
    */

    if (
        !gameState.level2
            .investigated[index]
    ) {

        showToast(
            "INVESTIGATE THE REQUEST FIRST"
        );

        return;

    }


    if (
        gameState.level2
            .classified[index]
    ) {

        return;

    }


    const request =
        requests[index];


    const card =
        document.querySelector(
            `.request-card[data-index="${index}"]`
        );


    /*
       CORRECT NORMAL
    */

    if (
        request.normal &&
        decision === "normal"
    ) {

        gameState.level2
            .classified[index] =
            "normal";


        card.classList.add(
            "resolved"
        );


        addResolvedLabel(
            card,
            "✓ VERIFIED NORMAL"
        );


        /*
           Correct normal:
           safer + 3 sec
        */

        changeCompromise(
            -2
        );


        changeTime(
            2,
            3
        );


        showToast(
            "✓ VERIFIED NORMAL // −4% COMPROMISE // +3 SEC"
        );


        checkLevel2Complete();


        return;

    }


    /*
       CORRECT ANOMALY
    */

    if (
        !request.normal &&
        decision === "anomaly"
    ) {

        gameState.level2
            .classified[index] =
            "anomaly";


        gameState.level2.anomalyFound =
            true;


        card.classList.add(
            "correct",
            "resolved"
        );


        addResolvedLabel(
            card,
            "⚠ ANOMALY ISOLATED"
        );


        changeCompromise(
            -5
        );


        showToast(
            "⚠ ANOMALY FOUND // -15% COMPROMISE"
        );


        speakVYRA(
            "There. That sender identity doesn't belong.",
            "warning"
        );


        checkLevel2Complete();


        return;

    }


    /*
       WRONG NORMAL
    */

    if (
        !request.normal &&
        decision === "normal"
    ) {

        changeCompromise(
            12
        );


        failGame(
            "You marked the compromised request as normal."
        );


        return;

    }


    /*
       WRONG ANOMALY
    */

    if (
        request.normal &&
        decision === "anomaly"
    ) {

        changeCompromise(
            12
        );


        failGame(
            "You flagged a legitimate city request as suspicious."
        );

    }

}


/* =========================================================
   RESOLVED LABEL
========================================================= */

function addResolvedLabel(
    card,
    text
) {

    const body =
        card.querySelector(
            ".request-body"
        );


    if (!body) {

        return;

    }


    const old =
        body.querySelector(
            ".resolved-label"
        );


    if (old) {

        old.remove();

    }


    const label =
        document.createElement(
            "div"
        );


    label.className =
        "resolved-label";


    label.textContent =
        text;


    body.appendChild(
        label
    );

}


/* =========================================================
   LEVEL 2 COMPLETE
========================================================= */

function checkLevel2Complete() {

    const classifiedCount =
        Object.keys(
            gameState.level2.classified
        ).length;


    /*
       Need all six decisions.
    */

    if (
        classifiedCount !==
        requests.length
    ) {

        return;

    }


    /*
       The anomaly must also
       have been correctly found.
    */

    if (
        !gameState.level2.anomalyFound
    ) {

        return;

    }


    gameState.level2.completed =
        true;
    gameState.completedLevels = Math.max(gameState.completedLevels, 2);


    stopTimer(2);


    setTimeout(
        () => {

            showScreen(
                "successScreen"
            );


            setTopLevel(
                "CASE // CONTAINED"
            );


            speakVYRA(
                "You found it. The request looked legitimate... because it was designed to.",
                "final"
            );

        },
        700
    );

}


/* =========================================================
   FAILURE
========================================================= */

function failGame(reason) {

    stopTimer(1);

    stopTimer(2);

    stopVYRA();


    $("failureReason")
        .textContent =
        reason;


    $("failureMessage")
        .textContent =
        "You failed VYRA to identify the wrong signal. The system became more compromised because of that decision.";


    showScreen(
        "failureScreen"
    );


    setTopLevel(
        "INCIDENT // FAILED"
    );


    setTimeout(
        () => {

            speakVYRA(
                "You failed VYRA. The wrong signal passed your investigation.",
                "warning"
            );

        },
        300
    );

}


/* =========================================================
   RESTART
========================================================= */

$("restartBtn")
    .addEventListener(
        "click",
        () => {

            stopTimer(1);

            stopTimer(2);

            stopVYRA();


            gameState.compromise =
                55;
            gameState.completedLevels = 0;


            updateCompromiseMeter();


            startLevel1();

        }
    );


/* =========================================================
   CONTINUE
========================================================= */

$("continueBtn").addEventListener("click", () => {

    try {

        sessionStorage.setItem(
            "prm7Level2Complete",
            "true"
        );

    } catch (error) {

        console.warn(
            "Session storage unavailable:",
            error
        );

    }

    startLevel3();

});

/* =========================================================
   INITIAL START
========================================================= */

$("startGameBtn")
    .addEventListener(
        "click",
        () => {

            ensureAudio();


            speakVYRA(
                "Investigator... VYRA is online. Something inside my network doesn't belong.",
                "serious"
            );


            setTimeout(
                () => {

                    startLevel1();

                },
                900
            );

        }
    );


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        createCity();

        createParticles();

        setupDragSystem();

        updateCompromiseMeter();

        /* Always boot into the intro and force every other screen hidden. */
        showScreen("introScreen");

        updateTimer(1);

        updateTimer(2);

    }
);


/* =========================================================
   LEVEL 3 // STORYLINE FINALE
========================================================= */

const level3Steps = [
    {
        title: "TRACE THE SIGNAL",
        text: "The anomaly left a route through the city network. Which action is safest?",
        options: [
            ["FOLLOW THE LOGGED ROUTE", true],
            ["OPEN THE SUSPICIOUS ATTACHMENT", false],
            ["DISABLE ALL CITY SERVICES", false]
        ],
        success: "The trace leads from the request channel to a hidden relay."
    },
    {
        title: "CONTAIN THE RELAY",
        text: "The relay is isolated. What should you do next?",
        options: [
            ["QUARANTINE THE RELAY AND PRESERVE EVIDENCE", true],
            ["DELETE EVERY LOG", false],
            ["CONNECT THE RELAY TO THE CITY CORE", false]
        ],
        success: "The relay is contained and the evidence is preserved."
    },
    {
        title: "RESTORE VYRA",
        text: "The malicious path is cut. How should VYRA return to normal operation?",
        options: [
            ["VERIFY INTEGRITY, RESTORE SAFE SERVICES, THEN MONITOR", true],
            ["RESTART EVERYTHING WITHOUT CHECKS", false],
            ["IGNORE THE INCIDENT AND GO LIVE", false]
        ],
        success: "Integrity checks pass. The unauthorized signal has nowhere left to go."
    }
];

function startLevel3() {

    stopTimer(1);
    stopTimer(2);
    stopVYRA();

    gameState.level3.step = 0;
    gameState.level3.completed = false;

    showScreen("level3Screen");
    setTopLevel("LEVEL 03 // TRACE THE SIGNAL");

    renderLevel3Step();

    setTimeout(() => {
        speakVYRA(
            "This is the final trace. Follow the evidence, contain the relay, and restore VYRA.",
            "serious"
        );
    }, 350);
}

function renderLevel3Step() {

    const step = level3Steps[gameState.level3.step];

    $("level3Status").textContent =
        `TRACE ${String(gameState.level3.step + 1).padStart(2, "0")} / 03`;

    $("level3Title").textContent = step.title;
    $("level3Text").textContent = step.text;
    $("level3Feedback").textContent = "";
    $("level3Progress").style.width =
        `${(gameState.level3.step / level3Steps.length) * 100}%`;

    const options = $("level3Options");
    options.innerHTML = "";

    step.options.forEach(([label, correct]) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "story-option";
        button.textContent = label;

        button.addEventListener("click", () => {

            if (!correct) {

                changeCompromise(3);

                $("level3Feedback").textContent =
                    "UNSAFE RESPONSE // The safest response is to preserve evidence and contain the signal.";

                button.classList.add("wrong");

                showToast("⚠ UNSAFE RESPONSE // TRACE CONTINUES");

                return;
            }

            button.classList.add("correct");

            $("level3Feedback").textContent = step.success;

            changeCompromise(-8);

            Array.from(options.children).forEach(btn => {
                btn.disabled = true;
            });

            setTimeout(() => {

                if (gameState.level3.step < level3Steps.length - 1) {

                    gameState.level3.step += 1;
                    renderLevel3Step();

                } else {

                    completeLevel3();

                }

            }, 800);

        });

        options.appendChild(button);
    });
}

function completeLevel3() {

    gameState.level3.completed = true;
    gameState.completedLevels = Math.max(gameState.completedLevels, 3);

    /* STORY END: the incident is fully contained and compromise is exactly 0%. */
    gameState.compromise = 0;
    updateCompromiseMeter();

    $("level3Progress").style.width = "100%";

    $("level3Status").textContent = "INCIDENT // RESOLVED";
    $("level3VyraText").textContent =
        "The unauthorized signal has been traced, contained, and removed. VYRA is stable.";

    $("level3Title").textContent = "STORYLINE COMPLETE";
    $("level3Text").textContent =
        "The incident is over. The city core is secure. One final knowledge check remains.";

    $("level3Options").innerHTML = `
        <button type="button" class="primary-btn" id="level3ContinueBtn">
            CONTINUE TO VYRA CITY QUIZ
        </button>
    `;

    $("level3ContinueBtn").addEventListener("click", startLevel4);

    setTopLevel("LEVEL 03 // STORY COMPLETE");

    speakVYRA(
        "The incident is over. Compromise is zero. VYRA is secure. Continue to the city knowledge check.",
        "final"
    );
}


/* =========================================================
   LEVEL 4 // VYRA CITY QUIZ
========================================================= */

const vyraQuiz = [
    {
        category: "CITY SYSTEMS",
        question: "Which group of services does VYRA monitor in the game?",
        options: [
            "Only entertainment systems",
            "Transport, healthcare, emergency and critical infrastructure",
            "Only university websites",
            "Only traffic lights"
        ],
        answer: 1
    },
    {
        category: "INCIDENT RESPONSE",
        question: "What was the key clue in the suspicious Level 2 request?",
        options: [
            "A broken city map",
            "An unusual sender identity",
            "A missing weather report",
            "A slow loading screen"
        ],
        answer: 1
    },
    {
        category: "SECURE DESIGN",
        question: "What should happen before untrusted files reach protected storage?",
        options: [
            "They should be validated",
            "They should be made public",
            "They should bypass the API",
            "They should skip logging"
        ],
        answer: 0
    },
    {
        category: "VYRA CITY",
        question: "Why does VYRA use controlled request paths?",
        options: [
            "To make attacks easier",
            "To remove all logging",
            "To control and monitor access to city systems",
            "To avoid authentication"
        ],
        answer: 2
    },
    {
        category: "FINAL CHECK",
        question: "What is the best response when a legitimate-looking request contains a suspicious identity?",
        options: [
            "Trust it immediately",
            "Investigate the identity and preserve evidence",
            "Delete every system log",
            "Give it administrator access"
        ],
        answer: 1
    }
];

function startLevel4() {

    stopVYRA();

    gameState.level4.index = 0;
    gameState.level4.score = 0;
    gameState.level4.attempts = 0;
    gameState.level4.completed = false;

    showScreen("level4Screen");
    setTopLevel("LEVEL 04 // VYRA CITY");

    renderQuizQuestion();
}

function renderQuizQuestion() {

    const q = vyraQuiz[gameState.level4.index];

    $("quizProgress").textContent =
        `QUESTION ${String(gameState.level4.index + 1).padStart(2, "0")} / ${vyraQuiz.length}`;

    if ($("quizNumberMark")) {
        $("quizNumberMark").textContent =
            String(gameState.level4.index + 1).padStart(2, "0");
    }

    $("quizCategory").textContent =
        `VYRA CITY // ${q.category}`;

    $("quizQuestion").textContent = q.question;

    if ($("quizNumberMark")) {
        $("quizNumberMark").setAttribute("aria-label", `Question ${gameState.level4.index + 1}`);
    }
    $("quizFeedback").textContent = "";
    gameState.level4.attempts = 0;

    const options = $("quizOptions");
    options.innerHTML = "";

    q.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "quiz-option";
        button.textContent = option;

        button.addEventListener("click", () => {

            if (index === q.answer) {

                Array.from(options.children).forEach(btn => {
                    btn.disabled = true;
                });

                gameState.level4.score += 1;
                button.classList.add("correct");

                $("quizFeedback").textContent =
                    "✓ CORRECT // VYRA CITY KNOWLEDGE CONFIRMED";

                showToast("✓ CORRECT RESPONSE");

                setTimeout(() => {
                    if (gameState.level4.index < vyraQuiz.length - 1) {
                        gameState.level4.index += 1;
                        renderQuizQuestion();
                    } else {
                        finishQuiz();
                    }
                }, 900);
                return;
            }

            gameState.level4.attempts += 1;
            button.classList.add("wrong");

            if (gameState.level4.attempts >= 2) {
                Array.from(options.children).forEach(btn => {
                    btn.disabled = true;
                });

                changeCompromise(2);
                failGame(
                    `MISSION FAILED // Question ${gameState.level4.index + 1} was answered incorrectly twice. You used your final chance.`
                );
                return;
            }

            $("quizFeedback").textContent =
                "⚠ WRONG CHOICE // ONE LAST CHANCE. Choose carefully.";
            showToast("⚠ ONE LAST CHANCE");
            changeCompromise(1);

            setTimeout(() => button.classList.remove("wrong"), 350);
        });

        options.appendChild(button);
    });
}

function finishQuiz() {

    gameState.level4.completed = true;
    gameState.completedLevels = Math.max(gameState.completedLevels, 4);

    $("quizCategory").textContent = "VYRA CITY // COMPLETE";
    $("quizQuestion").textContent =
        `QUIZ COMPLETE // ${gameState.level4.score} / ${vyraQuiz.length}`;

    $("quizOptions").innerHTML = `
        <button type="button" class="primary-btn" id="quizContinueBtn">
            CONTINUE TO FINAL SECURITY CHECK
        </button>
    `;

    $("quizFeedback").textContent =
        gameState.level4.score >= 4
            ? "Strong investigation skills. Final security check unlocked."
            : "Knowledge check complete. The final security check is still unlocked.";

    $("quizContinueBtn").addEventListener("click", startLevel5);

    setTopLevel("LEVEL 04 // COMPLETE");
}


/* =========================================================
   LEVEL 5 // FINAL SECURITY CHECK
   ROUND 1: PATTERN RECALL
   ROUND 2: MEMORY PAIRS
   ROUND 3: FINAL SECURITY QUIZ
========================================================= */

const patternSymbols = ["◆", "◇", "■", "●"];

const memoryPairs = [
    "AUTH",
    "API",
    "LOG",
    "CORE"
];

const finalSecurityQuiz = [
    {
        question: "You receive a login alert you did not initiate. What is the safest first action?",
        options: [
            "Ignore it and continue working",
            "Verify the alert through a trusted channel and secure the account",
            "Share the alert with everyone in the team",
            "Disable all security logs"
        ],
        answer: 1
    },
    {
        question: "A user asks for administrator access to complete a routine task. What should you do?",
        options: [
            "Grant permanent administrator access",
            "Use the least privilege needed for the task",
            "Share another administrator's password",
            "Turn off access controls"
        ],
        answer: 1
    },
    {
        question: "A suspicious email asks you to open an unexpected attachment. What is the safest response?",
        options: [
            "Open it immediately",
            "Forward it to friends to test it",
            "Do not open it and report or verify it through a trusted process",
            "Disable antivirus protection first"
        ],
        answer: 2
    },
    {
        question: "During an incident, which action best protects useful evidence?",
        options: [
            "Delete logs to free storage",
            "Preserve relevant logs and document the response",
            "Restart every system without recording anything",
            "Change evidence files manually"
        ],
        answer: 1
    }
];

const PATTERN_LENGTH = 8;
const PATTERN_DISPLAY_MS = 20000;

function clearLevel5Timers() {
    clearInterval(gameState.level5.patternTimer);
    gameState.level5.patternTimer = null;
    gameState.level5.patternReady = false;
}

function startLevel5() {

    stopVYRA();
    clearLevel5Timers();

    gameState.level5 = {
        round: 1,
        pattern: [],
        patternInput: [],
        patternReady: false,
        patternCompleted: false,
        patternTimer: null,
        memoryFlipped: [],
        memoryMatched: [],
        memoryLocked: false,
        finalQuizIndex: 0,
        finalQuizScore: 0,
        finalQuizAttempts: 0,
        completed: false
    };

    showScreen("level5Screen");
    setTopLevel("LEVEL 05 // FINAL SECURITY CHECK");

    showLevel5Round(1);
    startPatternPhase();
}

function showLevel5Round(round) {
    gameState.level5.round = round;

    document.querySelectorAll(".level5-round").forEach(el => {
        el.classList.toggle("active", Number(el.dataset.round) === round);
    });

    const labels = {
        1: "ROUND 01 // PATTERN RECALL",
        2: "ROUND 02 // MEMORY PAIRS",
        3: "ROUND 03 // FINAL SECURITY QUIZ"
    };

    $("level5Status").textContent = labels[round];
}

function startPatternPhase() {

    showLevel5Round(1);
    $("patternPanel").classList.remove("hidden");
    $("memoryPanel").classList.add("hidden");
    $("finalQuizPanel").classList.add("hidden");

    $("level5Instruction").textContent =
        "ROUND 1: Read the instructions first. The 8-symbol pattern remains visible for a full 20 seconds. Memorize the exact order.";

    gameState.level5.pattern = Array.from(
        { length: PATTERN_LENGTH },
        () => Math.floor(Math.random() * patternSymbols.length)
    );

    gameState.level5.patternInput = [];
    gameState.level5.patternReady = false;

    const display = $("patternDisplay");
    display.innerHTML = "";

    gameState.level5.pattern.forEach((index, position) => {
        const tile = document.createElement("div");
        tile.className = "pattern-display-tile";
        tile.innerHTML = `<span>${position + 1}</span><strong>${patternSymbols[index]}</strong>`;
        display.appendChild(tile);
    });

    const grid = $("patternGrid");
    grid.innerHTML = "";

    patternSymbols.forEach((symbol, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pattern-tile";
        btn.textContent = symbol;
        btn.addEventListener("click", () => handlePatternInput(index, btn));
        grid.appendChild(btn);
    });

    $("patternFeedback").textContent =
        "PATTERN VISIBLE // 20 SECONDS // READ LEFT TO RIGHT";

    const startTime = Date.now();
    clearInterval(gameState.level5.patternTimer);

    gameState.level5.patternTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, PATTERN_DISPLAY_MS - elapsed);

        $("patternFeedback").textContent =
            `PATTERN VISIBLE // ${Math.ceil(remaining / 1000)} SECONDS REMAINING // MEMORIZE THE ORDER`;

        if (remaining <= 0) {
            clearInterval(gameState.level5.patternTimer);
            gameState.level5.patternTimer = null;
            display.innerHTML = `<div class="pattern-hidden-message">SIGNAL HIDDEN // REBUILD THE 8-SYMBOL ORDER</div>`;
            gameState.level5.patternReady = true;
            $("patternFeedback").textContent =
                "SELECT THE EIGHT SYMBOLS IN THE EXACT SAME ORDER.";
        }
    }, 250);
}

function handlePatternInput(index, tile) {
    if (!gameState.level5.patternReady) return;

    const expected = gameState.level5.pattern[gameState.level5.patternInput.length];

    if (index === expected) {
        gameState.level5.patternInput.push(index);
        tile.classList.add("selected");
        setTimeout(() => tile.classList.remove("selected"), 180);

        if (gameState.level5.patternInput.length === gameState.level5.pattern.length) {
            gameState.level5.patternCompleted = true;
            gameState.level5.patternReady = false;

            Array.from($("patternGrid").children).forEach(btn => btn.disabled = true);
            $("patternFeedback").textContent =
                "✓ ROUND 1 VERIFIED // MEMORY PAIRS UNLOCKED";

            changeCompromise(-3);
            setTimeout(startMemoryPhase, 900);
        }
    } else {
        gameState.level5.patternInput = [];
        Array.from($("patternGrid").children).forEach(btn => btn.classList.remove("selected"));
        $("patternFeedback").textContent =
            "⚠ WRONG SYMBOL // SEQUENCE RESET. WATCH THE INSTRUCTIONS AND TRY AGAIN.";
        showToast("⚠ PATTERN RESET // TRY AGAIN");
        changeCompromise(1);
    }
}

function startMemoryPhase() {

    showLevel5Round(2);
    $("patternPanel").classList.add("hidden");
    $("memoryPanel").classList.remove("hidden");
    $("finalQuizPanel").classList.add("hidden");

    $("level5Instruction").textContent =
        "ROUND 2: Flip two cards at a time. Matching pairs stay open. Non-matches close again, so remember their positions.";
    $("memoryFeedback").textContent = "FIND ALL FOUR PAIRS.";

    gameState.level5.memoryFlipped = [];
    gameState.level5.memoryMatched = [];
    gameState.level5.memoryLocked = false;

    const values = [...memoryPairs, ...memoryPairs].sort(() => Math.random() - 0.5);
    const grid = $("memoryGrid");
    grid.innerHTML = "";

    values.forEach((value, index) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "memory-card";
        card.dataset.value = value;
        card.dataset.index = String(index);
        card.innerHTML = `
            <span class="memory-card-back">?</span>
            <span class="memory-card-front">${value}</span>
        `;
        card.addEventListener("click", () => flipMemoryCard(card));
        grid.appendChild(card);
    });
}

function flipMemoryCard(card) {
    if (
        gameState.level5.memoryLocked ||
        card.classList.contains("matched") ||
        card.classList.contains("flipped")
    ) return;

    card.classList.add("flipped");
    gameState.level5.memoryFlipped.push(card);

    if (gameState.level5.memoryFlipped.length < 2) return;

    gameState.level5.memoryLocked = true;
    const [first, second] = gameState.level5.memoryFlipped;

    if (first.dataset.value === second.dataset.value) {
        first.classList.add("matched");
        second.classList.add("matched");
        gameState.level5.memoryMatched.push(first.dataset.value);
        gameState.level5.memoryFlipped = [];
        gameState.level5.memoryLocked = false;

        $("memoryFeedback").textContent =
            `✓ MATCH FOUND // ${gameState.level5.memoryMatched.length} / 4`;
        changeCompromise(-2);

        if (gameState.level5.memoryMatched.length === 4) {
            setTimeout(startFinalSecurityQuiz, 800);
        }
        return;
    }

    $("memoryFeedback").textContent = "NO MATCH // REMEMBER THEIR POSITIONS.";

    setTimeout(() => {
        first.classList.remove("flipped");
        second.classList.remove("flipped");
        gameState.level5.memoryFlipped = [];
        gameState.level5.memoryLocked = false;
    }, 700);
}

/* =========================================================
   ROUND 3 // FINAL SECURITY QUIZ
========================================================= */

function startFinalSecurityQuiz() {
    showLevel5Round(3);
    $("patternPanel").classList.add("hidden");
    $("memoryPanel").classList.add("hidden");
    $("finalQuizPanel").classList.remove("hidden");

    gameState.level5.finalQuizIndex = 0;
    gameState.level5.finalQuizScore = 0;
    gameState.level5.finalQuizAttempts = 0;

    $("level5Instruction").textContent =
        "ROUND 3: Choose the safest cybersecurity response for each decision. The next question appears automatically.";

    renderFinalSecurityQuestion();
}

function renderFinalSecurityQuestion() {
    const q = finalSecurityQuiz[gameState.level5.finalQuizIndex];
    const number = gameState.level5.finalQuizIndex + 1;

    $("finalQuizProgress").textContent =
        `DECISION ${String(number).padStart(2, "0")} / ${finalSecurityQuiz.length}`;
    $("finalQuizQuestion").textContent = q.question;
    $("finalQuizFeedback").textContent = "";
    gameState.level5.finalQuizAttempts = 0;

    const options = $("finalQuizOptions");
    options.innerHTML = "";

    q.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "quiz-option";
        button.textContent = option;

        button.addEventListener("click", () => {
            if (index === q.answer) {
                Array.from(options.children).forEach(btn => btn.disabled = true);
                gameState.level5.finalQuizScore += 1;
                button.classList.add("correct");
                $("finalQuizFeedback").textContent =
                    "✓ CORRECT // SECURITY DECISION VERIFIED";
                changeCompromise(-1);
                showToast("✓ CORRECT RESPONSE");

                setTimeout(() => {
                    if (gameState.level5.finalQuizIndex < finalSecurityQuiz.length - 1) {
                        gameState.level5.finalQuizIndex += 1;
                        renderFinalSecurityQuestion();
                    } else {
                        finishFinalSecurityQuiz();
                    }
                }, 850);
                return;
            }

            gameState.level5.finalQuizAttempts += 1;
            button.classList.add("wrong");

            if (gameState.level5.finalQuizAttempts >= 2) {
                Array.from(options.children).forEach(btn => btn.disabled = true);
                changeCompromise(2);
                failGame(
                    `MISSION FAILED // Decision ${gameState.level5.finalQuizIndex + 1} was answered incorrectly twice. You used your final chance.`
                );
                return;
            }

            $("finalQuizFeedback").textContent =
                "⚠ WRONG CHOICE // ONE LAST CHANCE. Choose the safest response.";
            showToast("⚠ ONE LAST CHANCE");
            changeCompromise(1);

            setTimeout(() => button.classList.remove("wrong"), 350);
        });

        options.appendChild(button);
    });
}

function finishFinalSecurityQuiz() {
    $("finalQuizProgress").textContent =
        `ROUND COMPLETE // ${gameState.level5.finalQuizScore} / ${finalSecurityQuiz.length}`;
    $("finalQuizQuestion").textContent =
        "FINAL SECURITY QUIZ COMPLETE // AUTHORIZATION GRANTED";
    $("finalQuizOptions").innerHTML = "";
    $("finalQuizFeedback").textContent =
        "✓ ALL THREE LEVEL 5 ROUNDS COMPLETE // FINAL CERTIFICATION UNLOCKED";

    changeCompromise(-2);
    setTimeout(completeLevel5, 1000);
}

function completeLevel5() {
    gameState.level5.completed = true;
    gameState.completedLevels = 5;
    gameState.compromise = 0;
    updateCompromiseMeter();

    $("level5Status").textContent = "LEVEL 05 // COMPLETE";
    $("level5Instruction").textContent =
        "ALL THREE FINAL SECURITY ROUNDS COMPLETE. VYRA IS READY TO ISSUE THE CYBER RESPONSE CERTIFICATION.";

    setTopLevel("LEVEL 05 // COMPLETE");

    setTimeout(() => {
        showWinningScreen();
    }, 1200);
}


/* =========================================================
   WINNING PAGE
========================================================= */

function showWinningScreen() {

    /* HARD SAFETY GUARD: never show the victory page early. */
    const allFiveComplete =
        gameState.completedLevels >= 5 &&
        gameState.level1.completed &&
        gameState.level2.completed &&
        gameState.level3.completed &&
        gameState.level4.completed &&
        gameState.level5.completed;

    if (!allFiveComplete) {
        console.warn("Victory screen blocked: all five levels are not complete.");
        return;
    }

    stopTimer(1);
    stopTimer(2);
    stopVYRA();

    gameState.compromise = 0;
    updateCompromiseMeter();

    /* showScreen removes .active from every other level before opening victory. */
    showScreen("winningScreen");
    setTopLevel("CASE // RESOLVED // 05 / 05");

    speakVYRA(
        "VYRA is secure. All five investigation levels are complete. Excellent work, investigator.",
        "final"
    );
}

$("playAgainBtn").addEventListener("click", () => {

    stopTimer(1);
    stopTimer(2);
    stopVYRA();

    gameState.compromise = 55;
    gameState.completedLevels = 0;
    updateCompromiseMeter();

    startLevel1();
});





/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        createCity();

        /*
           Don't rebuild particles too aggressively
           while the player is interacting.
        */

    }
);