import React, { useState, FormEvent } from 'react';
import { FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { loginAPI } from '../../services/api';
import ErrorModal from '../../components/ErrorModal';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { getPatientProfile } from '../../services/apiPatient';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { setUser, setIsAuth } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorType, setErrorType] = useState<
        'LOGIN_FAILED' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'GENERIC'
    >('GENERIC');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await loginAPI(email, password);

            if (response?.data?.accessToken) {
                // Store token in localStorage
                localStorage.setItem('access_token', response.data.accessToken);
                localStorage.setItem('id', response.data.id);

                // Decode JWT to extract role
                try {
                    const decoded: any = jwtDecode(response.data.accessToken);
                    const roleClaimKey =
                        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
                    const role = decoded[roleClaimKey] || 'USER';

                    // Create and store user object with role
                    const user = {
                        id: response.data.id,
                        username: email,
                        role: role,
                    };
                    localStorage.setItem('user', JSON.stringify(user));

                    // Update auth context
                    setUser(user);
                    setIsAuth(true);

                    // If user is a patient, fetch and store patient profile
                    if (
                        role.toUpperCase() === 'USER' ||
                        role.toUpperCase() === 'PATIENT'
                    ) {
                        try {
                            const profileResponse = await getPatientProfile();
                            if (
                                profileResponse?.isSuccess &&
                                profileResponse.data
                            ) {
                                localStorage.setItem(
                                    'patient_profile',
                                    JSON.stringify(profileResponse.data)
                                );
                            }
                        } catch (profileError) {
                            console.error(
                                'Failed to fetch patient profile:',
                                profileError
                            );
                            // Continue with login even if profile fetch fails
                        }
                    }

                    // Role-based redirection
                    let redirectPath = '/patient'; // Default for USER role

                    switch (role.toUpperCase()) {
                        case 'ADMIN':
                            redirectPath = '/admin';
                            break;
                        case 'DOCTOR':
                            redirectPath = '/doctor';
                            break;
                        case 'RECEPTIONIST':
                            redirectPath = '/receptionist';
                            break;
                        case 'USER':
                        default:
                            redirectPath = '/patient';
                            break;
                    }

                    navigate(redirectPath);
                } catch (decodeError) {
                    console.error('Failed to decode token:', decodeError);
                    setErrorType('LOGIN_FAILED');
                    setErrorMessage(
                        'Có lỗi xảy ra khi xử lý thông tin đăng nhập'
                    );
                    setShowErrorModal(true);
                }
            } else {
                setErrorType('LOGIN_FAILED');
                setErrorMessage('Tên đăng nhập hoặc mật khẩu không đúng');
                setShowErrorModal(true);
            }
        } catch (error: any) {
            if (error?.response?.status === 400) {
                setErrorType('LOGIN_FAILED');
                setErrorMessage('Tên đăng nhập hoặc mật khẩu không đúng');
            } else if (error?.code === 'ERR_NETWORK') {
                setErrorType('NETWORK_ERROR');
                setErrorMessage(
                    'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
                );
            } else if (error?.response?.status >= 500) {
                setErrorType('SERVER_ERROR');
                setErrorMessage(
                    'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.'
                );
            } else {
                setErrorType('GENERIC');
                setErrorMessage(
                    error?.response?.data ||
                        error?.message ||
                        'Đã xảy ra lỗi. Vui lòng thử lại.'
                );
            }
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#E5F0FF] via-[#EFF4FF] to-[#DDEBFF] relative">
            <div className="w-full max-w-md px-4">
                <div className="bg-white rounded-2xl shadow-xl px-10 py-12">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-[#E0EDFF] flex items-center justify-center text-[#2563EB] mb-3">
                            <FiUser className="w-8 h-8" />
                        </div>
                        <h1 className="text-base font-semibold text-slate-800 text-center">
                            Hệ Thống Quản Lý Nha Khoa
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Đăng nhập để tiếp tục
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-slate-700">
                                Username
                            </label>
                            <input
                                placeholder="Nhập username của bạn"
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-slate-700">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Nhập mật khẩu"
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="w-4 h-4" />
                                    ) : (
                                        <FiEye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-xs">
                        <span className="text-slate-500">
                            Chưa có tài khoản?{' '}
                        </span>
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-[#2563EB] font-medium hover:underline"
                        >
                            Đăng ký tài khoản mới
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Modal */}
            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                errorType={errorType}
                customMessage={errorMessage}
            />
        </div>
    );
};

export default LoginPage;
