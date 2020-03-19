const express = require('express')
const app = express()
const em = require('./fs-connector')
const port = 81

const chamadas = {}
let gerar = false
let tempoOriginar = 20000

function random(low, high) {
  return parseInt(Math.random() * (high - low) + low)
}

const executar = async (to, min, max) => {
  while(gerar){
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        let dur = random(min, max)
        em.emit('originar-limit', to, dur)
        resolve()
      }, tempoOriginar)
    })
  }
}

app.post('/gerar/intervalo/:tempo', (req, res) => {
  let { tempo } = req.params;
  tempoOriginar = tempo * 1000
  res.send(`Intervalo entre a geração de chamadas: ${tempoOriginar/1000}`)
})

app.post('/gerar/:to/:min/:max', (req, res) => {
  let { to, min, max } = req.params;
  res.send()

  gerar = true
  executar(to, parseInt(min), parseInt(max))
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
