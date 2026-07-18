import { Card, Button, Progress, Tag } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";

function QuizRoom() {
  return (
    <div className="min-h-screen bg-quiz-bg p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border-2 border-quiz-light">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-quiz-light rounded-full border-4 border-quiz-primary flex items-center justify-center text-2xl shadow-inner relative">
            ☁️
            <div className="absolute -top-3 text-sm">🧢</div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-quiz-dark m-0">
              Gilang (Player 1)
            </h2>
            <Tag
              color="#1591dc"
              className="rounded-full mt-1 border-none font-bold"
            >
              Skor: 1200
            </Tag>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="primary"
            shape="circle"
            icon={<ThunderboltOutlined />}
            size="large"
            className="bg-yellow-400 text-quiz-dark border-none shadow-md hover:bg-yellow-300"
            title="Buff: Double Poin!"
          />
        </div>
      </div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex flex-col items-center justify-start">
          <Card className="w-full rounded-2xl shadow-lg border-2 border-quiz-primary bg-white text-center">
            <div className="text-6xl mb-4">🦌</div>
            <h3 className="font-bold text-quiz-dark text-lg">Pak Elio</h3>
            <p className="text-gray-500 text-sm italic">
              "Ayo perhatikan soal di samping! Jangan sampai salah ya!"
            </p>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Card className="w-full rounded-2xl shadow-lg border-2 border-quiz-primary relative overflow-hidden">
            <Progress
              percent={75}
              showInfo={false}
              strokeColor="#1591dc"
              className="absolute top-0 left-0 w-full m-0 p-0"
              strokeWidth={6}
            />

            <div className="p-4 mt-2">
              <span className="bg-quiz-light text-white text-xs px-3 py-1 rounded-full font-bold">
                Soal 1 / 10
              </span>
              <h2 className="text-2xl font-bold text-quiz-dark mt-4 mb-6 leading-relaxed">
                Siapakah penemu bahasa pemrograman Java?
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  "James Gosling",
                  "Guido van Rossum",
                  "Brendan Eich",
                  "Bjarne Stroustrup",
                ].map((opsi, i) => (
                  <button
                    key={i}
                    className="w-full text-left bg-white hover:bg-quiz-primary hover:text-white transition-all duration-200 p-4 rounded-xl border-2 border-quiz-bg cursor-pointer font-bold text-gray-700 hover:shadow-md text-lg"
                  >
                    {String.fromCharCode(65 + i)}. {opsi}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default QuizRoom;
