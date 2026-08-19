import api from "./axios";

export const getActiveSessions = () => {
  return api.get(`/agora/active-sessions`);
};

export const joinAgoraSession = (data) => {
  return api.post("/agora/join", data);
};