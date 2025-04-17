import express from "express";
import * as bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import profileRoutes from "./routes/profile.route";
import { User } from "./entity/User";
import * as dotenv from "dotenv";
import { resolve } from "path";
import * as rabbitMQService from "./services/rabbitmq.service";
import { deleteByUserID } from "./services/user.service";
import cookieParser from "cookie-parser";
import * as profileService from "./services/user.service";

dotenv.config({ path: resolve(__dirname, "../.env") });

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use("/api/profile", profileRoutes);

    // start express server
    app.listen(3003);

    // start listener for RabbitMQ
    rabbitMQService.connectWithRetry2(5, 5000, (error, connection) => {
      console.log("Connected to RabbitMQ");
      rabbitMQService.listen(connection, (message) => {
        const userId = (() => {
          try {
            return JSON.parse(message).UserID;
          } catch {
            return null;
          }
        })();
        console.log("Received message:", userId);
        deleteByUserID(userId);
      });
      rabbitMQService.listenForRegistration(connection, (message) => {
        const profileData = (() => {
          try {
            return JSON.parse(message).profileData;
          } catch {
            return null;
          }
        })();
        console.log("Received message:", profileData);
        // TODO: Add logic to send message to RabbitMQ if profile creation fails so that Firebase can delete user
        profileService.createProfile(profileData);
      });
    });

    if ((await AppDataSource.manager.count(User)) === 0) {
      await AppDataSource.manager.save(
        AppDataSource.manager.create(User, {
          firstName: "Timber",
          lastName: "Saw",
          age: 27,
          UserID: "0eaf6527-ae7e-41fa-afc7-7491f11dedbd",
        })
      );

      await AppDataSource.manager.save(
        AppDataSource.manager.create(User, {
          firstName: "Phantom",
          lastName: "Assassin",
          age: 24,
          UserID: "65eeee24-2f93-44b0-8709-63ecbbb9a698",
        })
      );
    }

    console.log(
      `Express server has started on port 3003. Open http://localhost:3003/users to see results`
    );
  })
  .catch((error) => console.log(error));
