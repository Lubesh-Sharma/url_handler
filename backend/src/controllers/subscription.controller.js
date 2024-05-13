import { Subscription } from "../models/Subscription.js";
import { asyncHandler } from "../utilities/asyncHandler.js";

export const get_All_SubscriptionPlan = asyncHandler(async (req, res) => {
    try {
      const subscriptions = await Subscription.find({});
      res.send(subscriptions);
    } catch (error) {
      res.status(500).send(error);
    }
  });

export const get_SubscriptionPlan_ById = asyncHandler(async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      res.status(404).send();
    } else {
      res.send(subscription);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});


export const Create_SubscriptionPlan = asyncHandler(async (req,res) => {
  try {
      const subscription = new Subscription(req.body);
      await subscription.save();
      res.status(201).send(subscription);
  } catch (error) {
      res.status(400).send(error);
  }
}) ;

export const Update_SubscriptionPlan = asyncHandler(async (req,res) => {
  try {
      const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!subscription) {
          return res.status(404).send();
      }
      res.send(subscription);
  } catch (error) {
      res.status(400).send(error);
  }
}) ;

export const Delete_SubscriptionPlan = asyncHandler(async (req,res) => {
  try {
      const subscription = await Subscription.findByIdAndDelete(req.params.id);
      if (!subscription) {
          return res.status(404).send();
      }
      res.send(subscription);
  } catch (error) {
      res.status(500).send(error);
  }
}) ;