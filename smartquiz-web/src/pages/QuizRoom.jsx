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
      bubbleClass: "bg-white text-quiz-dark",
      bubbleTailBorderClass: "border-r-white",
      badge: "",
    };
  }
  if (isCorrect) {
    return {
      quote: `"${CORRECT_QUOTES[questionIndex % CORRECT_QUOTES.length]}"`,
      bubbleClass: "bg-green-50 text-green-700",
      bubbleTailBorderClass: "border-r-green-50",
      badge: "🎉",
    };
  }
  return {
    quote: `"${WRONG_QUOTES[questionIndex % WRONG_QUOTES.length]}"`,
    bubbleClass: "bg-orange-50 text-orange-700",
    bubbleTailBorderClass: "border-r-orange-50",
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
      <div className="min-h-screen bg-quiz-bg flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-quiz-bg flex items-center justify-center p-6">
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
      <div className="min-h-screen bg-quiz-bg flex items-center justify-center p-6">
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
      <div className="min-h-screen bg-quiz-bg flex items-center justify-center p-6">
        <Card className="max-w-lg w-full rounded-3xl shadow-xl border-none text-center p-4">
          <Result
            status={winRate >= 60 ? "success" : "info"}
            title="Kuis Selesai!"
            subTitle={`Kamu menjawab benar ${correctCount} dari ${questions.length} soal.`}
          />
          <div className="flex justify-center gap-8 mb-6">
            <div>
              <p className="text-gray-400 text-sm font-bold">Skor</p>
              <p className="text-3xl font-extrabold text-quiz-primary">
                {score}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-bold">Akurasi</p>
              <p className="text-3xl font-extrabold text-quiz-dark">
                {winRate}%
              </p>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            shape="round"
            className="bg-quiz-primary hover:bg-quiz-light! border-none font-bold"
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
    <div className="min-h-screen bg-quiz-bg p-4 md:p-6 flex flex-col items-center font-sans">
      <div className="w-full max-w-4xl flex justify-between items-center gap-4 mb-6 bg-white p-3 md:p-4 rounded-3xl shadow-md animate-page-enter">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="rounded-full p-0.5 bg-linear-to-br from-quiz-primary to-quiz-light">
            <div className="rounded-full bg-white p-0.5">
              <AvatarDisplay
                size={56}
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
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-quiz-dark m-0 leading-tight">
              {user.nama}
            </h2>
            <Tag
              color="#1591dc"
              className="rounded-full mt-1 border-none font-bold text-xs"
            >
              ⭐ Skor: {score}
            </Tag>
          </div>
        </div>
        <Button
          type="primary"
          shape="round"
          icon={<ThunderboltOutlined />}
          size="large"
          className="bg-yellow-400! hover:bg-yellow-300! text-quiz-dark! border-none! shadow-md font-bold hidden sm:flex items-center"
          title="Buff segera hadir!"
          disabled
        >
          Buff
        </Button>
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex items-end gap-3 md:gap-4 mb-3 pl-2">
          <div className="animate-float shrink-0">
            <img
              src={pakElio}
              alt="Pak Elio"
              className="h-28 md:h-36 object-contain drop-shadow-2xl"
            />
          </div>
          <div
            className={`relative rounded-2xl rounded-bl-sm px-4 py-3 mb-6 md:mb-10 text-sm md:text-base font-semibold shadow-md max-w-[75%] transition-colors duration-300 ${elioReaction.bubbleClass}`}
          >
            {elioReaction.quote}
            {isAnswered && (
              <span className="ml-2 text-lg align-middle">
                {elioReaction.badge}
              </span>
            )}
            <div
              className={`absolute -left-2 bottom-3 w-0 h-0 border-y-8 border-y-transparent border-r-10 transition-colors duration-300 ${elioReaction.bubbleTailBorderClass}`}
            ></div>
          </div>
        </div>
        <Card className="w-full rounded-3xl shadow-lg border-none relative overflow-hidden">
          <Progress
            percent={progressPercent}
            showInfo={false}
            strokeColor={{ "0%": "#1591dc", "100%": "#4bb8fa" }}
            trailColor="#e6f4ff"
            className="absolute top-0 left-0 w-full m-0 p-0"
            strokeWidth={8}
          />

          <div className="p-3 md:p-6 pt-6">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <span className="bg-quiz-light text-white text-xs px-3 py-1.5 rounded-full font-bold">
                Soal {currentIndex + 1} / {questions.length}
              </span>
              {quiz?.kategori && (
                <Tag
                  color={categoryStyle.tagColor}
                  icon={<CategoryIcon />}
                  className="rounded-full border-none font-bold m-0"
                >
                  {quiz.kategori}
                </Tag>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-quiz-dark mb-6 leading-relaxed">
              {currentQuestion.teksSoal}
            </h2>

            <div className="grid grid-cols-1 gap-3 mb-6">
              {OPTION_KEYS.map((key) => {
                const optionText = currentQuestion[`opsi${key}`];
                const isCorrectOption = key === currentQuestion.kunciJawaban;
                const isSelected = key === selectedOption;
                const isHovered = !isAnswered && hoveredOption === key;

                let stateClass = "bg-white border-quiz-bg text-quiz-dark";
                let badgeClass = "bg-quiz-bg text-quiz-primary";

                if (isHovered) {
                  stateClass =
                    "bg-quiz-primary border-quiz-primary text-white shadow-lg scale-[1.01]";
                  badgeClass = "bg-white/25 text-white";
                }

                if (isAnswered) {
                  if (isCorrectOption) {
                    stateClass = "bg-green-500 text-white border-green-500";
                    badgeClass = "bg-white/25 text-white";
                  } else if (isSelected) {
                    stateClass = "bg-red-400 text-white border-red-400";
                    badgeClass = "bg-white/25 text-white";
                  } else {
                    stateClass =
                      "bg-white text-gray-400 border-quiz-bg opacity-60";
                    badgeClass = "bg-quiz-bg text-gray-400";
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
                    className={`w-full flex items-center gap-3 text-left transition-all duration-150 p-3.5 rounded-2xl border-2 font-bold text-base md:text-lg ${stateClass} ${isAnswered ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <span
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold transition-colors duration-150 ${badgeClass}`}
                    >
                      {key}
                    </span>
                    <span className="flex-1">{optionText}</span>
                    {isAnswered && isCorrectOption && (
                      <CheckCircleFilled className="text-xl shrink-0" />
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
                className="bg-quiz-primary! hover:bg-quiz-light! border-none! font-bold animate-page-enter"
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
  );
}

export default QuizRoom;
