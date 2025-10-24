import type { LoginRequest } from "@/types";
import axios from "axios";
import Cookies from "js-cookie";

export async function login({ email, password }: LoginRequest): Promise<string>{

    await axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true
    });


    try{
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
            email,
            password
        }, {
            withCredentials: true,
            // withXSRFToken: true,
            headers: {
                // 'x-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN')
            }
        })
        return res.data.token;
    }catch(error){
        throw error;
    }
}
