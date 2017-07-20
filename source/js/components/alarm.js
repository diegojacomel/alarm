var canvas = document.querySelector('.js-canvas')
var context = canvas.getContext('2d')
var radius = canvas.height / 2

context.translate(radius, radius)
radius = radius * 0.9

setInterval(drawClock, 1000)

var alarms = []

alarms = window.localStorage.getItem('alarms') || '[]'
alarms = JSON.parse(alarms)

function drawClock () {
  drawFace(context, radius)
  drawNumbers(context, radius)
  drawTime(context, radius)
}

function drawFace (context, radius) {
  var grad

  context.beginPath()
  context.arc(0, 0, radius, 0, 2 * Math.PI)
  context.fillStyle = 'white'
  context.fill()

  grad = context.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05)
  grad.addColorStop(0, '#333333')
  grad.addColorStop(0.5, '#ffffff')
  grad.addColorStop(1, '#333333')

  context.strokeStyle = grad
  context.lineWidth = radius * 0.1
  context.stroke()

  context.beginPath()
  context.arc(0, 0, radius * 0.1, 0, 2 * Math.PI)
  context.fillStyle = '#333333'
  context.fill()
}

function drawNumbers (context, radius) {
  var ang
  var num

  context.font = radius * 0.15 + 'px arial'
  context.textBaseline = 'middle'
  context.textAlign = 'center'

  for (num = 1; num < 13; num++) {
    ang = num * Math.PI / 6

    context.rotate(ang)
    context.translate(0, -radius * 0.85)
    context.rotate(-ang)
    context.fillText(num.toString(), 0, 0)
    context.rotate(ang)
    context.translate(0, radius * 0.85)
    context.rotate(-ang)
  }
}

function drawTime (context, radius) {
  var now = new Date()
  var hour = now.getHours()
  var minute = now.getMinutes()
  var second = now.getSeconds()

  checkAlarm(hour, minute, second)

  hour = hour % 12
  hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60))
  drawHand(context, hour, radius * 0.58, radius * 0.07)

  minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60))
  drawHand(context, minute, radius * 0.8, radius * 0.07)

  second = (second * Math.PI / 30)
  drawHand(context, second, radius * 0.9, radius * 0.02)
}

function checkAlarm (hour, minute, second) {
  alarms.forEach(alarm => {
    var alarmHour = parseInt(alarm.hour)
    var alarmMinute = parseInt(alarm.minute)
    if (hour === alarmHour && minute === alarmMinute && second === 0) {
      window.alert('Despertador...' + alarmHour + ':' + alarmMinute + ':00')
    }
  })
}

function renderAlarm () {
  var list = document.querySelector('.alarm-list')
  list.innerHTML = ''

  alarms.forEach((alarm, index) => {
    list.innerHTML += `
      <tr>
        <td align="center" width="70%">
          ${alarm.hour}:${alarm.minute}:00
        </td>
        <td align="center">
          <button class="btn btn-danger || js-remove" id="${index}">Remover</button>
        </td>
      </tr>
    `
  })

  removeAlarm()
}

function drawHand (context, pos, length, width) {
  context.beginPath()
  context.lineWidth = width
  context.lineCap = 'round'
  context.moveTo(0, 0)
  context.rotate(pos)
  context.lineTo(0, -length)
  context.stroke()
  context.rotate(-pos)
}

function removeAlarm () {
  var removeAlarm = document.querySelectorAll('.js-remove')
  removeAlarm.forEach(buttonRemove => {
    buttonRemove.addEventListener('click', function () {
      alarms.splice(this.id, 1)
      window.localStorage.setItem('alarms', JSON.stringify(alarms))
      renderAlarm()
    })
  })
}

var form = document.querySelector('.form')
form.addEventListener('submit', function (e) {
  e.preventDefault()

  var hour = this.hour.value
  var minute = this.minute.value
  var second = 0

  alarms.push({hour, minute, second})

  window.localStorage.setItem('alarms', JSON.stringify(alarms))

  renderAlarm()
})

renderAlarm()
