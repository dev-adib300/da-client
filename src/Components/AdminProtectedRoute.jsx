
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AdminProtectedRoute = ({ children }) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const [authorized, setAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const verifyAdmin = async () => {
            const token = sessionStorage.getItem("adminToken");

            if (!token) {
                setChecking(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${API_URL}/api/admin/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.success) {
                    setAuthorized(true);
                }
            } catch (error) {
                sessionStorage.removeItem("adminToken");
                sessionStorage.removeItem("adminProfile");
                setAuthorized(false);
            } finally {
                setChecking(false);
            }
        };

        verifyAdmin();
    }, [API_URL]);

    if (checking) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <p className="text-[#D4AF37] text-sm">
                    Verifying administrator...
                </p>
            </div>
        );
    }

    if (!authorized) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
