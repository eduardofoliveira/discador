const esl = require("modesl");

conn = new esl.Connection("127.0.0.1", 8021, "ClueCon", function() {
  conn.events("json", "all");

  let from = '551100000001'

  conn.api(
    `originate {origination_caller_id_number=${from},bridge_generate_comfort_noise=true}sofia/gateway/ASTPP/551135880115@54.233.223.179 35880115 XML discador`,
    result => {
      console.log(result)
    }
  );
})