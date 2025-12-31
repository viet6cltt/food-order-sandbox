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