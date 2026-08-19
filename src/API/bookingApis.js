import api from '../API/axios'

export const scheduleBooking =  (data) => {
    return api.post('/bookings/schedule', data)
}


export const getMyBookings =  () => {
    return api.get('/bookings/user/my-bookings' )
}

export const cancelBooking = (bookingId) => {
  return api.post("/bookings/user/cancel", {
    bookingId: bookingId,
  });
};
export const rescheduleBooking =  (data) => {
    return api.post('/bookings/user/reschedule', data )
}


export const myWallet =  () => {
    return api.get('/wallet/balance')
}


export const addMoneyToWallet =  (data) => {
    return api.post('/wallet/add-money', data)
}

