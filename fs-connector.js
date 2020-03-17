const esl = require("modesl");

conn = new esl.Connection("127.0.0.1", 8021, "ClueCon", function() {
  conn.events("json", "all");

  let from = '5511961197559'

  conn.api(
    `originate {absolute_codec_string=^^:PCMU:PCMA,origination_caller_id_number=${from},origination_caller_id_name=${from},sip_contact_user=${from},bridge_generate_comfort_noise=true}sofia/gateway/ASTPP/551135880115@54.233.223.179 35880115 XML discador`,
    result => {
      console.log(result)
    }
  );
})