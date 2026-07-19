import { Button, Tag} from "antd";
import { useNavigate } from "react-router-dom";
import {
  PlayCircleOutlined,
  FormatPainterOutlined,
} from "@ant-design/icons";
import pakElio from "../assets/pakElio.svg";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { nama: "Sobat" };

  return (
    <div className="min-h-11 bg-[#c4e2f5] p-8 font-sans overflow-x-hidden">
      <div className="max-w-6xl mx-auto mt-1">
        <div
          className="relative w-full bg-white rounded-[40px] shadow-2xl mt-21 mb-16 flex items-center border-4 border-white/60 animate-page-enter"
          style={{ minHeight: "380px" }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-[#e6f4ff] to-white rounded-[36px] overflow-hidden">
            <div className="absolute -top-12.5 -right-12.5 w-96 h-96 bg-[#c4e2f5] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float-slow"></div>
          </div>

          <div className="absolute bottom-0 left-10 w-[35%] h-full z-10 pointer-events-none select-none">
            <img
              src={pakElio}
              alt="Pak Elio"
              draggable="false"
              className="absolute bottom-0 left-0 h-[130%] object-contain origin-bottom drop-shadow-xl hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="relative z-20 w-full pl-[38%] pr-14 py-10 flex flex-col justify-center">
            <Tag
              color="#1591dc"
              className="w-fit mb-4 text-sm font-bold px-4 py-1.5 rounded-full border-none shadow-sm"
            >
              🌟 Selamat Datang Kembali!
            </Tag>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#2c5ead] mb-4 leading-tight tracking-tight">
              Halo, {user.nama}! <br /> Siap Cetak Rekor?
            </h1>

            <p className="text-gray-500 font-medium mb-8 text-lg max-w-lg">
              Pilih kuis pertamamu hari ini atau percantik avatarmu sebelum
              terjun ke arena pertandingan.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                style={{ fontWeight: 600 }}
                type="primary"
                size="large"
                shape="round"
                icon={<PlayCircleOutlined />}
                className="bg-[#1591dc] hover:bg-[#4bb8fa]! border-none font-bold shadow-lg h-14 px-8 text-lg"
                onClick={() => navigate("/quiz")}
              >
                Pilih Game
              </Button>

              <Button
                style={{ fontWeight: 600 }}
                size="large"
                shape="round"
                icon={<FormatPainterOutlined />}
                className="bg-white text-[#2c5ead] border-2 border-white font-bold h-14 px-8 text-lg hover:bg-transparent! hover:text-[#1591dc]! hover:border-[#1591dc]! shadow-md transition-all"
                onClick={() => navigate("/profile")}
              >
                Kustom Avatar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}