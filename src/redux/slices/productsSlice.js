import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return products;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch products"
      );
    }
  }
);

// Edit an existing product
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, product }, thunkAPI) => {
    const { getState } = thunkAPI;
    const { auth } = getState();
    const { user } = auth;

    if (!user) {
      return thunkAPI.rejectWithValue("Please login to edit products");
    }

    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        ...product,
        updatedAt: new Date().toISOString(),
        addedBy: {
          uid: user.uid,
          email: user.email,
        },
      });

      const docSnap = await getDoc(productRef);
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to edit product");
    }
  }
);

// Add a new product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product, thunkAPI) => {
    const { getState } = thunkAPI;
    const { auth } = getState();
    const { user } = auth;

    if (!user) {
      return thunkAPI.rejectWithValue("Please login to add products");
    }

    try {
      // Check if product already exists
      const existing = await getDocs(
        query(collection(db, "products"), where("title", "==", product.title))
      );
      if (!existing.empty) {
        return thunkAPI.rejectWithValue(
          "Product with this title already exists"
        );
      }

      // Add product
      const docRef = await addDoc(collection(db, "products"), {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        quantity: 1,
        addedBy: {
          uid: user.uid,
          email: user.email,
        },
      });

      const docSnap = await getDoc(docRef);
      const newProduct = {
        id: docRef.id,
        ...docSnap.data(),
      };

      // Handle category creation/update
      try {
        const categoryQuery = query(
          collection(db, "categories"),
          where("name", "==", product.category)
        );
        const snapshot = await getDocs(categoryQuery);

        if (snapshot.empty) {
          await addDoc(collection(db, "categories"), {
            name: product.category,
            count: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } else {
          const categoryDoc = snapshot.docs[0];
          await updateDoc(categoryDoc.ref, {
            count: increment(1),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (categoryError) {
        console.warn(
          "Category update failed, product still added.",
          categoryError
        );
      }

      return newProduct;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to add product");
    }
  }
);

// Cleanup unused products (optional utility)
export const cleanupProducts = createAsyncThunk(
  "products/cleanupProducts",
  async (_, thunkAPI) => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      for (const product of products) {
        if (product.title !== "Apple iPhone 15") {
          await deleteDoc(doc(db, "products", product.id));
        }
      }

      const updatedSnapshot = await getDocs(collection(db, "products"));
      const updatedProducts = updatedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return updatedProducts;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to clean up products"
      );
    }
  }
);

// Slice
const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    categories: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.categories = Array.from(
          new Set(action.payload.map((p) => p.category))
        ).map((name) => ({
          name,
          count: action.payload.filter((p) => p.category === name).length,
        }));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
        const category = state.categories.find(
          (c) => c.name === action.payload.category
        );
        if (category) {
          category.count += 1;
        } else {
          state.categories.push({ name: action.payload.category, count: 1 });
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to add product";
      })
      .addCase(cleanupProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.categories = Array.from(
          new Set(action.payload.map((p) => p.category))
        ).map((name) => ({
          name,
          count: action.payload.filter((p) => p.category === name).length,
        }));
      });
  },
});

export default productsSlice.reducer;
