/**
 * REDIRECT TO LOGIN COMPONENT
 * 
 * Chức năng:
 * - Kiểm tra authentication status
 * - Redirect về /login nếu chưa đăng nhập
 * - Redirect về /home nếu đã đăng nhập
 * 
 * Flow:
 * 1. Component mount → Check isAuthenticated()
 * 2. Nếu chưa đăng nhập → Redirect /login
 * 3. Nếu đã đăng nhập → Redirect /home
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";

export const RedirectToLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
    } else {
      // Theo API spec, login thành công redirect về /home
      navigate("/home");
    }
  }, [navigate]);

  return null;
};




