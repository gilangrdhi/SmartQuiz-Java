import {
  TrophyOutlined,
  GlobalOutlined,
  CalculatorOutlined,
  ExperimentOutlined,
  BookOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const CATEGORY_STYLES = {
  Umum: {
    tagColor: "volcano",
    gradientClass: "from-[#1591dc] to-[#4bb8fa]",
    icon: TrophyOutlined,
  },
  Geografi: {
    tagColor: "green",
    gradientClass: "from-[#52c41a] to-[#73d13d]",
    icon: GlobalOutlined,
  },
  Matematika: {
    tagColor: "gold",
    gradientClass: "from-[#fadb14] to-[#ffec3d]",
    icon: CalculatorOutlined,
  },
  Sains: {
    tagColor: "cyan",
    gradientClass: "from-[#13c2c2] to-[#5cdbd3]",
    icon: ExperimentOutlined,
  },
  Sejarah: {
    tagColor: "purple",
    gradientClass: "from-[#722ed1] to-[#b37feb]",
    icon: BookOutlined,
  },
};

const DEFAULT_STYLE = {
  tagColor: "geekblue",
  gradientClass: "from-[#2c5ead] to-[#4bb8fa]",
  icon: QuestionCircleOutlined,
};

export const getCategoryStyle = (kategori) =>
  CATEGORY_STYLES[kategori] || DEFAULT_STYLE;