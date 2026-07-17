import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { message } from 'antd';

function LoginButton() {
  const handleSuccess = async (credentialResponse) => {
    const decodedUser = jwtDecode(credentialResponse.credential);
    
    try {
      const res = await axios.post('http://localhost:8080/api/users/login', {
        email: decodedUser.email,
        nama: decodedUser.name
      });

      localStorage.setItem('user', JSON.stringify(res.data));
      message.success(`Selamat datang, ${res.data.nama}!`);
      window.location.href = '/dashboard'; 
    } catch (error) {
      message.error("Gagal terhubung ke server SmartQuiz!");
      console.error(error);
    }
  };

  return (
    <div className="shadow-md rounded-lg overflow-hidden inline-block hover:shadow-lg transition-shadow">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => message.error('Login Google Gagal!')}
        shape="rectangular"
        size="large"
        theme="filled_blue"
        text="signin_with"
      />
    </div>
  );
}

export default LoginButton;