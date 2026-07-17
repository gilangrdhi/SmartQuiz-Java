import { Button, Tag, Card } from "antd";
import { useNavigate } from "react-router-dom";
import {
  PlayCircleOutlined,
  FormatPainterOutlined,
  TrophyOutlined,
  GlobalOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";
import pakRusa from "../assets/pakRusa.svg";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { nama: "Sobat" };

  return (
    <div className="min-h-screen bg-[#c4e2f5] p-8 font-sans overflow-x-hidden">
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
              src={pakRusa}
              alt="Pak Rusa"
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
                type="primary"
                size="large"
                shape="round"
                icon={<PlayCircleOutlined />}
                className="bg-[#1591dc] hover:bg-[#4bb8fa]! border-none font-bold shadow-lg h-14 px-8 text-lg"
              >
                Pilih Game
              </Button>

              <Button
                size="large"
                shape="round"
                icon={<FormatPainterOutlined />}
                className="bg-white text-[#2c5ead] border-2 border-white font-bold h-14 px-8 text-lg hover:bg-transparent! hover:text-[#1591dc]! hover:border-[#1591dc]! shadow-md transition-all"
                onClick={() => navigate("/custom-avatar")}
              >
                Kustom Ava
              </Button>
            </div>
          </div>
        </div>

        <div className="animate-page-enter" style={{ animationDelay: "0.2s" }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-[#2c5ead] flex items-center gap-2">
              🔥 Rekomendasi Kuis Untukmu
            </h2>
            <a
              href="/dashboard"
              className="text-[#1591dc] font-bold hover:text-[#2c5ead] transition-colors"
            >
              Lihat Semua ➔
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              hoverable
              className="rounded-3xl border-none shadow-lg overflow-hidden group cursor-pointer"
            >
              <div className="h-32 bg-linear-to-br from-[#1591dc] to-[#4bb8fa] flex justify-center items-center">
                <TrophyOutlined className="text-5xl text-white opacity-80 group-hover:scale-125 transition-transform duration-500" />
              </div>
              <div className="p-5 bg-white">
                <Tag
                  color="volcano"
                  className="rounded-full mb-2 border-none font-bold"
                >
                  Umum
                </Tag>
                <h3 className="text-xl font-bold text-[#2c5ead] mb-1">
                  Cerdas Cermat Cepat
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Uji wawasan umummu dengan 20 soal campuran yang menantang!
                </p>
                <p className="text-xs font-bold text-[#1591dc]">
                  1.2k Pemain • 15 Menit
                </p>
              </div>
            </Card>

            <Card
              hoverable
              className="rounded-3xl border-none shadow-lg overflow-hidden group cursor-pointer"
            >
              <div className="h-32 bg-linear-to-br from-[#52c41a] to-[#73d13d] flex justify-center items-center">
                <GlobalOutlined className="text-5xl text-white opacity-80 group-hover:scale-125 transition-transform duration-500" />
              </div>
              <div className="p-5 bg-white">
                <Tag
                  color="green"
                  className="rounded-full mb-2 border-none font-bold"
                >
                  Geografi
                </Tag>
                <h3 className="text-xl font-bold text-[#2c5ead] mb-1">
                  Jelajah Nusantara
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Seberapa kenal kamu dengan ibu kota dan provinsi di Indonesia?
                </p>
                <p className="text-xs font-bold text-[#1591dc]">
                  850 Pemain • 10 Menit
                </p>
              </div>
            </Card>

            <Card
              hoverable
              className="rounded-3xl border-none shadow-lg overflow-hidden group cursor-pointer"
            >
              <div className="h-32 bg-linear-to-br from-[#fadb14] to-[#ffec3d] flex justify-center items-center">
                <CalculatorOutlined className="text-5xl text-white opacity-80 group-hover:scale-125 transition-transform duration-500" />
              </div>
              <div className="p-5 bg-white">
                <Tag
                  color="gold"
                  className="rounded-full mb-2 border-none font-bold"
                >
                  Matematika
                </Tag>
                <h3 className="text-xl font-bold text-[#2c5ead] mb-1">
                  Logika & Angka
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Latih ketangkasan berhitung dan logika matematikamu di sini.
                </p>
                <p className="text-xs font-bold text-[#1591dc]">
                  3.4k Pemain • 20 Menit
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
