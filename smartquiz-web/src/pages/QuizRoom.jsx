import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Progress, Tag, Spin, Result } from "antd";
import {
  ThunderboltOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
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

  const user = JSON.parse(localStorage.getItem("user")) || { nama: "Sobat" };

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/quizzes/${quizId}`).then((res) => {
        if (!res.ok) throw new Error("Kuis tidak ditemukan");
        return res.json();
      }),
      fetch(`/api/questions/quiz/${quizId}`).then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil soal");
        return res.json();
      }),
    ])
      .then(([quizData, questionData]) => {
        setQuiz(quizData);
        setQuestions(questionData);
      })
      .catch((err) => {
        console.error(err);
        setLoadError(
          "Gagal memuat kuis ini. Kuis mungkin belum punya soal atau sudah dihapus.",
        );
      })
      .finally(() => setIsLoading(false));
  }, [quizId]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (optionKey) => {
    if (isAnswered) return;

    setSelectedOption(optionKey);
    setIsAnswered(true);

    if (optionKey === currentQuestion.kunciJawaban) {
      setScore((prev) => prev + POIN_PER_SOAL_BENAR);
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsFinished(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setIsAnswered(false);
    setHoveredOption(null);
  };

  const hatSrc =
    user.jenisTopi && user.jenisTopi !== "none"
      ? `/${user.jenisTopi}.svg`
      : null;
  const poseSrc = user.poseId ? `/${user.poseId}.svg` : "/pose1.svg";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#c4e2f5] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (loadError) {
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
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#c4e2f5] flex items-center justify-center p-6">
        <Result
          status="info"
          title="Kuis ini belum punya soal"
          subTitle="Coba pilih kuis lain dulu ya, atau tunggu Pak Elio nambahin soalnya."
          extra={
            <Button type="primary" onClick={() => navigate("/quiz")}>
              Kembali ke List Kuis
            </Button>
          }
        />
      </div>
    );
  }

  if (isFinished) {
    const winRate = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="min-h-screen bg-[#c4e2f5] flex items-center justify-center p-6">
        <Card className="max-w-lg w-full rounded-3xl shadow-xl border-none text-center p-4">
          <Result
            status={winRate >= 60 ? "success" : "info"}
            title="Kuis Selesai!"
            subTitle={`Kamu menjawab benar ${correctCount} dari ${questions.length} soal.`}
          />
          <div className="flex justify-center gap-8 mb-6">
            <div>
              <p className="text-gray-400 text-sm font-bold">Skor</p>
              <p className="text-3xl font-extrabold text-[#1591dc]">{score}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-bold">Akurasi</p>
              <p className="text-3xl font-extrabold text-[#2c5ead]">
                {winRate}%
              </p>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            shape="round"
            className="bg-[#1591dc] hover:bg-[#4bb8fa]! border-none font-bold"
            onClick={() => navigate("/quiz")}
          >
            Kembali ke List Kuis
          </Button>
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

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 lg:gap-8 items-start mt-2">
        <div className="w-full md:w-1/3 shrink-0 pt-16 relative flex justify-center md:justify-end">
          <div className="relative w-full max-w-[240px] md:max-w-[260px]">
            <div className="absolute -top-16 md:-top-20 -right-4 md:-right-8 w-44 md:w-52 bg-white border-2 border-[#1591dc] rounded-2xl p-2.5 md:p-3 shadow-lg z-50 transition-all duration-300">
              <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-b-2 border-r-2 border-[#1591dc] rotate-45"></div>

              <p
                className={`text-center text-[11px] md:text-xs font-bold leading-relaxed m-0 ${elioReaction.textClass}`}
              >
                {elioReaction.quote}
                {isAnswered && (
                  <span className="ml-1 text-sm align-middle inline-block animate-bounce">
                    {elioReaction.badge}
                  </span>
                )}
              </p>
            </div>

            <div className="relative bg-white shadow-xl p-3 md:p-4 pb-6 rounded-xl transition-transform duration-300 hover:-translate-y-1">
              <div
                className="relative w-full h-44 md:h-48 bg-linear-to-b from-[#4bb8fa] to-[#1591dc] rounded-lg z-10"
                style={{ clipPath: "inset(-150% -100% 0 -100%)" }}
              >
                <img
                  src={pakElio}
                  alt="Pak Elio"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[20%] w-[125%] max-w-none object-contain drop-shadow-2xl z-10"
                />
              </div>
              <div className="absolute -right-3 bottom-5 bg-[#1591dc] text-white px-5 py-1.5 shadow-lg rotate-[-6deg] font-extrabold text-xs md:text-sm border-2 border-white z-20">
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
                      className={`w-full flex items-center gap-3 text-left transition-all duration-200 p-3.5 rounded-2xl border-2 font-bold text-base md:text-lg ${stateClass} ${
                        isAnswered
                          ? "cursor-default"
                          : "cursor-pointer active:scale-95"
                      }`}
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

              {isAnswered && (
                <Button
                  type="primary"
                  size="large"
                  block
                  shape="round"
                  className="bg-[#1591dc]! hover:bg-[#4bb8fa]! border-none! font-bold h-12 text-lg shadow-lg animate-page-enter"
                  onClick={handleNext}
                >
                  {currentIndex + 1 >= questions.length
                    ? "Lihat Hasil 🏁"
                    : "Soal Berikutnya →"}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default QuizRoom;
