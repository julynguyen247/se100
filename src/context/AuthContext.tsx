import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
    id: string;
    username: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuth: boolean;
    loading: boolean;
    setUser: (user: User | null) => void;
    setIsAuth: (isAuth: boolean) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("access_token");
            const storedUser = localStorage.getItem("user");

            if (!token || !storedUser) {
                setIsAuth(false);
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                setIsAuth(true);
                setUser(JSON.parse(storedUser));
            } catch (error) {
                setIsAuth(false);
                setUser(null);
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                localStorage.removeItem("id");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("id");
        setUser(null);
        setIsAuth(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuth, loading, setUser, setIsAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
