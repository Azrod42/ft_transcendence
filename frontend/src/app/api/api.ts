import axios, {AxiosInstance} from 'axios';

interface PostArgs<T> {
	url: string;
	data?: T;
}

class Api {
	private static axiosInstance: AxiosInstance;

	static init() {
		this.axiosInstance = axios.create({
			baseURL: 'http://localhost:4000',
			withCredentials: true,
		})
	}
	static async get<ResponseType>(url: string){
		return await Api.axiosInstance.get<ResponseType>(url);
	}

	static async post<ResponseType, DataType = undefined>({url, data}: PostArgs<DataType>){
		return Api.axiosInstance.post<ResponseType>(url, data);
	}
}

export default Api;