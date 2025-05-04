import axios from "axios";
import queryString from "query-string";

interface RequestOptions {
  params?: object;
  data?: object;
  headers?: {
    "Content-Type"?: string;
    Authorization?: string;
  };
}

class BackendClient {
  backend_url = process.env.BACKEND_URL || "http://localhost:4000";
  options: RequestOptions = {};

  constructor() {
    this.options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      this.options.headers = {
        Authorization: `Bearer ${accessToken}`,
      };
    }
  }

  get(service: string, query = {}) {
    return axios.get(`${this.backend_url}${service}`, {
      ...this.options,
      params: query,
    });
  }

  post(service: string, data = {}, options: unknown = null) {
    return axios.post(
      `${this.backend_url}${service}`,
      data,
      options !== null ? options : this.options
    );
  }

  put(service: string, data = {}) {
    return axios.put(`${this.backend_url}${service}`, data, this.options);
  }

  patch(service: string, query = {}, data = {}) {
    return axios.patch(
      `${this.backend_url}${service}?${queryString.stringify(query, {
        arrayFormat: "bracket",
      })}`,
      data,
      this.options
    );
  }

  delete(service: string, query = {}) {
    return axios.delete(
      `${this.backend_url}${service}?${queryString.stringify(query, {
        arrayFormat: "bracket",
      })}`,
      this.options
    );
  }
}

export { BackendClient };
