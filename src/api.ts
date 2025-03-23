export const getOrdersByUserId = async (userId: number): Promise<Order[]> => {
  try {
    const response = await api.get(`/orders?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    throw error;
  }
}; 