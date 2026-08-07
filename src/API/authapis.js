import api from "./axios"

export const createProfile = (data)=>{
    return api.post('/user/profile/create-profile',data)
}

export const getUserProfileForKundli = ()=>{
    return api.get('/user/profile/profile-for-kundli')
}

export const getUserProfile = ()=>{
    return api.get('/user/profile/get-profile')
}


export const editUserProfile = (data)=>{
    return api.put('/user/profile/edit-profile',data)
}

export const verifyOtp = (data)=>{
    return api.post('/user/verify-otp',data)
}


