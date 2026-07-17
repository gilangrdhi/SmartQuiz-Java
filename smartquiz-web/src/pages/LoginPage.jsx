import LoginButton from "../components/LoginButton";
import pakRusa from "../assets/pakRusa.svg";

function LoginPage() {
  return (
    <div className="min-h-screen bg-[#c4e2f5] flex items-center justify-center p-6 font-sans overflow-hidden select-none">
      <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl flex flex-col md:flex-row border-4 border-white/50 relative animate-page-enter">
        <div className="md:w-[45%] bg-[#2c5ead] rounded-t-[36px] md:rounded-tr-none md:rounded-l-[36px] relative p-8 flex flex-col items-center justify-center min-h-112.5 select-none">
          <div className="absolute top-12 left-8 w-16 h-16 rounded-full bg-white/10 animate-float-slow blur-[2px]"></div>
          <div className="absolute bottom-16 right-12 w-24 h-24 rounded-full bg-white/10 animate-float-delayed blur-xs"></div>
          <div className="absolute -top-6 -right-48 bg-white text-[#2c5ead] px-6 py-4 rounded-3xl shadow-xl font-bold text-sm text-center w-72 z-40 animate-float-slow border border-gray-100">
            "Halo! Aku Pak Rusa. Sudah siap menguji wawasanmu hari ini?"
            <div className="absolute bottom-4 -left-3 w-0 h-0 border-y-12 border-y-transparent border-r-16 border-r-white transform -rotate-6"></div>
          </div>
          <img
            src={pakRusa}
            alt="Pak Rusa"
            draggable="false"
            className="absolute bottom-0 -right-16 h-[115%] object-bottom object-contain z-20 drop-shadow-2xl pointer-events-none hover:scale-105 transition-transform duration-700 origin-bottom"
          />
        </div>
        <div className="md:w-[55%] p-12 pl-24 flex flex-col justify-center items-center bg-white rounded-r-[40px] relative z-10">
          <div className="text-center mb-10 mt-10">
            <h1 className="text-4xl font-extrabold text-[#2c5ead] mb-3 tracking-tight">
              Selamat Datang!
            </h1>
            <p className="text-[#1591dc] font-semibold text-base">
              Masuk ke arena dan mulai berpetualang.
            </p>
          </div>
          <div className="hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-md rounded-lg">
            <LoginButton />
          </div>
          <div className="mt-20 w-full text-center border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-400 font-medium px-4 leading-relaxed">
              Gunakan akun Google-mu untuk menyimpan skor <br /> dan mengatur
              avatar awan kustom!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
