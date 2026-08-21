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