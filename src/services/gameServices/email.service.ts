import * as brevo from "@getbrevo/brevo";
import * as fs from "fs";
import * as path from "path";
import * as handlebars from "handlebars";
import * as juice from "juice";
import { WishList } from "../../types";

const templatePath = path.resolve(__dirname, "../../views/email/template.hbs");
const css = fs.readFileSync("./public/css/type.css", "utf8");
const templateSource = fs.readFileSync(templatePath, "utf8");
const template = handlebars.compile(templateSource);

export const sendEmails = async (wishList: WishList) => {
  const htmlToSendWithoutStyles = template({
    userName: wishList.user.userName,
    games: wishList.games,
  });

  const htmlToSend = juice.inlineContent(htmlToSendWithoutStyles, css);
  let apiInstance = new brevo.TransactionalEmailsApi();

  apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_TOKEN!,
  );

  let sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.subject =
    wishList.games.length > 1
      ? `${wishList.games[0].gameName} y otros ${wishList.games.length} estan en oferta.`
      : `${wishList.games[0]} esta en oferta.`;
  sendSmtpEmail.to = [
    {
      email: wishList.user.email,
      name: wishList.user.userName || "-",
    },
  ];
  sendSmtpEmail.htmlContent = htmlToSend;
  sendSmtpEmail.sender = {
    name: "Price Prowler",
    email: "priceprowlerteam@gmail.com",
  };
  return await apiInstance.sendTransacEmail(sendSmtpEmail);
};
//TODO: feature emails para futuras versiones
// export const sendEmails = async (wishList: WishList) => {
//   const htmlToSend = template({
//     userName: wishList.user.userName,
//     games: wishList.games,
//   });

//   return await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: wishList.user.email,
//     subject:
//       wishList.games.length > 1
//         ? `${wishList.games[0].gameName} y otros ${wishList.games.length} estan en oferta.`
//         : `${wishList.games[0]} esta en oferta.`,
//     html: htmlToSend,
//   });
// };
