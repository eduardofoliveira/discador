const esl = require("modesl");
const { EventEmitter } = require('events');
const em = new EventEmitter;

conn = new esl.Connection("127.0.0.1", 8021, "ClueCon", function() {
  conn.events("json", "all");

  let from = '5511961197559'

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
  })

  em.on('showcalls', () => {
    conn.api('show calls', result => {
      const [ headers, ...linhas, total ] = result.body.split('\n')
      console.log(headers.split(','))
      console.log(linhas)
      console.log(total)
    })
  })

  em.on('alterar_from', novoFrom => {
    from = novoFrom
  })
})

module.exports = em