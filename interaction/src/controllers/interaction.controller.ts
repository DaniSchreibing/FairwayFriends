import { Request, Response } from "express";
import * as interactionService from "../services/interaction.service";
import { sendTestMessageToQueue } from "../services/rabbitmq.service";

export const createInteraction = async (req: Request, res: Response) => {
  try {
    const user = await interactionService.createInteraction(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getInteractions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await interactionService.getInteractions();
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getInteractionFromUserID = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await interactionService.getInteractionByUserID(
      req.params.userID
    );
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteInteraction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await interactionService.deleteInteraction(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteByUserID = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await interactionService.deleteByUserID(req.params.userID);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    try {
      sendTestMessageToQueue(req.params.userID);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
