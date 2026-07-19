import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Tag, Button, Spin, Empty } from "antd";
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import AvatarDisplay from "../components/AvatarDisplay";
import { getCategoryStyle } from "../utils/categoryStyle";

export default function QuizListPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Refresh data avatar terbaru dari backend, biar pose/topi/warna yang
  // ditampilkan di sini selalu sinkron sama yang terakhir disimpan user
  // (sama seperti pola yang dipakai di Navbar.jsx).
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    const parsedUser = JSON.parse(stored);

    const query = parsedUser.id
      ? `userId=${parsedUser.id}`
      : `email=${encodeURIComponent(parsedUser.email)}`;

    fetch(`/api/avatar/get?${query}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setUser((prev) => ({
          ...prev,
          warnaAvatar: data.color || prev.warnaAvatar,
          jenisTopi: data.hatId || prev.jenisTopi,
          poseId: data.poseId || prev.poseId,
          topiX: data.hatPositionX,
          topiY: data.hatPositionY,
          topiWidth: data.hatWidth,
          topiHeight: data.hatHeight,
          topiRotation: data.hatRotation || 0,
        }));
      })
      .catch(() => {
        // Gagal refresh avatar bukan hal fatal, tetap pakai data localStorage.
      });
  }, []);

  useEffect(() => {
    fetch("/api/quizzes")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil daftar kuis");
        return res.json();
      })
      .then((data) => setQuizzes(data))
      .catch((err) => {
        console.error(err);
        setErrorMsg("Gagal memuat daftar kuis dari server.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const hatSrc =
    user?.jenisTopi && user.jenisTopi !== "none"
      ? `/${user.jenisTopi}.svg`
      : null;
  const poseSrc = user?.poseId ? `/${user.poseId}.svg` : "/pose1.svg";

  return (
    <div className="min-h-screen bg-quiz-bg p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* HERO: avatar user siap tanding */}
        <div
          className="relative w-full bg-white rounded-[40px] shadow-2xl mt-4 mb-12 flex items-center border-4 border-white/60 animate-page-enter overflow-hidden"
          style={{ minHeight: 260 }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-[#e6f4ff] to-white">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-quiz-bg rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float-slow"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 px-10 py-10 w-full">
            <div className="shrink-0 relative">
              {/* Blob lembut di belakang avatar biar ada kedalaman, bukan cuma nempel di bg polos */}
              <div className="absolute inset-0 bg-quiz-light/30 rounded-full blur-2xl scale-110"></div>
              <div className="relative animate-float">
                <AvatarDisplay
                  size={220}
                  bgColor="transparent"
                  transparent
                  poseSrc={poseSrc}
                  hatSrc={hatSrc}
                  hatConfig={{
                    x: user?.topiX || 0,
                    y: user?.topiY || 0,
                    width: user?.topiWidth || 0,
                    height: user?.topiHeight || 0,
                    rotation: user?.topiRotation || 0,
                  }}
                />
              </div>
            </div>
            <div className="text-center md:text-left">
              <Tag
                color="#1591dc"
                className="w-fit mb-3 text-sm font-bold px-4 py-1.5 rounded-full border-none shadow-sm"
              >
                🎯 Arena Kuis
              </Tag>
              <h1 className="text-3xl md:text-4xl font-extrabold text-quiz-dark mb-2 leading-tight">
                Siap Bertanding, {user?.nama || "Sobat"}?
              </h1>
              <p className="text-gray-500 font-medium text-lg max-w-lg">
                Pilih salah satu kuis di bawah ini untuk mulai kumpulkan poin
                dan tunjukkan kehebatanmu!
              </p>
            </div>
          </div>
        </div>

        {/* LIST KUIS */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        )}

        {!isLoading && errorMsg && (
          <Empty description={errorMsg} className="py-20" />
        )}

        {!isLoading && !errorMsg && quizzes.length === 0 && (
          <Empty
            description="Belum ada kuis yang tersedia. Coba lagi nanti ya!"
            className="py-20"
          />
        )}

        {!isLoading && !errorMsg && quizzes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quizzes.map((quiz) => {
              const { icon: CategoryIcon, gradientClass, tagColor } =
                getCategoryStyle(quiz.kategori);
              return (
                <Card
                  key={quiz.id}
                  hoverable
                  className="rounded-3xl border-none shadow-lg overflow-hidden group cursor-pointer"
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                >
                  <div
                    className={`h-28 bg-linear-to-br ${gradientClass} flex justify-center items-center`}
                  >
                    <CategoryIcon className="text-5xl text-white opacity-80 group-hover:scale-125 transition-transform duration-500" />
                  </div>
                  <div className="p-5 bg-white">
                    <Tag
                      color={tagColor}
                      className="rounded-full mb-2 border-none font-bold"
                    >
                      {quiz.kategori}
                    </Tag>
                    <h3 className="text-xl font-bold text-quiz-dark mb-1">
                      {quiz.judul}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {quiz.deskripsi || "Yuk uji kemampuanmu di kuis ini!"}
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold text-quiz-primary mb-4">
                      <span>
                        <QuestionCircleOutlined /> {quiz.jumlahSoal} Soal
                      </span>
                      <span>
                        <ClockCircleOutlined /> {quiz.durasiMenit} Menit
                      </span>
                    </div>
                    <Button
                      type="primary"
                      shape="round"
                      block
                      icon={<PlayCircleOutlined />}
                      className="bg-quiz-primary hover:bg-quiz-light! border-none font-bold"
                      disabled={quiz.jumlahSoal === 0}
                    >
                      {quiz.jumlahSoal === 0 ? "Belum Ada Soal" : "Mulai Kuis"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}