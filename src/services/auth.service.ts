/**
 * AUTH SERVICE - Authentication Service Layer
 * 
 * Chức năng:
 * - Xử lý đăng nhập, đăng ký
 * - Quản lý token và userId trong localStorage
 * - Cung cấp các utility methods để check authentication
 * 
 * API Spec:
 * - Login: POST /api/auth/login → {id, accessToken}
 * - Register: POST /api/auth/register → {isSuccess, message, userId}
 * 
 * LƯU Ý: Dùng fetch API trực tiếp thay vì axios để tránh conflict với baseURL và interceptors
 */

// ==================== INTERFACES ====================

export interface LoginResponse {
  id: string; // userId (UUID)
  accessToken: string; // JWT token
}

export interface RegisterResponse {
  isSuccess: boolean;
  message: string;
  userId: string; // UUID
}

// ==================== AUTH SERVICE ====================

export const authService = {
  /**
   * Đăng nhập
   * 
   * Flow:
   * 1. Gửi request POST /api/auth/login với username/password
   * 2. Nhận response {id, accessToken}
   * 3. Lưu accessToken và userId vào localStorage
   * 4. Trả về response
   * 
   * @param username - Email hoặc username (theo API spec, email map vào username field)
   * @param password - Mật khẩu
   * @returns Promise<LoginResponse>
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    // Dùng relative URL - Vite proxy sẽ forward đến backend
    // Tránh CORS vì browser nghĩ request đến cùng origin
    const url = "/api/auth/login";
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    
    // Lưu token và userId vào localStorage
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }
    if (data.id) {
      localStorage.setItem("userId", data.id);
    }
    
    return data;
  },

  /**
   * Đăng ký
   * 
   * Flow:
   * 1. Gửi request POST /api/auth/register với username/password
   * 2. Nhận response {isSuccess, message, userId}
   * 3. Trả về response (KHÔNG tự động đăng nhập)
   * 
   * @param username - Email hoặc username
   * @param password - Mật khẩu
   * @returns Promise<RegisterResponse>
   */
  register: async (username: string, password: string): Promise<RegisterResponse> => {
    // Dùng relative URL - Vite proxy sẽ forward đến backend
    // Tránh CORS vì browser nghĩ request đến cùng origin
    const url = "/api/auth/register";
    
    // Log để debug (chỉ trong development)
    if (import.meta.env.DEV) {
      console.log("📤 Register request:", { url, username });
    }
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        // Lấy chi tiết lỗi từ server
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const contentType = response.headers.get("content-type");
          
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            console.error("❌ Server error response:", errorData);
            
            // Backend trả về Results.BadRequest(e.Message) - có thể là string hoặc object
            if (typeof errorData === "string") {
              errorMessage = errorData;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.error) {
              errorMessage = typeof errorData.error === "string" 
                ? errorData.error 
                : Array.isArray(errorData.error) 
                  ? errorData.error.join(", ")
                  : JSON.stringify(errorData.error);
            } else if (errorData.title) {
              errorMessage = errorData.title;
            } else {
              // Thử parse toàn bộ object thành string
              errorMessage = JSON.stringify(errorData);
            }
          } else {
            // Nếu không phải JSON, đọc text
            const text = await response.text();
            errorMessage = text || response.statusText || `HTTP error! status: ${response.status}`;
          }
        } catch (parseError) {
          // Nếu không parse được, dùng status text
          console.error("❌ Error parsing response:", parseError);
          errorMessage = response.statusText || `HTTP error! status: ${response.status}`;
        }
        
        const error = new Error(errorMessage);
        (error as Error & { status?: number }).status = response.status;
        throw error;
      }

      const data: RegisterResponse = await response.json();
      
      if (import.meta.env.DEV) {
        console.log("✅ Register response:", data);
      }
      
      return data;
    } catch (error: unknown) {
      if (import.meta.env.DEV) {
        const err = error as Error;
        console.error("❌ Register error:", error);
        console.error("Error details:", {
          message: err?.message,
          name: err?.name,
        });
      }
      throw error;
    }
  },

  /**
   * Đăng xuất
   * 
   * Flow:
   * 1. Xóa accessToken và userId khỏi localStorage
   * 2. User sẽ bị redirect về /login khi gọi API tiếp theo (nhờ 401 handler)
   */
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
  },

  /**
   * Lấy userId hiện tại từ localStorage
   * 
   * @returns string | null - userId hoặc null nếu chưa đăng nhập
   */
  getUserId: (): string | null => {
    return localStorage.getItem("userId");
  },

  /**
   * Kiểm tra user đã đăng nhập chưa
   * 
   * @returns boolean - true nếu có accessToken trong localStorage
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },
};
 