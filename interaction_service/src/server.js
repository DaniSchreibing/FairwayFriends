var amqp = require("amqplib/callback_api");
const app = require("express")();
const port = 8080;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.get("/profile", (req, res) => {
  amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = "hello";
      var msg = "Hello World!";

      channel.assertQueue(queue, {
        durable: false,
      });
      channel.sendToQueue(queue, Buffer.from(msg));

      console.log(" [x] Sent %s", msg);
    });
    setTimeout(function () {
      connection.close();
    }, 500);
  });

  res.status(200).send("Message sent");
});
