require("dotenv").config();

const { saveChat } = require("../helpers/matchHelpers");

require("../config/mongo");
const foo = async () => {
  const chat = await saveChat(["6167764ed22a82aa4d714461", "6167e3eec6b27af5aa1b5bf6"], "123", [
    { text: "hi" },
    { text: "yo" },
    { text: "mazeme" }
  ]);
  
  console.log(chat);
}
foo();