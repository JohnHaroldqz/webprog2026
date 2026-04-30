import axios from "axios";
import { saveSession, session } from "../auth/Session";

const axiosConfig = axios.create({
	baseURL: import.meta.env.VITE_SERVER_BASE_URL + '/api',
	headers: {
		'Content-Type': 'application/json'
	}
});

axiosConfig.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true
			if (session) {
				const refreshToken = session.refreshToken
				try {
					const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/refresh`, { refreshToken: refreshToken })
					console.log(response)
					// don't use axios instance that already configured for refresh token api call
					const newAccessToken = response.data
					session.accessToken = newAccessToken
					saveSession()	//set new access token
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					return axios(originalRequest); //recall Api with new token
				} catch (error) {
					console.log(error)
					// Handle token refresh failure
					// mostly logout the user and re-authenticate by login again
				}
			}
		}
		return Promise.reject(error);
	}
);

export default axiosConfig;
