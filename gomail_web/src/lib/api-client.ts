import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 如果是服务器端调用，则config.headers中可能已包含认证信息
    if (config.headers.Authorization) {
      return config;
    }
    // 浏览器环境下，从 Cookie 读取 token
    if (typeof window !== "undefined") {
      const token = Cookies.get("gomail_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    const body = response.data;

    // 首先检查是否存在error字段，如果存在且不为空，则拒绝Promise
    if (body && typeof body.error !== 'undefined' && body.error) {
      return Promise.reject(new Error(body.error));
    }
    
    // 接下来，检查是否存在data字段
    if (body && typeof body.data !== 'undefined') {
      // 如果同时存在pagination字段，说明是分页数据
      if (body.pagination && Array.isArray(body.data)) {
        return {
          records: body.data,
          pagination: {
            page: body.pagination.page,
            pageSize: body.pagination.page_size,
            total_records: body.pagination.total,
            total_pages: body.pagination.total_pages,
          },
        };
      }
      // 如果没有pagination字段，直接返回data字段的内容
      return body.data;
    }

    // 如果响应体既没有error字段也没有data字段，这可能是一个非标准响应
    // 但如果它是一个有效的JSON（例如，一个直接的数组或对象），我们也应该接受它
    return body;
  },
  (error: AxiosError) => {
    // 处理 HTTP 状态码不为 2xx 的错误
    let errorMessage = "An unknown error occurred";

    if (error.response) {
      // 尝试从 error.response 中解析后端返回的错误信息
      const errorData = error.response.data as { error?: string; message?: string };
      errorMessage = errorData?.error || errorData?.message || `Request failed with status code ${error.response.status}`;
      console.error("API Error Response:", error.response.data);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      errorMessage = "No response received from server.";
      console.error("API Error Request:", error.request);
    } else {
      // 设置请求时触发了一个错误
      errorMessage = error.message;
      console.error("API Error Message:", error.message);
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient; 