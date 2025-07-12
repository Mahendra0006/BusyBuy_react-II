import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (userId, thunkAPI) => {
    try {
      const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(20)
      );
      const querySnapshot = await getDocs(ordersQuery);

      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch orders"
      );
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({ userId, items, total }, thunkAPI) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      if (!items || items.length === 0) {
        throw new Error("Order must contain at least one item");
      }
      if (total <= 0) {
        throw new Error("Total amount must be greater than zero");
      }

      const orderData = {
        userId,
        items,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);

      return { ...orderData, id: docRef.id };
    } catch (error) {
      console.error("Error creating order:", error);
      return thunkAPI.rejectWithValue({
        message: error.message || "Failed to create order",
        error: error,
      });
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, thunkAPI) => {
    try {
      const orderDoc = doc(db, "orders", orderId);
      await updateDoc(orderDoc, {
        status: "cancelled",
        updatedAt: new Date().toISOString(),
      });

      return orderId;
    } catch (error) {
      console.error("Error cancelling order:", error);
      return thunkAPI.rejectWithValue(
        error.message || "Failed to cancel order"
      );
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId, thunkAPI) => {
    try {
      const orderDoc = doc(db, "orders", orderId);
      await deleteDoc(orderDoc);

      return orderId;
    } catch (error) {
      console.error("Error deleting order:", error);
      return thunkAPI.rejectWithValue(
        error.message || "Failed to delete order"
      );
    }
  }
);

export const returnOrder = createAsyncThunk(
  "orders/returnOrder",
  async ({ orderId, reason }, thunkAPI) => {
    try {
      const orderDoc = doc(db, "orders", orderId);
      await updateDoc(orderDoc, {
        status: "returned",
        returnReason: reason,
        updatedAt: new Date().toISOString(),
      });

      return orderId;
    } catch (error) {
      console.error("Error returning order:", error);
      return thunkAPI.rejectWithValue(
        error.message || "Failed to return order"
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const orderIndex = state.items.findIndex(
          (order) => order.id === action.payload
        );
        if (orderIndex !== -1) {
          state.items[orderIndex].status = "cancelled";
          state.items[orderIndex].updatedAt = new Date().toISOString();
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(returnOrder.fulfilled, (state, action) => {
        const orderIndex = state.items.findIndex(
          (order) => order.id === action.payload
        );
        if (orderIndex !== -1) {
          state.items[orderIndex].status = "returned";
          state.items[orderIndex].updatedAt = new Date().toISOString();
          state.items[orderIndex].returnReason = action.meta.arg.reason;
        }
      })
      .addCase(returnOrder.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        const orderIndex = state.items.findIndex(
          (order) => order.id === action.payload
        );
        if (orderIndex !== -1) {
          state.items.splice(orderIndex, 1);
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default ordersSlice.reducer;
