export type ApiResponse<T> = ApiResponseError | ApiResponseSuccess<T>;

export interface ApiResponseSuccess<T> {
  isSuccess: true;
  msg?: string | null;
  data: T;
}

export interface ApiResponseError {
  isSuccess: false;
  error: string;
}

export function newResponseSuccess<T>(
  data: T,
  msg?: string
): ApiResponseSuccess<T> {
  const res: ApiResponseSuccess<T> = {
    isSuccess: true,
    msg: msg,
    data: data,
  };

  return res;
}

export function newResponseError(error: string): ApiResponseError {
  const res: ApiResponseError = {
    isSuccess: false,
    error: error,
  };

  return res;
}
