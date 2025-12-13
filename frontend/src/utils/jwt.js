export const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

export const isTokenExpired = (token) => {
    const decoded = parseJwt(token);
    if (!decoded) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
};

export const getUserRole = (token) => {
    const decoded = parseJwt(token);
    return decoded ? decoded.role : null;
};
