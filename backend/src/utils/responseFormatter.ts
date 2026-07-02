export type ApiResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

export function formatSuccess<T>(message: string, data?: T): ApiResponse<T> {
  return {
    success: true,
    message,
    ...(data === undefined ? {} : { data })
  };
}

export function formatError(message: string): ApiResponse {
  return {
    success: false,
    message
  };
}

