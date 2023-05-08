export const SESSION_ENDPOINT = `/api/pscale/session`;
export const SESSION_WITH_OTP_ENDPOINT = (session_otp) =>
  `/api/pscale/session-otp/${session_otp}`;
export const SESSION_UPDATE_ENDPOINT = (session_id) =>
  `/api/pscale/session/${session_id}`;
export const USER_ENDPOINT = `/api/pscale/user`;
export const USER_RESPONSE_ENDPOINT = `/api/pscale/user-response`;
export const QUESTION_ENDPOINT = `/api/pscale/question`;
export const QUESTION_WITH_ID_ENDPOINT = (question_id) =>
  `/api/pscale/question/${question_id}`;
