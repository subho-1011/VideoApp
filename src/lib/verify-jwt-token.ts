import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { TOKEN } from "@/constants/constants";

type Token = {
    _id: string;
    username: string;
    email: string;
};

export const verifyJwtToken = ({ token }: { token: string }) => {
    const getToken = cookies().get(token);
    if (!getToken) {
        return false;
    }

    const verifyToken = jwt.verify(getToken.value, TOKEN.secret) as Token;
    if (!verifyToken) {
        return false;
    }
    return verifyToken;
};
