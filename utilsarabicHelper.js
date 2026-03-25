export const normalizeArabic = (text) => {
  if (!text) return "";
  return text
    .toString()
    .replace(/[أإآ]/g, 'ا') // تحويل أ إ آ إلى ا
    .replace(/ة/g, 'ه')     // تحويل ة إلى ه
    .replace(/ى/g, 'ي')     // تحويل ى إلى ي
    .replace(/[\u064B-\u065F]/g, "") // حذف التشكيل (الفتحة، الضمة، إلخ)
    .trim();
};