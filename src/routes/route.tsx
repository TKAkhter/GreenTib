import React, { Suspense, lazy } from 'react';
import { Route, Routes } from "react-router-dom";
import { Loader } from "@/components/Loader";
import { AuthMiddleware } from '@/middlewares/AuthMiddleware';
import { DefaultLayout } from '@/layout/DefaultLayout';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Settings = lazy(() => import('@/pages/Settings'));
const FileView = lazy(() => import('@/components/FileUpload/FileView'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const AppRoutes: React.FC = () => {
  const authToken = useSelector((state: RootState) => state.auth.token);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* protected routes */}
        <Route element={<AuthMiddleware />}>
          <Route
            path="/"
            element={
              <DefaultLayout>
                <Login />
              </DefaultLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <DefaultLayout>
                <Dashboard />
              </DefaultLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <DefaultLayout>
                <Settings />
              </DefaultLayout>
            }
          />
          <Route
            path="/image/:id"
            element={
              <DefaultLayout>
                <FileView />
              </DefaultLayout>
            }
          />
        </Route>

        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound isAuthenticated={!!authToken} />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
