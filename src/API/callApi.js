import api from "./axios"

export const initiateCall = (data) => {
    return api.post('/call/initiate-call', data)
}

export const terminateCall = (data) => {
    return api.post('/call/terminateCall', data)
}


