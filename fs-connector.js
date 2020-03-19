const esl = require("modesl");
const { EventEmitter } = require('events');
const em = new EventEmitter;

conn = new esl.Connection("127.0.0.1", 8021, "ClueCon", function() {
  conn.events("json", "all");

  let from = '551120000000'

  em.on('killall', () => {
    conn.api('show calls', result => {
      let [ headers, ...linhas ] = result.body.split('\n')
      headers = headers.split(',')

      for (let i = 0; i < linhas.length; i++) {
        let registro = linhas[i];
        registro = registro.split(',')

        let obj = {}

        if(registro.length === headers.length){
          for (let a = 0; a < registro.length; a++) {
            obj[headers[a]] = registro[a]
          }
        }

        linhas[i] =  obj
      }

      linhas = linhas.filter(item => item.uuid)
      linhas = linhas.map(item => item.uuid)

      console.log(linhas)

      for (let i = 0; i < linhas.length; i++) {
        const uuid = linhas[i];
        conn.api(`uuid_kill ${uuid}`, result => {})
      }
    })
  })

  em.on('kill', callid => {
    conn.api(`uuid_kill ${callid}`, result => {

    })
  })

  em.on('originar', to => {
    conn.api(
      `originate {absolute_codec_string=^^:PCMU:PCMA,origination_caller_id_number=${from},origination_caller_id_name=${from},sip_contact_user=${from},bridge_generate_comfort_noise=true}sofia/gateway/ASTPP/${to}@54.233.223.179 35880115 XML discador`,
      result => {
        let [status, callid] = result.body.split(' ')
        callid = callid.replace('\n', '')
        if(status === '+OK'){
          em.emit('OK', {
            to,
            from,
            callid
          })
        }
      }
    );
    from = (parseInt(from) + 1).toString()
  })

  em.on('originar-limit', (to, time) => {
    conn.api(
      `originate {absolute_codec_string=^^:PCMU:PCMA,origination_caller_id_number=${from},origination_caller_id_name=${from},sip_contact_user=${from},bridge_generate_comfort_noise=true}sofia/gateway/ASTPP/${to}@54.233.223.179 35880115 XML discador`,
      result => {
        let [status, callid] = result.body.split(' ')
        callid = callid.replace('\n', '')
        if(status === '+OK'){
          em.emit('OK', {
            to,
            from,
            callid
          })
          conn.api(`sched_hangup +${time} ${callid} alotted_timeout`, ressilt2 => {})
        }
      }
    );
    from = (parseInt(from) + 1).toString()
  })

  em.on('showcalls', res => {
    conn.api('show calls', result => {
      let [ headers, ...linhas ] = result.body.split('\n')
      headers = headers.split(',')

      for (let i = 0; i < linhas.length; i++) {
        let registro = linhas[i];
        registro = registro.split(',')

        let obj = {}

        if(registro.length === headers.length){
          for (let a = 0; a < registro.length; a++) {
            obj[headers[a]] = registro[a]
          }
        }

        linhas[i] =  obj
      }

      linhas = linhas.filter(item => item.uuid)

      res.json(linhas)
    })
  })

  em.on('alterar_from', novoFrom => {
    from = novoFrom
  })
})

module.exports = em