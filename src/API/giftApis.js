// src/api/giftApi.js

import api from "./axios";

// Get all active gifts for live stream
export const getActiveGifts = () => {
  return api.get("/gift/get-active-gifts");
};

// Get active gift details by ID
export const getGiftDetails = (giftId) => {
  return api.get(`/gift/activeGift-by-id/${giftId}`);
};

// Send gift during live stream
export const sendLiveGift = (data) => {
  return api.post("/gift/send-live-gifts", data);
};

// Get user's gift sending history
export const getMyGiftHistory = () => {
  return api.get("/gift/my-gift-history");
};