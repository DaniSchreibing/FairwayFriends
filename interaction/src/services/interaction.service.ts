import Interaction from "../models/interaction.model";

export const createInteraction = async (interactionData: any) => {
  try {
    const interaction = new Interaction(interactionData);
    await interaction.save();
    return interaction;
  } catch (error) {
      throw new Error("Error creating interaction: " + error);
  }
};

export const getInteractions = async () => {
  try {
    const interactions = await Interaction.find();
    return interactions;
  } catch (error) {
    throw new Error("Error creating interaction: " + error);
  }
};

export const getInteractionByUserID = async (userID: string) => {
  try {
    const interaction = await Interaction.find({ userID: userID });
    if (!interaction || interaction.length === 0) {
      throw new Error("Interaction not found");
    }
    return interaction;
  } catch (error) {
      throw new Error("Error getting interaction: " + error);
  }
};

export const deleteInteraction = async (interactionId: any) => {
  try {
    const interaction = await Interaction.findByIdAndDelete(interactionId);
    if (!interaction) {
      throw new Error("Interaction not found");
    }
    return interaction;
  } catch (error) {
      throw new Error("Error deleting interaction: " + error);
    }
  }

export const deleteByUserID = async (userID: string) => {
  try {
    const interaction = await Interaction.findOneAndDelete({ userID: userID });
    if (!interaction) {
      throw new Error("Interaction not found");
    }
    return interaction;
  } catch (error) {
    throw new Error("Error deleting interaction: " + error);
  };
};
