export const setToken = (adminInfo) => {
    localStorage.setItem('adminId', adminInfo.admin_id);
    localStorage.setItem('adminLevel', adminInfo.admin_level);
    localStorage.setItem('adminName', adminInfo.admin_name);
};

export const getToken = (tokenName) => {
    return localStorage.getItem(tokenName);
};

export const removeToken = () => {
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminLevel');
    localStorage.removeItem('adminName');
};

export const isAuthenticated = () => {
    return !!getToken('adminId');
}; 