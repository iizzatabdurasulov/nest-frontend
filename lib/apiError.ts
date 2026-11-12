export function apiError(error: unknown): string {
  if (typeof error === "object" && error !== null && "status" in error) {
    if (error.status === 401)
      return "Email yoki parol noto‘g‘ri, yoki sessiya tugagan. Qayta kiring.";
    if (error.status === 403)
      return "Bu amal uchun admin yoki owner huquqi kerak.";
    if (
      "data" in error &&
      typeof error.data === "object" &&
      error.data !== null &&
      "message" in error.data
    ) {
      const message = error.data.message;
      if (Array.isArray(message)) return message.join(". ");
      if (typeof message === "string") return message;
    }
  }
  return "So‘rov bajarilmadi. Server bilan aloqani tekshiring.";
}
