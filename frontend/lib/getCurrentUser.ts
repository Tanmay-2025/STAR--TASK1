import { verifyToken } from "./auth";

export async function getCurrentUser(
  req: Request
) {
  const authHeader =
    req.headers.get("authorization");

  if (!authHeader) return null;

  const token = authHeader.replace(
    "Bearer ",
    ""
  );

  return verifyToken(token);
}