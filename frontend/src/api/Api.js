import axios from "axios";

// Creating an instance of axios
const Api = axios.create({
    baseURL: "http://localhost:5500",
    withCredentials: true, // Required for CSRF cookies
    headers: {
        "Access-Control-Allow-Credentials": "true",
    }
});

// Fetch CSRF Token
const fetchCSRFToken = async () => {
    try {
        const response = await axios.get("http://localhost:5500/csrf-token", { withCredentials: true });
        return response.data.csrfToken;
    } catch (error) {
        console.error("Failed to fetch CSRF token", error);
        return null;
    }
};

// Function to attach CSRF token and Authorization header
const withCSRF = async (config = {}) => {
    const csrfToken = await fetchCSRFToken();
    return {
        ...config,
        headers: {
            ...config.headers,
            'csrf-token': csrfToken, // Attach CSRF token
            'authorization': `Bearer ${localStorage.getItem('token')}`, // Attach Auth token
        },
    };
};

// API Endpoints with CSRF Protection

// Test API
export const testnewApi = () => Api.get('/print');

// User APIs
export const registerUserApi = async (data) => Api.post('/api/user/create', data, await withCSRF());
export const loginUserApi = async (data) => Api.post('/api/user/login', data, await withCSRF());
export const homepageUserApi = async (data) => Api.post('/api/user/homepage', data, await withCSRF());
export const updateUserApi = async (id, data) => Api.put(`/api/user/update-profile/${id}`, data, await withCSRF());
export const logoutUserApi = async () => Api.get('/api/user/logout', await withCSRF());
export const deleteUserApi = async (id) => Api.delete(`/api/user/delete_user/${id}`, await withCSRF());
export const getAllUsersApi = async () => Api.get(`/api/user/get_all_users`, await withCSRF());
export const profileUserApi = async (id) => Api.get(`/api/user/profile/${id}`, await withCSRF());

// Product APIs
export const productApi = () => Api.get('/api/products/get_all_products');
export const singleProductApi = (id) => Api.get(`/api/products/get_single_product/${id}`);
export const deleteProductApi = async (id) => Api.delete(`/api/products/delete_product/${id}`, await withCSRF());
export const updateProductApi = async (id, data) => Api.put(`/api/products/update_product/${id}`, data, await withCSRF());
export const createProductApi = async (data) => Api.post('/api/products/create', data, await withCSRF());
export const searchProductApi = async (data) => Api.post('/api/products/search', data, await withCSRF());

// Category APIs
export const categoryApi = () => Api.get('/api/categories/get_all_categories');
export const createCategoryApi = async (data) => Api.post('/api/categories/create', data, await withCSRF());
export const deleteCategoryApi = async (id) => Api.delete(`/api/categories/delete_category/${id}`, await withCSRF());
export const updateCategoryApi = async (id, data) => Api.put(`/api/categories/update_category/${id}`, data, await withCSRF());
export const singleCategoryApi = (id) => Api.get(`/api/categories/get_single_category/${id}`);

// Review APIs
export const addReviewApi = async (data) => Api.post('/api/reviews/create', data, await withCSRF());
export const fetchReviewsApi = (productId) => Api.get(`/api/reviews/${productId}`);

// Cart APIs
export const cartApi = (id) => Api.get(`/api/carts/${id}`);
export const createCartApi = async (data) => Api.post('/api/carts/create', data, await withCSRF());
export const deleteCartApi = async (id) => Api.delete(`/api/carts/delete_cart/${id}`, await withCSRF());
export const updateCartApi = async (id, data) => Api.put(`/api/carts/update_cart/${id}`, data, await withCSRF());
export const singleCartApi = (id) => Api.get(`/api/carts/get_single_cart/${id}`);

// Order APIs
export const orderApi = () => Api.get('/api/orders');
export const createOrderApi = async (data) => Api.post('/api/orders/create', data, await withCSRF());
export const deleteOrderApi = async (id) => Api.delete(`/api/orders/${id}`, await withCSRF());
export const updateOrderApi = async (id, data) => Api.put(`/api/orders/update_order/${id}`, data, await withCSRF());
export const singleOrderApi = (id) => Api.get(`/api/orders/${id}`);
export const singleOrderApiDetails = (id) => Api.get(`/api/orders/get_single_order/${id}`);

// Additional APIs
export const userApi = () => Api.get('/api/user/get_all_users');
export const fetchProductDetails = async (data) => Api.post('/api/products/bulk', data, await withCSRF());
export const updateOrderPaymentStatus = async (id, data) => Api.put(`/api/orders/update_payment_status/${id}`, data, await withCSRF());
 