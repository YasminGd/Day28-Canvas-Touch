'use strict'
let gElCanvas
let gCtx

//gCtx is global
let gShape = 'line'
let gClicked = false
let gPrevPos = null

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    gCtx.fillStyle = 'black'
    addListeners()
    resetElOptions()
}

function resetElOptions() {
    const elColorInput = document.querySelector('[type="color"]')
    elColorInput.value = gCtx.strokeStyle
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth - 40
    gElCanvas.height = elContainer.offsetHeight - 40

    gCtx.fillStyle = 'white'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onChangeColor(color) {
    gCtx.fillStyle = color
}

function onChangeShape(shape) {
    gShape = shape
}
//resize
function addListeners() {
    addMouseListeners()
    addTouchListeners()

    window.addEventListener('resize', () => {
        resizeCanvas()
    })
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
        case 'triangle':
            drawTriangle(pos)
            break
    }
}

function drawLine(pos) {
    const { x, y } = pos
    const size = getSize(pos) / 20

    gCtx.strokeStyle = gCtx.fillStyle
    gCtx.beginPath()
    gCtx.lineWidth = size
    gCtx.moveTo(x, y)
    gCtx.lineTo(gPrevPos.x, gPrevPos.y)
    gCtx.stroke()
    gCtx.closePath()
}

function drawSquare(pos) {
    const { x, y } = pos
    const size = getSize(pos)

    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 2
    gCtx.rect(x, y, size, size)
    gCtx.fillRect(x, y, size, size)
    gCtx.stroke()
    gCtx.closePath()
}

function drawCircle(pos) {
    const { x, y } = pos
    const size = getSize(pos) / 2

    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 2
    gCtx.arc(x, y, size, 0, 2 * Math.PI)
    gCtx.fill()
    gCtx.stroke()
    gCtx.closePath()
}

function drawTriangle(pos) {
    const { x, y } = pos
    const size = getSize(pos)

    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 2
    gCtx.moveTo(x, y)
    gCtx.lineTo(x + size, y - size)
    gCtx.lineTo(x - size, y - size)
    gCtx.lineTo(x, y)
    gCtx.fill()
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

function getSize(pos) {
    const dx = Math.abs(pos.x - gPrevPos.x)
    const dy = Math.abs(pos.y - gPrevPos.y)
    const bigger = Math.max(dx, dy)

    if (bigger > 100) return 200
    else if (bigger > 75) return 150
    else if (bigger > 50) return 100
    else if (bigger > 25) return 50
    else if (bigger > 10) return 20
    else return 10
}

function onDownload(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data
}

function uploadImg() {
    const imgDataUrl = gElCanvas.toDataURL("image/jpeg");
    console.log(imgDataUrl);

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.user-msg').innerText = `Your photo is available here: ${uploadedImgUrl}`

        document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`
    }
    doUploadImg(imgDataUrl, onSuccess);
}

function doUploadImg(imgDataUrl, onSuccess) {

    const formData = new FormData();
    formData.append('img', imgDataUrl)

    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.text())
        .then((url) => {
            console.log('Got back live url:', url);
            onSuccess(url)
        })
        .catch((err) => {
            console.error(err)
        })
}

function onClear() {
    document.querySelector('.user-msg').innerText = ''
    document.querySelector('.share-container').innerText = ''
    onInit()
}