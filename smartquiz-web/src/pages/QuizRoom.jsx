import { useEffect, useMemo, useRef, useState } from "react";
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
  ClockCircleFilled,
  ScissorOutlined,
  BulbFilled,
  RocketFilled,
} from "@ant-design/icons";

import AvatarDisplay from "../components/AvatarDisplay";
import { getCategoryStyle } from "../utils/categoryStyle";
import pakElio from "../assets/pakElio.svg";

const OPTION_KEYS = ["A", "B", "C", "D"];
const POIN_PER_SOAL_BENAR = 100;

const CRITICAL_TIME_THRESHOLD = 60;
const WARNING_TIME_THRESHOLD = 180;

const BUFF_DEFINITIONS = [
  {
    key: "extra_time",
    label: "Extra Time",
    desc: "Tambah 30 detik waktu pengerjaan",
    icon: ClockCircleFilled,
    color: "#1591dc",
  },
  {
    key: "fifty_fifty",
    label: "50 : 50",
    desc: "Hilangkan 2 opsi jawaban yang salah",
    icon: ScissorOutlined,
    color: "#f5222d",
  },
  {
    key: "hint",
    label: "Bocoran",
    desc: "Beri sinyal jawaban yang benar",
    icon: BulbFilled,
    color: "#faad14",
  },
  {
    key: "double_poin",
    label: "Double Poin",
    desc: "Poin soal ini x2 jika dijawab benar",
    icon: RocketFilled,
    color: "#722ed1",
  },
];

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function computeBuffCounts(rawBuffs) {
  const counts = {};
  BUFF_DEFINITIONS.forEach(({ key }) => {
    counts[key] = 0;
  });

  if (Array.isArray(rawBuffs) && rawBuffs.length > 0) {
    rawBuffs.forEach((code) => {
      if (counts[code] !== undefined) counts[code] += 1;
    });
    return counts;
  }
  return counts;
}

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

  const fallbackUser = useMemo(
    () => ({
      id: 1,
      nama: "Sobat",
      activeBuffs: [],
    }),
    [],
  );

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || fallbackUser;
    } catch {
      return fallbackUser;
    }
  }, [fallbackUser]);

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [hoveredOption, setHoveredOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isDaftarSoalVisible, setIsDaftarSoalVisible] = useState(false);

  const [timeLeft, setTimeLeft] = useState(null);
  const autoSubmittedRef = useRef(false);

  const [buffCounts, setBuffCounts] = useState(() =>
    computeBuffCounts(user.activeBuffs),
  );
  const [usedBuffsLog, setUsedBuffsLog] = useState([]);
  const [isBuffModalVisible, setIsBuffModalVisible] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState({});
  const [revealedHints, setRevealedHints] = useState({});
  const [doublePoinQuestions, setDoublePoinQuestions] = useState({});
  const [droppedBuff, setDroppedBuff] = useState(null);
  const [activeBuffAnimation, setActiveBuffAnimation] = useState(null);
  const buffAnimTimerRef = useRef(null);
  const [streak, setStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [floatingPoints, setFloatingPoints] = useState([]);
  const [isStreakBroken, setIsStreakBroken] = useState(false);
  const [lastStreak, setLastStreak] = useState(0);

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
    const loadQuizData = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [quizRes, questionRes] = await Promise.all([
          fetch(`http://localhost:8080/api/quizzes/${quizId}`),
          fetch(`http://localhost:8080/api/questions/quiz/${quizId}`),
        ]);

        if (!quizRes.ok) throw new Error("Kuis tidak ditemukan");
        if (!questionRes.ok) throw new Error("Gagal mengambil soal");

        const quizData = await quizRes.json();
        const questionData = await questionRes.json();

        setQuiz(quizData);
        setQuestions(questionData);

        setCurrentIndex(0);
        setAnswers({});
        setIsFinished(false);
        setTimeLeft((quizData.durasiMenit || 10) * 60);
        autoSubmittedRef.current = false;
        setUsedBuffsLog([]);
        setEliminatedOptions({});
        setRevealedHints({});
        setDoublePoinQuestions({});

        setBuffCounts(computeBuffCounts(user.activeBuffs));
      } catch (err) {
        console.error(err);
        setLoadError("Gagal memuat kuis ini.");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizData();
  }, [quizId, user]);

  useEffect(() => {
    if (timeLeft === null || isLoading || isFinished || isSubmitting) return;

    if (timeLeft <= 0) {
      if (!autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        message.warning("Waktu habis! Kuis otomatis dikumpulkan.");
        executeSubmit();
      }
      return;
    }

    const intervalId = setTimeout(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : prev));
    }, 1000);

    return () => clearTimeout(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isLoading, isFinished, isSubmitting]);

  const correctCount = questions.reduce((count, q, idx) => {
    return answers[idx] === q.kunciJawaban ? count + 1 : count;
  }, 0);
  const score = questions.reduce((total, q, idx) => {
    if (answers[idx] !== q.kunciJawaban) return total;
    const multiplier = doublePoinQuestions[idx] ? 2 : 1;
    return total + POIN_PER_SOAL_BENAR * multiplier;
  }, 0);
  const winRate =
    questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;
  const isWin = winRate >= 60;

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isAnswered = !!currentAnswer;
  const selectedOption = currentAnswer;

  const handleAnswer = async (optionKey) => {
    if (isAnswered) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionKey }));

    const isCorrectOption = optionKey === currentQuestion.kunciJawaban;

    if (isCorrectOption) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      let questionPoints = POIN_PER_SOAL_BENAR;
      questionPoints += newStreak * 10;
      if (timeLeft) {
        questionPoints += Math.floor(timeLeft / 10);
      }

      if (doublePoinQuestions[currentIndex]) {
        questionPoints *= 2;
      }

      setTotalScore((prev) => prev + questionPoints);

      const animId = Date.now();
      setFloatingPoints((prev) => [
        ...prev,
        { id: animId, points: questionPoints },
      ]);
      setTimeout(() => {
        setFloatingPoints((prev) => prev.filter((p) => p.id !== animId));
      }, 1500);

      const dropChance = Math.random();
      if (newStreak % 3 === 0 || dropChance <= 0.35) {
        const availableBuffs = [
          "extra_time",
          "fifty_fifty",
          "hint",
          "double_poin",
        ];
        const randomBuff =
          availableBuffs[Math.floor(Math.random() * availableBuffs.length)];
        const buffInfo = BUFF_DEFINITIONS.find((b) => b.key === randomBuff);

        setBuffCounts((prev) => ({
          ...prev,
          [randomBuff]: (prev[randomBuff] || 0) + 1,
        }));

        setDroppedBuff(buffInfo);
        setTimeout(() => setDroppedBuff(null), 2500);

        try {
          await axios.post(
            `http://localhost:8080/api/users/${user.id}/add-buff`,
            { buffType: randomBuff },
          );
        } catch (error) {
          console.error("Gagal simpan buff:", error);
        }
      }
    } else {
      if (streak >= 2) {
        setLastStreak(streak);
        setIsStreakBroken(true);

        setTimeout(() => {
          setIsStreakBroken(false);
        }, 2500);
      }
      setStreak(0);
    }
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

  const handleUseBuff = (buffKey) => {
    if (!buffCounts[buffKey] || buffCounts[buffKey] <= 0) return;

    setIsBuffModalVisible(false);

    const buffInfo = BUFF_DEFINITIONS.find((b) => b.key === buffKey);
    setActiveBuffAnimation(buffInfo);

    if (buffAnimTimerRef.current) clearTimeout(buffAnimTimerRef.current);
    buffAnimTimerRef.current = setTimeout(() => {
      setActiveBuffAnimation(null);
    }, 2500);

    switch (buffKey) {
      case "extra_time":
        setTimeLeft((prev) => (prev !== null ? prev + 30 : prev));
        message.success("⏱️ +30 detik ditambahkan!");
        break;

      case "fifty_fifty": {
        const wrongOptions = OPTION_KEYS.filter(
          (k) => k !== currentQuestion.kunciJawaban,
        );
        const toEliminate = [...wrongOptions]
          .sort(() => Math.random() - 0.5)
          .slice(0, 2);
        setEliminatedOptions((prev) => ({
          ...prev,
          [currentIndex]: toEliminate,
        }));
        break;
      }

      case "hint": {
        setRevealedHints((prev) => ({ ...prev, [currentIndex]: true }));
        break;
      }

      case "double_poin": {
        setDoublePoinQuestions((prev) => ({ ...prev, [currentIndex]: true }));
        break;
      }

      default:
        return;
    }

    setBuffCounts((prev) => ({ ...prev, [buffKey]: prev[buffKey] - 1 }));
    setUsedBuffsLog((prev) => [...prev, buffKey]);
  };

  function executeSubmit() {
    submitQuizResult({
      userId: user.id,
      earnedPoints: totalScore,
      isWin: isWin,
      usedBuffs: usedBuffsLog,
      remainingInventory: buffCounts,
    });
  }

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

  const isTimeCritical =
    timeLeft !== null && timeLeft <= CRITICAL_TIME_THRESHOLD;
  const isTimeWarning =
    !isTimeCritical && timeLeft !== null && timeLeft <= WARNING_TIME_THRESHOLD;
  const totalBuffsLeft = Object.values(buffCounts).reduce(
    (sum, n) => sum + n,
    0,
  );
  const currentEliminated = eliminatedOptions[currentIndex] || [];
  const isHintRevealed = !!revealedHints[currentIndex];
  const isDoublePoinActive = !!doublePoinQuestions[currentIndex];

  return (
    <div className="min-h-screen bg-[#c4e2f5] p-4 md:p-6 flex flex-col items-center font-sans overflow-x-hidden">
      <style>
        {`
          @keyframes suckIntoInventory {
            0% { opacity: 0; transform: translateY(30px) scale(0.5); }
            15% { opacity: 1; transform: translateY(-5px) scale(1.1); }
            25% { transform: translateY(0) scale(1); }
            80% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translate(20px, -40px) scale(0.1); }
          }
          .animate-suck-inventory {
            animation: suckIntoInventory 2.5s ease-in-out forwards;
            transform-origin: top right;
          }
        `}
        ,
        {`
          @keyframes floatUpFade {
            0% { opacity: 1; transform: translateY(0) scale(0.5); }
            20% { transform: translateY(-20px) scale(1.2); }
            100% { opacity: 0; transform: translateY(-80px) scale(1); }
          }
          .animate-point-up {
            animation: floatUpFade 1.5s ease-out forwards;
          }
        `}
      </style>

      <div className="w-full max-w-5xl flex justify-between items-center bg-white/90 backdrop-blur-md p-2 pr-4 md:p-3 md:pr-6 rounded-full shadow-sm border border-white mb-6 md:mb-10 animate-page-enter">
        <div className="flex items-center gap-3 md:gap-4 relative">
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
          <div className="flex flex-col justify-center relative">
            <h2 className="text-base md:text-lg font-extrabold text-[#2c5ead] m-0 leading-tight">
              {user.nama}
            </h2>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs md:text-sm font-bold text-[#1591dc] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                ⭐ {totalScore} Poin
              </span>

              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-black text-xs transition-all duration-300 ${
                  streak >= 3
                    ? "bg-orange-100 border border-orange-400 text-orange-600 shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                    : streak > 0
                      ? "bg-yellow-50 border border-yellow-300 text-yellow-600"
                      : "bg-gray-50 border border-gray-200 text-gray-400 grayscale opacity-70"
                }`}
              >
                <span className={streak >= 3 ? "animate-bounce" : ""}>🔥</span>
                <span>x{streak}</span>
              </div>
            </div>

            {floatingPoints.map((anim) => (
              <div
                key={anim.id}
                className="absolute -top-6 left-8 text-xl font-black text-green-500 drop-shadow-md animate-point-up pointer-events-none z-50"
              >
                +{anim.points}
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center gap-2 md:gap-3 z-50">
          \
          <div
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-sm md:text-base shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border transition-all duration-300 ${
              isTimeCritical
                ? "bg-red-50 border-red-500 text-red-600 animate-pulse"
                : isTimeWarning
                  ? "bg-orange-50 border-orange-400 text-orange-500"
                  : "bg-blue-50/50 border-[#1591dc]/30 text-[#2c5ead]"
            }`}
          >
            <ClockCircleFilled
              className={isTimeCritical ? "animate-spin" : ""}
            />
            <span className="tabular-nums tracking-widest">
              {formatTime(timeLeft)}
            </span>
          </div>
          <Button
            type="primary"
            shape="round"
            icon={<ThunderboltOutlined />}
            size="large"
            onClick={() => setIsBuffModalVisible(true)}
            className="bg-linear-to-r from-[#1591dc] to-[#722ed1] hover:from-[#4bb8fa] hover:to-[#9254de] text-white border-none shadow-lg shadow-blue-400/40 font-extrabold flex items-center transition-all duration-300 hover:scale-105 hover:shadow-blue-400/60"
          >
            <span className="hidden sm:inline">Buff</span>
            <span className="bg-white text-[#722ed1] text-xs font-black rounded-full min-w-5.5 h-5.5 flex items-center justify-center px-1 shadow-inner">
              {totalBuffsLeft}
            </span>
          </Button>
          {droppedBuff && (
            <div className="absolute top-[125%] right-2 pointer-events-none animate-suck-inventory">
              <div
                className="relative bg-white border-2 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-3 w-max"
                style={{ borderColor: droppedBuff.color }}
              >
                <div
                  className="absolute -top-2.5 right-8 w-4 h-4 bg-white border-t-2 border-l-2 rotate-45"
                  style={{ borderColor: droppedBuff.color }}
                ></div>

                <div
                  className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-lg text-white shadow-md animate-pulse"
                  style={{ backgroundColor: droppedBuff.color }}
                >
                  {(() => {
                    const Icon = droppedBuff.icon;
                    return <Icon />;
                  })()}
                </div>

                <div className="flex flex-col pr-2">
                  <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest leading-none mb-1">
                    Dapat Buff!
                  </span>
                  <span
                    className="font-black text-base leading-none"
                    style={{ color: droppedBuff.color }}
                  >
                    {droppedBuff.label}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
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
                {isDoublePoinActive && (
                  <Tag
                    icon={<RocketFilled />}
                    color="purple"
                    className="rounded-full border-none font-extrabold m-0 shadow-xs animate-bounce"
                  >
                    2x Poin
                  </Tag>
                )}
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
                  const isEliminated =
                    !isAnswered && currentEliminated.includes(key);
                  const isHintTarget =
                    !isAnswered && isHintRevealed && isCorrectOption;

                  let stateClass = "bg-white border-[#c4e2f5] text-[#2c5ead]";
                  let badgeClass = "bg-[#c4e2f5] text-[#1591dc]";

                  if (isHovered) {
                    stateClass =
                      "bg-[#1591dc] border-[#1591dc] text-white shadow-lg scale-[1.01]";
                    badgeClass = "bg-white/25 text-white";
                  }

                  if (isHintTarget) {
                    stateClass =
                      "bg-white border-yellow-400 text-[#2c5ead] shadow-lg shadow-yellow-200 ring-2 ring-yellow-300";
                    badgeClass = "bg-yellow-400 text-white";
                  }

                  if (isEliminated) {
                    stateClass =
                      "bg-gray-100 border-gray-200 text-gray-300 opacity-50 line-through";
                    badgeClass = "bg-gray-200 text-gray-300";
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
                      disabled={isAnswered || isEliminated}
                      className={`w-full flex items-center gap-3 text-left transition-all duration-200 p-3.5 rounded-2xl border-2 font-bold text-base md:text-lg ${stateClass} ${isAnswered || isEliminated ? "cursor-default" : "cursor-pointer active:scale-95"}`}
                    >
                      <span
                        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold transition-colors duration-150 ${badgeClass}`}
                      >
                        {key}
                      </span>
                      <span className="flex-1">{optionText}</span>
                      {isHintTarget && (
                        <BulbFilled className="text-xl shrink-0 text-yellow-400 animate-pulse" />
                      )}
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

      <Modal
        title={
          <div className="text-center text-[#2c5ead] font-extrabold text-2xl flex items-center justify-center gap-2 mb-2 mt-2">
            <ThunderboltOutlined className="text-yellow-500 animate-pulse" />{" "}
            INVENTORY BUFF
          </div>
        }
        open={isBuffModalVisible}
        onCancel={() => setIsBuffModalVisible(false)}
        footer={null}
        centered
        width={450}
        className="inventory-modal"
      >
        <div className="flex flex-col gap-4 mt-2">
          {BUFF_DEFINITIONS.map(({ key, label, desc, icon: Icon, color }) => {
            const count = buffCounts[key] || 0;

            const alreadyUsedThisQuestion =
              (key === "fifty_fifty" && !!eliminatedOptions[currentIndex]) ||
              (key === "hint" && !!revealedHints[currentIndex]) ||
              (key === "double_poin" && !!doublePoinQuestions[currentIndex]);

            const isBlockedByAnswered = key !== "extra_time" && isAnswered;

            const isDisabled =
              count <= 0 || isBlockedByAnswered || alreadyUsedThisQuestion;

            let buttonText = "Gunakan";
            if (alreadyUsedThisQuestion) {
              buttonText = "Dipakai";
            } else if (isBlockedByAnswered && count > 0) {
              buttonText = "Sudah Jawab"; // Kasih tau user kenapa ga bisa dipencet
            } else if (count <= 0) {
              buttonText = "Habis";
            }

            return (
              <div
                key={key}
                className={`group relative overflow-hidden flex items-center gap-4 p-4 rounded-3xl border-2 transition-all duration-300 ${
                  isDisabled
                    ? "border-gray-200 bg-gray-50 opacity-60 grayscale"
                    : "border-transparent bg-white shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                }`}
                style={{
                  borderColor: !isDisabled ? `${color}40` : "",
                }}
              >
                {!isDisabled && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${color}, transparent)`,
                    }}
                  ></div>
                )}

                <div
                  className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg transition-transform duration-300 ${!isDisabled && "group-hover:scale-110 group-hover:rotate-3"}`}
                  style={{ backgroundColor: color }}
                >
                  <Icon />
                </div>

                <div className="flex-1 min-w-0 relative z-10">
                  <p className="font-black text-lg text-gray-800 m-0 leading-tight group-hover:text-[#2c5ead] transition-colors">
                    {label}
                  </p>
                  <p className="text-xs text-gray-500 m-0 mt-1 leading-snug font-medium">
                    {desc}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0 relative z-10">
                  <span className="text-sm font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                    x{count}
                  </span>
                  <Button
                    size="middle"
                    shape="round"
                    type="primary"
                    disabled={isDisabled}
                    onClick={() => handleUseBuff(key)}
                    className="font-extrabold text-xs shadow-md"
                    style={{
                      backgroundColor: isDisabled ? undefined : color,
                      borderColor: isDisabled ? undefined : color,
                    }}
                  >
                    {buttonText}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      <style>
        {`
          @keyframes epicBuffReveal {
            0% { opacity: 0; transform: scale(0) rotate(-20deg); }
            10% { opacity: 1; transform: scale(1.2) rotate(5deg); }
            15% { transform: scale(1) rotate(0deg); }
            85% { opacity: 1; transform: scale(1) translateY(0); }
            95% { opacity: 1; transform: scale(1.1) translateY(-10px); }
            100% { opacity: 0; transform: scale(0) translateY(-100px); }
          }
          .animate-epic-buff {
            /* Durasi diubah jadi 2.5s biar lebih cepet */
            animation: epicBuffReveal 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
          
          @keyframes godRays {
            0% { transform: rotate(0deg) scale(1.5); }
            100% { transform: rotate(360deg) scale(1.5); }
          }
          .animate-god-rays {
            animation: godRays 15s linear infinite;
          }
        `}
      </style>

      <style>
        {`
          @keyframes shatterDrop {
            0% { transform: scale(3) rotate(0deg); opacity: 0; }
            10% { transform: scale(1) rotate(-10deg); opacity: 1; }
            20% { transform: scale(1) rotate(10deg); opacity: 1; }
            30% { transform: scale(1) rotate(-10deg); opacity: 1; }
            40% { transform: scale(1) rotate(0deg); opacity: 1; filter: grayscale(0%); }
            70% { transform: scale(1) translateY(0); opacity: 1; filter: grayscale(80%); }
            100% { transform: scale(0.8) translateY(150px); opacity: 0; filter: grayscale(100%); }
          }
          .animate-shatter {
            animation: shatterDrop 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
        `}
      </style>

      {isStreakBroken && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center pointer-events-none bg-red-900/30 backdrop-blur-sm transition-all duration-300">
          <div className="flex flex-col items-center animate-shatter">
            <div className="text-8xl md:text-9xl drop-shadow-2xl mb-2">💔</div>
            <h1 className="text-5xl md:text-7xl font-black text-white m-0 drop-shadow-[0_4px_4px_rgba(220,38,38,0.8)] uppercase tracking-tighter text-center">
              STREAK PECAH!
            </h1>
            <p className="mt-4 text-white font-extrabold text-lg md:text-xl drop-shadow-lg bg-red-600/80 px-6 py-2 rounded-full border-2 border-white/40">
              Sayang banget, streak x{lastStreak} kamu lenyap 😭
            </p>
          </div>
        </div>
      )}

      {activeBuffAnimation && (
        <div
          className="fixed inset-0 z-10000 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-500 cursor-pointer"
          onClick={() => {
            setActiveBuffAnimation(null);
            if (buffAnimTimerRef.current)
              clearTimeout(buffAnimTimerRef.current);
          }}
        >
          <div
            className="absolute w-[200vw] h-[200vw] md:w-[150vw] md:h-[150vw] opacity-40 animate-god-rays"
            style={{
              background: `repeating-conic-gradient(from 0deg, ${activeBuffAnimation.color} 0deg 15deg, transparent 15deg 30deg)`,
            }}
          />

          <div className="relative flex flex-col items-center animate-epic-buff">
            <div
              className="w-40 h-40 md:w-52 md:h-52 rounded-full flex items-center justify-center text-7xl md:text-8xl text-white border-8 border-white mb-6 relative"
              style={{
                backgroundColor: activeBuffAnimation.color,
                boxShadow: `0 0 80px ${activeBuffAnimation.color}, inset 0 0 30px rgba(0,0,0,0.2)`,
              }}
            >
              <div className="absolute inset-0 rounded-full animate-ping border-4 border-white opacity-60"></div>
              {(() => {
                const Icon = activeBuffAnimation.icon;
                return <Icon />;
              })()}
            </div>

            <div className="bg-white px-10 py-4 rounded-full shadow-2xl border-b-4 border-gray-200 text-center relative overflow-hidden">
              <span className="block text-xs md:text-sm font-black text-gray-400 uppercase tracking-widest mb-1">
                Buff Diaktifkan!
              </span>
              <h1
                className="text-4xl md:text-6xl font-black m-0 drop-shadow-sm uppercase italic tracking-tighter"
                style={{ color: activeBuffAnimation.color }}
              >
                {activeBuffAnimation.label}
              </h1>
            </div>

            <p className="mt-6 text-white font-extrabold text-lg md:text-2xl drop-shadow-lg text-center bg-black/40 px-6 py-2 rounded-full backdrop-blur-md">
              {activeBuffAnimation.desc}
            </p>

            {/* Tulisan kecil buat ngasih tau bisa di-skip */}
            <p className="absolute -bottom-10 text-white/50 text-sm font-bold animate-pulse">
              Klik di mana saja untuk skip
            </p>
          </div>
        </div>
      )}

      {activeBuffAnimation && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center pointer-events-none bg-black/60 backdrop-blur-sm transition-all duration-500">
          <div
            className="absolute w-[200vw] h-[200vw] md:w-[150vw] md:h-[150vw] opacity-40 animate-god-rays"
            style={{
              background: `repeating-conic-gradient(from 0deg, ${activeBuffAnimation.color} 0deg 15deg, transparent 15deg 30deg)`,
            }}
          />

          <div className="relative flex flex-col items-center animate-epic-buff">
            <div
              className="w-40 h-40 md:w-52 md:h-52 rounded-full flex items-center justify-center text-7xl md:text-8xl text-white border-8 border-white mb-6 relative"
              style={{
                backgroundColor: activeBuffAnimation.color,
                boxShadow: `0 0 80px ${activeBuffAnimation.color}, inset 0 0 30px rgba(0,0,0,0.2)`,
              }}
            >
              <div className="absolute inset-0 rounded-full animate-ping border-4 border-white opacity-60"></div>
              {(() => {
                const Icon = activeBuffAnimation.icon;
                return <Icon />;
              })()}
            </div>

            <div className="bg-white px-10 py-4 rounded-full shadow-2xl border-b-4 border-gray-200 text-center relative overflow-hidden">
              <span className="block text-xs md:text-sm font-black text-gray-400 uppercase tracking-widest mb-1">
                Buff Diaktifkan!
              </span>
              <h1
                className="text-4xl md:text-6xl font-black m-0 drop-shadow-sm uppercase italic tracking-tighter"
                style={{ color: activeBuffAnimation.color }}
              >
                {activeBuffAnimation.label}
              </h1>
            </div>

            <p className="mt-6 text-white font-extrabold text-lg md:text-2xl drop-shadow-lg text-center bg-black/40 px-6 py-2 rounded-full backdrop-blur-md">
              {activeBuffAnimation.desc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizRoom;
