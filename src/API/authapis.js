import api from "./axios"

export const createProfile = (data)=>{
    return api.post('/user/profile/create-profile',data)
}