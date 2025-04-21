import * as amqp from "amqplib/callback_api";
import * as amqp2 from "amqplib";

const amqpUrl = process.env.AMQP_URL || "amqp://localhost:5673";

export function deleteFirebaseUser(userID: string) {
  amqp.connect(amqpUrl, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    console.log("Connected to RabbitMQ");
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      const queue = "RegistrationFailure";
      let msg = JSON.stringify({ UserID: userID });

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

export function listenToQueue() {
  amqp.connect(amqpUrl, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) { throw error1; }

      const queue = "GDPR";

      channel.assertQueue(queue, { durable: false, });

      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C",queue );

      channel.consume(
        queue,
        function (msg) {
          if (msg) {
            console.log(" [x] Received %s", msg.content.toString());
          } else {
            console.log(" [x] Received a null message");
          }
        },
        {
          noAck: true,
        }
      );
    });
  });
}

export function connectWithRetry2(
  retries: number = 5,
  delay: number = 5000,
  callback: (error: Error | null, connection: amqp.Connection | null) => void
): void {
  function attemptConnection(attempt: number): void {
    amqp.connect(amqpUrl, (err: Error | null, connection: amqp.Connection | null) => {
      if (err) {
        console.error(`RabbitMQ connection failed, retrying in ${delay / 1000}s...`);
        if (attempt < retries) {
          setTimeout(() => attemptConnection(attempt + 1), delay);
        } else {
          callback(new Error("Could not connect to RabbitMQ after multiple retries."), null);
        }
      } else {
        console.log("Connected to RabbitMQ");
        callback(null, connection);
      }
    });
  }
  attemptConnection(1);
}

export function listen(connection: amqp.Connection | null, callback: (message: string) => void ): void {
  if (!connection) {
    console.error("No connection provided to listen function.");
    return;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) { throw error1; }

    const queue = "GDPR";

    channel.assertQueue(queue, { durable: true, });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C",queue );

    channel.consume(
      queue,
      function (msg) {
        if (msg) {
          console.log(" [x] Received %s", msg.content.toString());
          callback(msg.content.toString());
        } else {
          console.log(" [x] Received a null message");
          callback("null message");
        }
      },
      {
        noAck: true,
      }
    );
  });
}

export function listenForRegistration(connection: amqp.Connection | null, callback: (message: string) => void ): void {
  if (!connection) {
    console.error("No connection provided to listen function.");
    return;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) { throw error1; }

    const queue = "Registration";

    channel.assertQueue(queue, { durable: true, });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C",queue );

    channel.consume(
      queue,
      function (msg) {
        if (msg) {
          console.log(" [x] Received %s", msg.content.toString());
          callback(msg.content.toString());
        } else {
          console.log(" [x] Received a null message");
          callback("null message");
        }
      },
      {
        noAck: true,
      }
    );
  });
}

export async function connectWithRetry(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await amqp2.connect(amqpUrl);
      console.log("Connected to RabbitMQ");
      return connection;
    } catch (err) {
      console.error(`RabbitMQ connection failed, retrying in ${delay / 1000}s...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error("Could not connect to RabbitMQ after multiple retries.");
}