import api from "./axios";

// ==========================================
// Normal Call APIs
// ==========================================

export const initiateCall = (data) => {
  return api.post("/call/initiate-call", data);
};

export const terminateCall = (data) => {
  return api.post("/call/terminateCall", data);
};

// ==========================================
// Instant Call Session APIs
// ==========================================

export const initiateInstantCall = (data) => {
  return api.post("/session/user/request", {
    ...data,
    type: "call",
  });
};

export const getInstantCallStatus = (requestId) => {
  return api.get(`/session/user/request-status/${requestId}`);
};

export const cancelInstantCall = (data) => {
  return api.post("/session/user/cancel", data);
};

export const endInstantCall = (data) => {
  return api.post("/session/end", data);
};

// ==========================================
// Instant Chat Session APIs
// ==========================================

export const initiateInstantChat = (data) => {
  return api.post("/session/user/request", {
    ...data,
    type: "chat",
  });
};

export const getInstantChatStatus = (requestId) => {
  return api.get(
    `/session/user/request-status/${requestId}`
  );
};

export const cancelInstantChat = (requestId) => {
  return api.post("/session/user/cancel", {
    requestId,
  });
};






// =====================================================
// INITIATE VIDEO CALL
// POST /video-call/initiate
// =====================================================

export const initiateVideoCall = async (bookingId) => {
  return api.post("/video/call/initiate", {
    bookingId,
  });
};

// =====================================================
// JOIN VIDEO CALL
// POST /video-call/join-call
// =====================================================

export const joinVideoCall = async (bookingId) => {
  return api.post("/video/call/join-call", {
    bookingId,
  });
};

// =====================================================
// TERMINATE VIDEO CALL
// POST /video-call/terminate
// =====================================================

export const terminateVideoCall = async (
  bookingId,
  actualDuration
) => {
  return api.post("/video/call/terminate", {
    bookingId,
    actualDuration,
  });
};

// =====================================================
// SETTLE CALL
// POST /video-call/settle
//
// Normally backend/internal use ke liye.
// Frontend se directly call mat karo.
// =====================================================

export const settleVideoCall = async (bookingId) => {
  return api.post("/video/call/settle", {
    bookingId,
  });
};

// =====================================================
// REFUND VIDEO CALL
// POST /video-call/refund
//
// Normally backend/internal use ke liye.
// =====================================================

export const refundVideoCall = async (bookingId) => {
  return api.post("/video/call/refund", {
    bookingId,
  });
};