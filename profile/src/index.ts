import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { User } from "./entity/User";
import * as dotenv from "dotenv";
import { resolve } from "path";
import * as rabbitMQService from "./services/rabbitmq.service";
import { deleteByUserID } from "./services/user.service";

dotenv.config({ path: resolve(__dirname, "../.env") });

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](route.route, async (req: Request, res: Response, next: Function) => {
        try {
          const controllerInstance = new (route.controller as any)();
          const result = await controllerInstance[route.action](req, res, next);
    
          if (result !== undefined && result !== null && !res.headersSent) {
            res.json(result);
          }
        } catch (error) {
          next(error);
        }
      });
    });
    

    // setup express app here
    // ...

    // start express server
    app.listen(3003);

    // start listener for RabbitMQ
    rabbitMQService.connectWithRetry2(5, 5000, (error, connection) => {
      console.log("Connected to RabbitMQ");
      rabbitMQService.listen(connection, (message) => {
        const userId = (() => {
          try { return JSON.parse(message).UserID; }
          catch { return null; }
      })();
        console.log("Received message:", userId);
        deleteByUserID(userId);
      });
    });

    // insert new users for test
    await AppDataSource.manager.save(
      AppDataSource.manager.create(User, {
        firstName: "Timber",
        lastName: "Saw",
        age: 27,
        UserID: "0eaf6527-ae7e-41fa-afc7-7491f11dedbd"
      })
    );

    await AppDataSource.manager.save(
      AppDataSource.manager.create(User, {
        firstName: "Phantom",
        lastName: "Assassin",
        age: 24,
        UserID: "65eeee24-2f93-44b0-8709-63ecbbb9a698"
      })
    );

    console.log(
      `Express server has started on port 3003. Open http://localhost:3003/users to see results`
    );
  })
  .catch((error) => console.log(error));
