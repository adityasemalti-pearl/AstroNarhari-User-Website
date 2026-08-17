import api from "./axios";

export const getActiveSessions = (category = "Property") => {
  return api.get(`/agora/active-sessions`, {
    params: { category },
  });
};

export const joinAgoraSession = (data) => {
  return api.post("/agora/join", data);
};
