import type { ChangePasswordRequest } from "@/types";
import axios from "axios";
import Cookies from "js-cookie";

export async function changePassword({ 
    currentPassword, 
    newPassword, 
    newPasswordConfirmation 
}: ChangePasswordRequest): Promise<void> {
    
    await axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true
    });

    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/user/change-password`, {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirmation
        }, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN')
            }
        });
    } catch (error) {
        throw error;
    }
}
