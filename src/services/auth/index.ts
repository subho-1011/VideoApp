import axios, { AxiosError } from "axios";

export const register_me = async (formData: any) => {
    try {
        const response = await axios.post("api/auth/register", formData);

        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const login_me = async (formData: any) => {
    try {
        const response = await axios.post("api/auth/login", formData);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<any>;
            if (axiosError.response) {
                console.log(axiosError.response);
            }
        }
    }
};

export const profile_me = async () => {
    try {
        console.log("Profile");
        const response = await axios.get("/api/auth/me");
        console.log(response.data);


        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const update_me = async (formData: any) => {
    try {
        console.log(formData);
        const response = await axios.put("/api/auth/me/update", formData);

        return response.data;
    } catch (error: any) {
        console.error(error.message);
    }
};

export const avatar_me = async (formData: any) => {
    try {
        console.log(formData);
        const response = await axios.put("/api/auth/me/avatar", formData);

        return response.data;
    } catch (error: any) {
        console.error(error.message);
    }
};
