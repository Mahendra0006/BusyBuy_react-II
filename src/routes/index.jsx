import { Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants/routeConstants.jsx";
import HomePage from "../pages/HomePage.jsx";
import SigninForm from "../pages/SigninForm.jsx";
import SignupForm from "../pages/SignupForm.jsx";
import CartPage from "../pages/CartPage.jsx";
import AddProductPage from "../pages/AddProductPage.jsx";
import OrdersPage from "../pages/OrdersPage.jsx";
import OrderDetailsPage from "../pages/OrderDetailsPage.jsx";
import EditProductPage from "../pages/EditProductPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.HOME} element={<HomePage />} />
    <Route path="/signin" element={<SigninForm />} />
    <Route path={ROUTES.SIGNUP} element={<SignupForm />} />
    <Route
      path={ROUTES.CART}
      element={
        <ProtectedRoute>
          <CartPage />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.ADD_PRODUCT}
      element={
        <ProtectedRoute>
          <AddProductPage />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.MY_ORDERS}
      element={
        <ProtectedRoute>
          <OrdersPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/order/:id"
      element={
        <ProtectedRoute>
          <OrderDetailsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.EDIT_PRODUCT}
      element={
        <ProtectedRoute>
          <EditProductPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
