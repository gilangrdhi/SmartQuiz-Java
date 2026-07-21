import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Progress,
  Tag,
  Spin,
  Result,
  Modal,
  message,
} from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ThunderboltOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  LeftOutlined,
  RightOutlined,
  AppstoreOutlined,
  TrophyFilled,
  CheckCircleOutlined,
} from "@ant-design/icons";

import AvatarDisplay from "../components/AvatarDisplay";
import { getCategoryStyle } from "../utils/categoryStyle";
import pakElio from "../assets/pakElio.svg";

const OPTION_KEYS = ["A", "B", "C", "D"];
const POIN_PER_SOAL_BENAR = 100;

const IDLE_QUOTES = [
  "Ayo perhatikan soal di samping! Jangan sampai salah ya!",
  "Fokus, kamu pasti bisa jawab ini!",
  "Baca baik-baik ya, jangan buru-buru!",
];
const CORRECT_QUOTES = [
  "Betul sekali! Kamu memang jago!",
  "Mantap! Lanjutkan semangatnya!",
  "Yes! Pinter banget kamu!",
];
const WRONG_QUOTES = [
  "Yah, belum tepat. Semangat buat soal berikutnya!",
  "Hampir! Coba lebih teliti lagi ya.",
  "Gapapa, yang penting sudah coba. Lanjut!",
];

function getElioReaction(isAnswered, isCorrect, questionIndex) {
  if (!isAnswered) {
    return {
      quote: `"${IDLE_QUOTES[questionIndex % IDLE_QUOTES.length]}"`,
      textClass: "text-[#2c5ead]",
      badge: "",
    };
  }
  if (isCorrect) {
    return {
      quote: `"${CORRECT_QUOTES[questionIndex % CORRECT_QUOTES.length]}"`,
      textClass: "text-green-600",
      badge: "🎉",
    };
  }
  return {
    quote: `"${WRONG_QUOTES[questionIndex % WRONG_QUOTES.length]}"`,
    textClass: "text-orange-600",
    badge: "💭",
  };
}

function QuizRoom() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Pastikan user.id ada di localStorage untuk dikirim ke API
  const user = JSON.parse(localStorage.getItem("user")) || {
    id: 1,
    nama: "Sobat",
  };

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [hoveredOption, setHoveredOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isDaftarSoalVisible, setIsDaftarSoalVisible] = useState(false);

  const { mutate: submitQuizResult, isPending: isSubmitting } = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post(
        "http://localhost:8080/api/quizzes/submit-result",
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setIsFinished(true);
    },
    onError: (err) => {
      message.error(
        `Gagal menyimpan skor: ${err.response?.data || err.message}`,
      );
      setIsFinished(true);
    },
  });

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:8080/api/quizzes/${quizId}`).then((res) => {
        if (!res.ok) throw new Error("Kuis tidak ditemukan");
        return res.json();
      }),
      fetch(`http://localhost:8080/api/questions/quiz/${quizId}`).then(
        (res) => {
          if (!res.ok) throw new Error("Gagal mengambil soal");
          return res.json();
        },
      ),
    ])
      .then(([quizData, questionData]) => {
        setQuiz(quizData);
        setQuestions(questionData);
      })
      .catch((err) => {
        console.error(err);
        setLoadError("Gagal memuat kuis ini.");
      })
      .finally(() => setIsLoading(false));
  }, [quizId]);

  const correctCount = questions.reduce((count, q, idx) => {
    return answers[idx] === q.kunciJawaban ? count + 1 : count;
  }, 0);
  const score = correctCount * POIN_PER_SOAL_BENAR;
  const winRate =
    questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;
  const isWin = winRate >= 60;

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isAnswered = !!currentAnswer;
  const selectedOption = currentAnswer;

  const handleAnswer = (optionKey) => {
    if (isAnswered) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionKey }));
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setHoveredOption(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setHoveredOption(null);
    }
  };

  const executeSubmit = () => {
    submitQuizResult({
      userId: user.id,
      earnedPoints: score,
      isWin: isWin,
      usedBuffs: [],
    });
  };

  const handleFinishQuiz = () => {
    const answeredCount = Object.keys(answers).length;
    const unansweredCount = questions.length - answeredCount;

    if (unansweredCount > 0) {
      Modal.confirm({
        title: <span className="text-red-500 font-bold">Tunggu Dulu!</span>,
        content: `Kamu masih punya ${unansweredCount} soal yang belum dijawab. Yakin mau langsung dikumpulkan?`,
        okText: "Tetap Kumpulkan",
        cancelText: "Cek Lagi",
        okButtonProps: { danger: true, shape: "round", className: "font-bold" },
        cancelButtonProps: { shape: "round", className: "font-bold" },
        centered: true,
        onOk: executeSubmit,
      });
    } else {
      Modal.confirm({
        title: <span className="text-[#2c5ead] font-bold">Kuis Selesai!</span>,
        content:
          "Hebat, semua soal sudah kamu jawab! Yakin ingin melihat hasilnya sekarang?",
        okText: "Lihat Hasil",
        cancelText: "Batal",
        okButtonProps: {
          type: "primary",
          shape: "round",
          className: "bg-[#1591dc] font-bold",
        },
        cancelButtonProps: { shape: "round", className: "font-bold" },
        centered: true,
        onOk: executeSubmit,
      });
    }
  };

  const hatSrc =
    user.jenisTopi && user.jenisTopi !== "none"
      ? `/${user.jenisTopi}.svg`
      : null;
  const poseSrc = user.poseId ? `/${user.poseId}.svg` : "/pose1.svg";

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-[#c4e2f5] flex flex-col items-center justify-center gap-4">
        <Spin size="large" />
        <p className="text-[#2c5ead] font-bold animate-pulse">
          Menghitung dan menyimpan skormu...
        </p>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#c4e2f5] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  if (loadError)
    return (
      <div className="min-h-screen bg-[#c4e2f5] flex items-center justify-center p-6">
        <Result
          status="warning"
          title={loadError}
          extra={
            <Button type="primary" onClick={() => navigate("/quiz")}>
              Kembali ke List Kuis
            </Button>
          }
        />
      </div>
    );
  if (questions.length === 0)
    return (
      <div className="min-h-screen bg-[#c4e2f5] flex items-center justify-center p-6">
        <Result
          status="info"
          title="Kuis ini belum punya soal"
          extra={
            <Button type="primary" onClick={() => navigate("/quiz")}>
              Kembali ke List Kuis
            </Button>
          }
        />
      </div>
    );

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#c4e2f5] flex items-center justify-center p-4">
        <Card className="max-w-md w-full rounded-4xl shadow-2xl border-none overflow-hidden relative p-0 animate-page-enter">
          <div
            className={`absolute top-0 left-0 w-full h-32 ${isWin ? "bg-linear-to-r from-green-400 to-green-500" : "bg-linear-to-r from-orange-400 to-orange-500"}`}
          ></div>

          <div className="relative z-10 flex flex-col items-center pt-10 pb-6 px-6">
            <div className="bg-white p-5 rounded-full shadow-lg mb-5 flex items-center justify-center w-24 h-24">
              <TrophyFilled
                className={`text-6xl ${isWin ? "text-yellow-400" : "text-gray-300"}`}
              />
            </div>

            <h1 className="text-3xl font-extrabold text-gray-800 mb-1 text-center">
              {isWin ? "Luar Biasa!" : "Tetap Semangat!"}
            </h1>
            <p className="text-gray-500 font-bold mb-8 text-center text-sm">
              Kamu telah menyelesaikan kuis ini.
            </p>

            {/* Stats Grid */}
            <div className="w-full grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 rounded-2xl p-4 text-center shadow-sm border border-blue-100">
                <p className="text-[#1591dc] font-extrabold text-xs mb-1 uppercase tracking-wider">
                  Skor Total
                </p>
                <p className="text-3xl font-black text-[#2c5ead]">{score}</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-center shadow-sm border border-blue-100">
                <p className="text-[#1591dc] font-extrabold text-xs mb-1 uppercase tracking-wider">
                  Akurasi
                </p>
                <p className="text-3xl font-black text-[#2c5ead]">{winRate}%</p>
              </div>

              <div className="col-span-2 bg-green-50 rounded-2xl p-4 flex justify-between items-center shadow-sm border border-green-100 px-6">
                <div className="flex items-center gap-3">
                  <CheckCircleOutlined className="text-green-500 text-2xl" />
                  <span className="font-extrabold text-green-700">
                    Total Benar
                  </span>
                </div>
                <span className="font-black text-green-700 text-2xl">
                  {correctCount}{" "}
                  <span className="text-sm font-bold text-green-600/70">
                    / {questions.length}
                  </span>
                </span>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              shape="round"
              className="w-full bg-[#1591dc] hover:bg-[#4bb8fa]! border-none font-bold h-12 text-base shadow-md hover:shadow-lg transition-all"
              onClick={() => navigate("/quiz")}
            >
              Kembali ke Beranda Kuis
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const progressPercent = Math.round((currentIndex / questions.length) * 100);
  const elioReaction = getElioReaction(
    isAnswered,
    selectedOption === currentQuestion.kunciJawaban,
    currentIndex,
  );
  const categoryStyle = getCategoryStyle(quiz?.kategori);
  const CategoryIcon = categoryStyle.icon;

  return (
    <div className="min-h-screen bg-[#c4e2f5] p-4 md:p-6 flex flex-col items-center font-sans overflow-x-hidden">
      <div className="w-full max-w-5xl flex justify-between items-center bg-white/90 backdrop-blur-sm p-2 pr-4 md:p-3 md:pr-6 rounded-full shadow-sm border border-white mb-6 md:mb-10 animate-page-enter">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="rounded-full p-0.5 bg-linear-to-br from-[#1591dc] to-[#4bb8fa] shadow-sm">
            <div className="rounded-full bg-white p-0.5">
              <AvatarDisplay
                size={48}
                bgColor={user.warnaAvatar || "#87CEEB"}
                poseSrc={poseSrc}
                hatSrc={hatSrc}
                hatConfig={{
                  x: user.topiX || 0,
                  y: user.topiY || 0,
                  width: user.topiWidth || 0,
                  height: user.topiHeight || 0,
                  rotation: user.topiRotation || 0,
                }}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-base md:text-lg font-extrabold text-[#2c5ead] m-0 leading-tight">
              {user.nama}
            </h2>
            <span className="text-xs md:text-sm font-bold text-[#1591dc] mt-0.5">
              ⭐ Skor: {score}
            </span>
          </div>
        </div>

        <Button
          type="primary"
          shape="round"
          icon={<ThunderboltOutlined />}
          size="middle"
          className="bg-linear-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-[#2c5ead]! border-none! shadow-md font-extrabold flex items-center transition-transform hover:scale-105"
          title="Buff segera hadir!"
          disabled
        >
          <span className="hidden sm:inline">Buff</span>
        </Button>
      </div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 lg:gap-8 items-start mt-10 md:mt-12">
        <div className="w-full md:w-1/3 shrink-0 pt-8 md:pt-10 relative flex justify-center md:justify-end md:pr-4">
          <div className="relative w-full max-w-60 md:max-w-70">
            <div className="absolute -top-20 md:-top-24 -right-4 md:-right-8 w-56 md:w-64 bg-white border-2 border-[#1591dc] rounded-3xl p-3 md:p-4 shadow-xl z-50 transition-all duration-300">
              <div className="absolute -bottom-2.5 left-12 md:left-14 w-4 h-4 bg-white border-b-2 border-r-2 border-[#1591dc] rotate-45"></div>
              <p
                className={`text-center text-xs md:text-sm font-bold leading-relaxed m-0 ${elioReaction.textClass}`}
              >
                {elioReaction.quote}
                {isAnswered && (
                  <span className="ml-1 text-sm md:text-base align-middle inline-block animate-bounce">
                    {elioReaction.badge}
                  </span>
                )}
              </p>
            </div>

            <div className="relative bg-white shadow-xl p-3 md:p-4 pb-6 rounded-xl transition-transform duration-300 hover:-translate-y-1">
              <div
                className="relative w-full h-56 md:h-64 bg-linear-to-b from-[#4bb8fa] to-[#1591dc] rounded-lg z-10"
                style={{ clipPath: "inset(-150% -100% 0 -100%)" }}
              >
                <img
                  src={pakElio}
                  alt="Pak Elio"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[35%] w-[145%] max-w-none object-contain drop-shadow-2xl z-10"
                />
              </div>
              <div className="absolute -right-3 bottom-6 bg-[#1591dc] text-white px-5 py-1.5 shadow-lg -rotate-6 font-extrabold text-xs md:text-sm border-2 border-white z-20">
                Pak Elio
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <Card className="w-full rounded-3xl shadow-lg border-none relative overflow-hidden">
            <Progress
              percent={progressPercent}
              showInfo={false}
              strokeColor={{ "0%": "#1591dc", "100%": "#4bb8fa" }}
              trailColor="#e6f4ff"
              className="absolute top-0 left-0 w-full m-0 p-0"
              strokeWidth={8}
            />
            <div className="p-4 md:p-6 pt-8">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <span className="bg-[#4bb8fa] text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-xs">
                  Soal {currentIndex + 1} / {questions.length}
                </span>
                {quiz?.kategori && (
                  <Tag
                    color={categoryStyle.tagColor}
                    icon={<CategoryIcon />}
                    className="rounded-full border-none font-bold m-0 shadow-xs"
                  >
                    {quiz.kategori}
                  </Tag>
                )}
              </div>

              <h2 className="text-xl md:text-2xl font-extrabold text-[#2c5ead] mb-6 leading-relaxed">
                {currentQuestion.teksSoal}
              </h2>

              <div className="grid grid-cols-1 gap-3 mb-6">
                {OPTION_KEYS.map((key) => {
                  const optionText = currentQuestion[`opsi${key}`];
                  const isCorrectOption = key === currentQuestion.kunciJawaban;
                  const isSelected = key === selectedOption;
                  const isHovered = !isAnswered && hoveredOption === key;

                  let stateClass = "bg-white border-[#c4e2f5] text-[#2c5ead]";
                  let badgeClass = "bg-[#c4e2f5] text-[#1591dc]";

                  if (isHovered) {
                    stateClass =
                      "bg-[#1591dc] border-[#1591dc] text-white shadow-lg scale-[1.01]";
                    badgeClass = "bg-white/25 text-white";
                  }

                  if (isAnswered) {
                    if (isCorrectOption) {
                      stateClass =
                        "bg-green-500 text-white border-green-500 shadow-md scale-[1.02]";
                      badgeClass = "bg-white/25 text-white";
                    } else if (isSelected) {
                      stateClass = "bg-red-400 text-white border-red-400";
                      badgeClass = "bg-white/25 text-white";
                    } else {
                      stateClass =
                        "bg-white text-gray-400 border-[#c4e2f5] opacity-60";
                      badgeClass = "bg-[#c4e2f5] text-gray-400";
                    }
                  }

                  return (
                    <button
                      key={key}
                      onClick={() => handleAnswer(key)}
                      onMouseEnter={() => setHoveredOption(key)}
                      onMouseLeave={() =>
                        setHoveredOption((prev) => (prev === key ? null : prev))
                      }
                      disabled={isAnswered}
                      className={`w-full flex items-center gap-3 text-left transition-all duration-200 p-3.5 rounded-2xl border-2 font-bold text-base md:text-lg ${stateClass} ${isAnswered ? "cursor-default" : "cursor-pointer active:scale-95"}`}
                    >
                      <span
                        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold transition-colors duration-150 ${badgeClass}`}
                      >
                        {key}
                      </span>
                      <span className="flex-1">{optionText}</span>
                      {isAnswered && isCorrectOption && (
                        <CheckCircleFilled className="text-xl shrink-0 drop-shadow-md" />
                      )}
                      {isAnswered && isSelected && !isCorrectOption && (
                        <CloseCircleFilled className="text-xl shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-[#e6f4ff] gap-2">
                <Button
                  shape="round"
                  icon={<LeftOutlined />}
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="font-bold text-[#1591dc] border-[#1591dc]"
                >
                  <span className="hidden sm:inline">Sebelumnya</span>
                </Button>
                <Button
                  type="dashed"
                  shape="round"
                  icon={<AppstoreOutlined />}
                  onClick={() => setIsDaftarSoalVisible(true)}
                  className="font-bold text-[#2c5ead] border-[#2c5ead]"
                >
                  {currentIndex + 1} / {questions.length}
                </Button>
                <Button
                  type="primary"
                  shape="round"
                  className="bg-[#1591dc] hover:bg-[#4bb8fa]! border-none font-bold"
                  onClick={
                    currentIndex + 1 >= questions.length
                      ? handleFinishQuiz
                      : handleNext
                  }
                >
                  <span className="hidden sm:inline">
                    {currentIndex + 1 >= questions.length
                      ? "Selesai"
                      : "Selanjutnya"}
                  </span>
                  {currentIndex + 1 < questions.length && <RightOutlined />}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        title={
          <div className="text-center text-[#2c5ead] font-extrabold text-lg">
            Daftar Soal
          </div>
        }
        open={isDaftarSoalVisible}
        onCancel={() => setIsDaftarSoalVisible(false)}
        footer={null}
        centered
        width={350}
      >
        <div className="grid grid-cols-5 gap-3 mt-4">
          {questions.map((_, idx) => {
            const isCurrent = currentIndex === idx;
            const hasAnswered = !!answers[idx];
            let btnClass = "font-bold text-gray-500";
            let btnType = "default";

            if (isCurrent) {
              btnType = "primary";
              btnClass = "font-bold bg-[#1591dc]! border-none shadow-md";
            } else if (hasAnswered) {
              btnType = "default";
              btnClass = "font-bold border-[#1591dc]! text-[#1591dc]!";
            }

            return (
              <Button
                key={idx}
                type={btnType}
                className={btnClass}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsDaftarSoalVisible(false);
                }}
              >
                {idx + 1}
              </Button>
            );
          })}
        </div>
        <div className="mt-6 flex justify-center gap-4 text-xs font-bold text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#1591dc] rounded-full"></div> Saat ini
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-[#1591dc] rounded-full"></div>{" "}
            Terjawab
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-full"></div>{" "}
            Kosong
          </span>
        </div>
      </Modal>
    </div>
  );
}

export default QuizRoom;
