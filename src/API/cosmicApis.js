import api from "./axios"

export const getUserBanners = ()=>{
    return api.get('/banner/user-banners')
}

export const getCategories = ()=>{
    return api.get('/product/categories')
}


export const getFeaturedProducts = ()=>{
    return api.get('/product/featured-products')
}


export const getAllProducts = ()=>{
    return api.get('/product/all')
}


export const getAllCategories = ()=>{
    return api.get('/product/categories')
}



export const getProductById = (id)=>{
    return api.get(`/product/product/${id}`)
}

export const getRelatedProducts = (id)=>{
    return api.get(`/product/related-products/${id}`)
}


export const getCoupons = ()=>{
    return api.get(`/coupon/coupons`)
}

export const addToCart = (data)=>{
    return api.post(`/user/cart/add`,data)
}

export const getCart = ()=>{
    return api.get('/user/cart')
}


export const updateCartProduct = (data)=>{
    return api.put('/user/cart/update',data)
}
