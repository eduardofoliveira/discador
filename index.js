const express = require('express')
const app = express()
const em = require('./fs-connector')
const port = 81

const chamadas = {}

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

app.post('/change/from/:from', (req, res) => {
  const { from } = req.params;
  em.emit('alterar_from', from)
  res.send()
})

app.get('/showcalls', (req, res) => {
  em.emit('showcalls', res)
})

app.listen(port, () => {
  console.log(`App Running at port ${port}`)
})
