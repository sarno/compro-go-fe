export interface LoginResponse {
  meta: {
    status: boolean;
    message: string;
  };
  data: {
    token: string;
  };
}
