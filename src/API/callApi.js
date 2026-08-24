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

// ==========================================
// VIDEO CALL APIs
// ==========================================

// Initiate Video Call
export const initiateVideoCall = (bookingId) => {
  return api.post("/video/call/initiate", {
    bookingId,
  });
};

// Join Video Call
export const joinVideoCall = (bookingId) => {
  return api.post("/video/call/join-call", {
    bookingId,
  });
};

// Settle Video Call
export const settleVideoCall = (bookingId, actualDuration) => {
  return api.post("/video/call/settle", {
    bookingId,
    actualDuration,
  });
};

// Terminate Video Call
export const terminateVideoCall = (bookingId, actualDuration) => {
  return api.post("/video/call/terminate", {
    bookingId,
    actualDuration,
  });
};