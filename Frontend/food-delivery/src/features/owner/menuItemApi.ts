import api from '../../services/apiClient';

export type CreateMenuItemPayload = {
  categoryId: string;
  name: string;
  price: number;
  description?: string;
  isAvailable?: boolean;
};

export async function createMenuItem(
  restaurantId: string,
  payload: CreateMenuItemPayload,
  imageFile?: File | null
) {
  if (imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);
    Object.entries(payload).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      formData.append(k, String(v));
    });

    const res = await api.post(`/restaurants/${restaurantId}/menu-item`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data?.menuItem ?? res.data?.menuItem ?? res.data;
  }

  const res = await api.post(`/restaurants/${restaurantId}/menu-item`, payload);
  return res.data?.data?.menuItem ?? res.data?.menuItem ?? res.data;
}

export async function deleteMenuItem(menuItemId: string) {
  const res = await api.delete(`/menu-items/${menuItemId}`);
  return res.data;
}
