// src/redux/slices/ordersSlice.js

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

// Fetch all orders
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
      const snapshot = await getDocs(ordersQuery);
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch orders"
      );
    }
  }
);

// Create order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({ userId, items, total }, thunkAPI) => {
    try {
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
      return thunkAPI.rejectWithValue(
        error.message || "Failed to create order"
      );
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, thunkAPI) => {
    try {
      const ref = doc(db, "orders", orderId);
      await updateDoc(ref, {
        status: "cancelled",
        updatedAt: new Date().toISOString(),
      });
      return orderId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to cancel order"
      );
    }
  }
);

// Delete order
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId, thunkAPI) => {
    try {
      const ref = doc(db, "orders", orderId);
      await deleteDoc(ref);
      return orderId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to delete order"
      );
    }
  }
);

// Return order
export const returnOrder = createAsyncThunk(
  "orders/returnOrder",
  async ({ orderId, reason }, thunkAPI) => {
    try {
      const ref = doc(db, "orders", orderId);
      await updateDoc(ref, {
        status: "returned",
        returnReason: reason,
        updatedAt: new Date().toISOString(),
      });
      return orderId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to return order"
      );
    }
  }
);

// Slice
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
      // Fetch
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
        state.error = action.payload;
      })

      // Create
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // Cancel
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const order = state.items.find((o) => o.id === action.payload);
        if (order) {
          order.status = "cancelled";
          order.updatedAt = new Date().toISOString();
        }
      })

      // Return
      .addCase(returnOrder.fulfilled, (state, action) => {
        const order = state.items.find((o) => o.id === action.payload);
        if (order) {
          order.status = "returned";
          order.returnReason = action.meta.arg.reason;
          order.updatedAt = new Date().toISOString();
        }
      })

      // Delete
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (order) => order.id !== action.payload
        );
      });
  },
});

export default ordersSlice.reducer;
