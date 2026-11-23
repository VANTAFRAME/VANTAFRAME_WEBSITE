// "20 opinii" / "1 opinia" / "3 opinie" (Polish plural rules) and "20 reviews" / "1 review".
export const reviewsCount = (count, lang) => {
  if (lang !== "pl") return `${count} ${count === 1 ? "review" : "reviews"}`;
  const mod10 = count % 10;
  const mod100 = count % 100;
  const word = count === 1 ? "opinia" : mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14) ? "opinie" : "opinii";
  return `${count} ${word}`;
};