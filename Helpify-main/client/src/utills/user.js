const userVariable = 'user'

export const getUser = () => localStorage.getItem(userVariable) ? JSON.parse(localStorage.getItem(userVariable)) : null
export const setUser = (user) => localStorage.setItem(userVariable, JSON.stringify(user))
export const clearUser = () => localStorage.clear();
