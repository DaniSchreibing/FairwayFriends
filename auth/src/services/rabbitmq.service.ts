import * as amqp from "amqplib/callback_api";
import { Profile } from "../models/profile.model";

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5673';

export function sendProfileData(profileData: Profile) {
  amqp.connect(amqpUrl, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    console.log("Connected to RabbitMQ");
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var queue = "Registration";
      var msg = JSON.stringify({ "profileData": profileData });
    
      console.log("Created channel");

      channel.assertQueue(queue, {
        durable: true,
      });

      channel.sendToQueue(queue, Buffer.from(msg));
      console.log(" [x] Sent %s", msg);
    });
    setTimeout(function () {
      connection.close();
    }, 500);
  });
}