'use strict'
let gElCanvas
let gCtx
let gCurrColor = 'black'
let gShape = 'line'
let gClicked = false
let gPrevPos = null

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    addListeners()
    resetElOptions()
}

function resetElOptions() {
    const elColorInput = document.querySelector('[type="color"]')
    elColorInput.value = gCurrColor
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function onChangeColor(color) {
    gCurrColor = color
}

function onChangeShape(shape) {
    gShape = shape
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onUp() {
    gClicked = false
    gPrevPos = null
}

function onDown() {
    gClicked = true
}

function onMove(ev) {
    if (!gClicked) return
    const pos = getEvPos(ev)
    if (!gPrevPos) gPrevPos = pos
    drawShape(pos)
    gPrevPos = pos
}

function drawShape(pos) {
    switch (gShape) {
        case 'line':
            drawLine(pos)
            break
        case 'square':
            drawSquare(pos)
            break
        case 'circle':
            drawCircle(pos)
            break
    }
}

function drawLine(pos) {
    const { x, y } = pos
    gCtx.beginPath()
    gCtx.lineWidth = 2
    gCtx.moveTo(x, y)
    gCtx.lineTo(gPrevPos.x, gPrevPos.y)
    gCtx.strokeStyle = gCurrColor
    gCtx.stroke()
    gCtx.closePath()
}

function drawSquare(pos) {
    const { x, y } = pos
    gCtx.beginPath()
    gCtx.rect(x, y, 20, 20)
    gCtx.fillStyle = gCurrColor
    gCtx.fillRect(x, y, 20, 20)
    gCtx.strokeStyle = 'white'
    gCtx.stroke()
    gCtx.closePath()
}

function drawCircle(pos) {
    const { x, y } = pos
    gCtx.beginPath()
    gCtx.lineWidth = 2
    gCtx.arc(x, y, 25, 0, 2 * Math.PI)
    gCtx.fillStyle = gCurrColor
    gCtx.fill()
    gCtx.strokeStyle = 'white'
    gCtx.stroke()
    gCtx.closePath()
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}