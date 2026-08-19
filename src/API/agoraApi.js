import api from "./axios";

export const getActiveSessions = (category) => {
  const params = {};

  if (category && category !== "All Live") {
    params.category = category;
  }

  return api.get(`/agora/active-sessions`, {
    params,
  });
};

export const joinAgoraSession = (data) => {
  return api.post("/agora/join", data);
};
