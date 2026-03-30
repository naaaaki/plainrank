import { handlers } from "@/auth";

/**
 * Auth.js の API ルートハンドラ
 * /api/auth/* へのリクエストをすべて Auth.js に委譲する。
 */
export const { GET, POST } = handlers;
