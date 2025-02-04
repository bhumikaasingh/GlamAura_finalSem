import axios from "axios"

const Api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5500",
  withCredentials: true,
})

export const fetchCSRFToken = async () => {
  try {
    const response = await Api.get("/api/csrf-token")
    Api.defaults.headers["X-CSRF-Token"] = response.data.csrfToken
  } catch (error) {
    console.error("Failed to fetch CSRF token", error)
  }
}

// Interceptor to attach the Authorization header
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Auth APIs
export const registerUserApi = (data) => Api.post("/api/auth/register", data)
export const loginUserApi = (data) => Api.post("/api/auth/login", data)
export const logoutUserApi = () => Api.post("/api/auth/logout")
export const checkPasswordStrengthApi = (password) => Api.post("/api/auth/check-password-strength", { password })

// User APIs
export const getUserProfileApi = () => Api.get("/api/user/profile")
export const updateUserProfileApi = (data) => Api.put("/api/user/profile", data)
export const profileUserApi = (id) => Api.get(`/api/user/profile/${id}`)
export const updateUserApi = (id, data) => Api.put(`/api/user/update-profile/${id}`, data)
export const getAllUsersApi = () => Api.get("/api/user/get_all_users")
export const deleteUserApi = (id) => Api.delete(`/api/user/delete_user/${id}`)

// Product APIs
export const getAllProductsApi = () => Api.get("/api/products")
export const getProductByIdApi = (id) => Api.get(`/api/products/${id}`)
export const createProductApi = (data) => Api.post("/api/products", data)
export const updateProductApi = (id, data) => Api.put(`/api/products/${id}`, data)
export const deleteProductApi = (id) => Api.delete(`/api/products/${id}`)
export const productApi = () => Api.get("/api/products/get_all_products")
export const singleProductApi = (id) => Api.get(`/api/products/get_single_product/${id}`)

// Category APIs
export const getAllCategoriesApi = () => Api.get("/api/categories")
export const getCategoryByIdApi = (id) => Api.get(`/api/categories/${id}`)
export const createCategoryApi = (data) => Api.post("/api/categories", data)
export const updateCategoryApi = (id, data) => Api.put(`/api/categories/${id}`, data)
export const deleteCategoryApi = (id) => Api.delete(`/api/categories/${id}`)
export const categoryApi = () => Api.get("/api/categories/get_all_categories")
export const singleCategoryApi = (id) => Api.get(`/api/categories/get_single_category/${id}`)

// Review APIs
export const getReviewsByProductApi = (productId) => Api.get(`/api/reviews/product/${productId}`)
export const createReviewApi = (data) => Api.post("/api/reviews", data)
export const updateReviewApi = (id, data) => Api.put(`/api/reviews/${id}`, data)
export const deleteReviewApi = (id) => Api.delete(`/api/reviews/${id}`)
export const fetchReviewsApi = (productId) => Api.get(`/api/reviews/${productId}`)
export const addReviewApi = (data) => Api.post("/api/reviews/create", data)

// Cart APIs
export const getCartApi = () => Api.get("/api/cart")
export const addToCartApi = (data) => Api.post("/api/cart/add", data)
export const updateCartApi = (data) => Api.put("/api/cart/update", data)
export const removeFromCartApi = (productId) => Api.delete("/api/cart/remove", { data: { productId } })
export const cartApi = (id) => Api.get(`/api/carts/${id}`)
export const createCartApi = (data) => Api.post("/api/carts/create", data)

// Order APIs
export const createOrderApi = (data) => Api.post("/api/orders", data)
export const getUserOrdersApi = () => Api.get("/api/orders")
export const getOrderByIdApi = (id) => Api.get(`/api/orders/${id}`)
export const updateOrderStatusApi = (id, status) => Api.put(`/api/orders/${id}/status`, { status })
export const orderApi = () => Api.get("/api/orders")
export const singleOrderApi = (id) => Api.get(`/api/orders/${id}`)
export const singleOrderApiDetails = (id) => Api.get(`/api/orders/get_single_order/${id}`)
export const updateOrderApi = (id, data) => Api.put(`/api/orders/update_order/${id}`, data)
export const deleteOrderApi = (id) => Api.delete(`/api/orders/${id}`)

// Additional APIs
export const fetchProductDetails = async (data) => Api.post("/api/products/bulk", data)

export default Api