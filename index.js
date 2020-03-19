const express = require('express')
const app = express()
const em = require('./fs-connector')
const port = 81

const chamadas = {}
let gerar = false
let tempo = 20000

function random(low, high) {
  return parseInt(Math.random() * (high - low) + low)
}

const executar = async (to, intervalo) => {
  while(gerar){
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        em.emit('originar-limit', to, random(15, intervalo))
        resolve()
      }, tempo)
    })
  }
}

app.post('/gerar/:to/:tempo', (req, res) => {
  let { to, tempo } = req.params;
  res.send()

  tempo = tempo * 1000
  gerar = true
  executar(to, tempo)
})

app.post('/gerar/parar', (req, res) => {
  gerar = false
  res.send()
})

em.on('OK', chamada => {
  chamadas[chamada.callid] = {
    from: chamada.from,
    to: chamada.to
  }
})

app.post('/originate/:to', (req, res) => {
  const { to } = req.params;
  em.emit('originar', to)
  res.send()
})

app.post('/originate/:to/:quantidade', async (req, res) => {
  const { to, quantidade } = req.params;
  res.send()

  for (let i = 0; i < quantidade; i++) {
    await new Promise((resolve, reject) => {
      em.emit('originar', to)
      setTimeout(() => {
        resolve()
      }, 1000)
    })
  }
})

app.post('/change/from/:from', (req, res) => {
  const { from } = req.params;
  em.emit('alterar_from', from)
  res.send()
})

app.post('/kill/:callid', (req, res) => {
  const { callid } = req.params;
  em.emit('kill', callid)
  res.send()
})

app.post('/killall', (req, res) => {
  em.emit('killall')
  res.send()
})

app.get('/showcalls', (req, res) => {
  em.emit('showcalls', res)
})

app.listen(port, () => {
  console.log(`App Running at port ${port}`)
})
