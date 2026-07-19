const CATEGORY_COLORS = {
  Umum: "volcano",
  Geografi: "green",
  Matematika: "gold",
  Sains: "blue",
  Sejarah: "purple",
};

export const getCategoryColor = (kategori) =>
  CATEGORY_COLORS[kategori] || "geekblue";