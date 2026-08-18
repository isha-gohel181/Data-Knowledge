const setTokensCookies = (res, accessToken, refreshToken) => {
  // Dynamically set secure flag — true for HTTPS, false for HTTP (local dev)
  const isSecure = res.req?.secure || res.req?.protocol === 'https' || false;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
  });

  res.cookie("is_auth", true, {
    httpOnly: false,
    secure: isSecure,
    sameSite: "lax",
  });
};

export { setTokensCookies };