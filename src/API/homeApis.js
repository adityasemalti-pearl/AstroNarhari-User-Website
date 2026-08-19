import api from "./axios";

export const getDailyHoroscope = () => {
  return api.get("/match/get-daily-horoscope");
};


export const checkCompatibility = (data) => {
  return api.post("/match/check-compatibility",data);
};



export const generateKundali = (data) => {
  return api.post("/match/generate-kundali",data);
};


export const getAllAstrologers = async (params) => {
    const res = await api.get("/user/all-partners", {
        params,
    });

    return res.data;
};


export const getAstrologerById = (id) => {
  return api.get(`/partner/astrologerById/${id}`);
};

export const festivalCalender = (data) => {
  return api.post('/match/festivals',data);
};





export const deletePartnerByMobile = (number) => {
  return api.delete('/partner/delete-by-mobile', {
    data: {
      mobile: number,
    },
  });
};