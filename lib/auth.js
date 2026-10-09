export const USER_ID_KEY = "loggedInUserId";
export const ADMIN_KEY = "adminLoggedIn";

export function getLoggedInUserId() {
  if (typeof window === "undefined") {
    return null;
  }

  const id = localStorage.getItem(USER_ID_KEY);
  if (!id || id === "null" || id === "undefined" || id === "NaN" || id.trim() === "") {
    return null;
  }

  return id;
}

export function setLoggedInUserId(userId) {
  if (typeof window === "undefined") {
    return;
  }

  if (
    userId === null ||
    userId === undefined ||
    String(userId) === "null" ||
    String(userId) === "undefined" ||
    String(userId) === "NaN" ||
    String(userId).trim() === ""
  ) {
    localStorage.removeItem(USER_ID_KEY);
    return;
  }

  localStorage.setItem(USER_ID_KEY, String(userId));
}

export function clearLoggedInUserId() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(USER_ID_KEY);
}

export function isAdminLoggedIn() {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(ADMIN_KEY) === "true";
}

export function setAdminLoggedIn() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(ADMIN_KEY, "true");
}

export function clearAdminLoggedIn() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ADMIN_KEY);
}
