import { HttpLibrary } from "hztech-core";
import { HttpStatus, HttpEvent } from "@/constants/http";
import { HttpBusinessError } from "./error";

/**
 * 对象合并
 * @param source 来源对象
 * @param target 目标对象
 * @param defaults 默认对象
 */
function extend(source, target, defaults) {
  const sourceKeys = Object.keys(source).map((e) => ({
    k: e,
    t: e.toUpperCase(),
  }));
  Object.keys(target).forEach((key) => {
    const item = sourceKeys.find((e) => e.t === key.toUpperCase());
    source[item ? item.k : key] = target[key];
  });
  Object.keys(defaults).forEach((key) => {
    const item = sourceKeys.find((e) => e.t === key.toUpperCase());
    if (item) {
      if (source[item.k] === undefined) {
        source[item.k] = defaults[key];
      }
    } else {
      source[key] = defaults[key];
    }
  });
}

window["hconsole"] = [];

/**
 * 请求成功回调
 * @param response 响应信息
 */
function consoleSuccess(response) {
  const log = {
    state: 1,
    url: response.config.url,
    request: {
      body: response.config.data ? JSON.parse(response.config.data) : undefined,
      params: response.config.params,
    },
    response: response.data.data,
    datetime: new Date(),
  };
  window["hconsole"].unshift(log);
}

/**
 * 请求失败回调
 * @param error 错误信息
 */
function consoleError(error) {
  const log = {
    state: 2,
    url: error.config.url,
    datetime: new Date(),
  };
  window["hconsole"].unshift(log);
}

class Http extends HttpLibrary {
  onRequestBefore(config) {
    return super.onRequestBefore(config).then((config) => {
      const defaultConfig = {
        baseURL: import.meta.env.VITE_APP_BASE_API,
        redirect: true,
        throwError: false,
        toastError: true,
        allowAnonymous: false,
        headers: {},
      };

      const defaultHeaders = {
        "content-type": "application/json",
        Authorization: useUserStore().token,
      };
      extend(
        config,
        {},
        {
          ...defaultConfig,
          toastError:
            config.toastError === undefined
              ? config.throwError === undefined
                ? defaultConfig.toastError
                : !config.throwError
              : config.toastError,
        }
      );
      extend(config.headers, {}, defaultHeaders);

      return config;
    });
  }

  onResponseFulfilled(response) {
    return super.onResponseFulfilled(response).then((response) => {
      const { data, config, request } = response;

      const httpResponse = {
        status: 0,
        data: undefined,
        message: "",
      };

      if (data instanceof Blob) {
        httpResponse.data = data;
        return httpResponse;
      }

      Object.assign(httpResponse, {
        status: data.code,
        data: data.data,
        message: data.desc,
      });
      if (data.refreshPermission && useUserStore().token) {
        // useUserStore().getAuthList();
      }

      if (httpResponse.status === HttpStatus.SUCCESS) {
        consoleSuccess(response);
        return httpResponse;
      } else {
        const error = new Error(httpResponse.message);
        error["config"] = response.config;
        consoleError(error);
      }

      return this.handleResponseRejected(
        new HttpBusinessError({
          status: httpResponse.status,
          config: config,
          message: httpResponse.message,
          request: request,
          response: response,
        })
      );
    });
  }

  onResponseRejected(error) {
    const bussinessError = new HttpBusinessError({
      status: -1,
      message: error.message,
      config: error.config,
      request: error.request,
      response: error.response,
    });
    consoleError(error);
    return this.handleResponseRejected(bussinessError);
  }

  handleResponseRejected(error) {
    return new Promise((resolve, reject) => {
      this.handleThrowError(error).then(resolve, reject);
    });
  }

  handleThrowError(error) {
    return new Promise((_resolve, reject) => {
      if (
        error.status === HttpStatus.UNAUTHORIZED ||
        error.status === HttpStatus.ACTIVATION_ERROR
      ) {
        $app.emit(HttpEvent.onError, error);
      }
      const { config } = error;
      if (config) {
        if (config.throwError) {
          reject(error);
        }
        if (config.toastError) {
          $app.emit(HttpEvent.onError, error);
        }
      }
    });
  }

  get(url, data, config) {
    return super.get(url, data, config);
  }

  post(url, data, config) {
    return super.post(url, data, config);
  }

  put(url, data, config) {
    return super.put(url, data, config);
  }

  delete(url, data, config) {
    return super.delete(url, data, config);
  }

  form(url, data, config) {
    return super.form(url, data, config);
  }

  upload(url, data, config) {
    return http.form(url, data, config);
  }

  download(url, data, config) {
    return super.download(url, data, config);
  }
}

export const http = new Http();
