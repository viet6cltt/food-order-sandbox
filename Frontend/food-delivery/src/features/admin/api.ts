import api from "../../services/apiClient";

export const getReviewReports = async () => {
    const response = await api.get('/review-reports');
    console.log(response);
    return response.data.data;
};

export const handleReviewReport = async (id: string, data: { status: string, adminNote?: string }) => {
    const response = await api.patch(`/review-reports/${id}`, data);
    console.log(response);
    return response.data;
};

export const adminCategoryApi = {
    // router.get("/") - Lấy toàn bộ danh sách
    getAll: async (page: number = 1, limit: number = 10) => {
        const response = await api.get(`/categories?page=${page}&limit=${limit}`);

        console.log(response.data);
        return response.data.data;
    },

    // router.post("/") - Tạo mới
    create: async (name: string, description?: string) => {
        const response = await api.post('/admin/categories', { name, description });
        return response.data;
    },

    // router.put("/:categoryId") - Cập nhật thông tin
    update: async (id: string, name: string, description?: string) => {
        const response = await api.put(`/admin/categories/${id}`, { name, description });
        return response.data;
    },

    // router.patch("/:categoryId/active")
    active: async (id: string) => {
        const response = await api.patch(`/admin/categories/${id}/active`);
        return response.data;
    },

    // router.patch("/:categoryId/deactive")
    deactive: async (id: string) => {
        const response = await api.patch(`/admin/categories/${id}/deactive`);
        return response.data;
    },

    // router.delete("/:categoryId") - Xóa vĩnh viễn
    hardDelete: async (id: string) => {
        const response = await api.delete(`/admin/categories/${id}`);
        return response.data;
    }
};

export const adminUserApi = {
    // Lấy danh sách user theo filter (role, status, page...)
    getUsers: async (params: { role?: string; status?: string; page?: number; limit?: number }) => {
        const response = await api.get('/admin/users', { params });
        console.log(response.data);
        return response.data.data; // BE trả về { categories, pagination } hoặc tương tự
    },

    // Khóa tài khoản
    blockUser: async (userId: string) => {
        const response = await api.patch(`/admin/users/${userId}/block`);
        return response.data;
    },

    // Mở khóa tài khoản
    unlockUser: async (userId: string) => {
        const response = await api.patch(`/admin/users/${userId}/unlock`);
        return response.data;
    }
};

export const adminRestaurantApi = {
    // Lấy danh sách các yêu cầu đang chờ (pending)
    getPendingRequests: async () => {
        const response = await api.get('/admin/restaurant-requests'); // Đường dẫn route của bạn
        return response.data.data;
    },

    // Duyệt yêu cầu
    approveRequest: async (requestId: string) => {
        const response = await api.patch(`/admin/restaurant-requests/${requestId}/approve`);
        return response.data;
    },

    // Từ chối yêu cầu (kèm lý do)
    rejectRequest: async (requestId: string, reason: string) => {
        const response = await api.patch(`/admin/restaurant-requests/${requestId}/reject`, { reason });
        return response.data;
    }
};