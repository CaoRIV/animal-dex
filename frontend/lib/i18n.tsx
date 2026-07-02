"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Language = "vi" | "en";

const dictionary = {
  vi: {
    navIdentify: "Nhận diện",
    navCollection: "Album",
    navStats: "Thống kê",
    navAccount: "Tài khoản",
    primaryNav: "Điều hướng chính",
    langLabel: "Ngôn ngữ",
    heroEyebrow: "AI nhận diện động vật",
    heroLead: "Upload ảnh, xem độ tin cậy và lưu vào album cá nhân.",
    heroCta: "Bắt đầu",
    heroAlbum: "Mở album",
    heroMetric: "91.7% test accuracy",
    heroCardTitle: "Nhận diện từ ảnh thật",
    heroCardBody: "Ảnh, confidence và thông tin loài được đặt ở trung tâm.",
    uploadTitle: "Upload ảnh",
    uploadHint: "JPG, PNG, WebP. Tối đa 10MB.",
    chooseImage: "Chọn hoặc chụp ảnh",
    selectedImageAlt: "Ảnh động vật đang được chọn",
    predictIdle: "Nhận diện",
    predictLoading: "Đang nhận diện",
    clearImage: "Xóa ảnh",
    emptyResultTitle: "Chưa có kết quả",
    emptyResultBody: "Chọn ảnh để xem loài, confidence và top-3 dự đoán.",
    highConfidence: "AI khá chắc",
    uncertainConfidence: "AI chưa chắc",
    lowConfidence: "Chưa đủ tin cậy",
    habitat: "Môi trường sống",
    diet: "Chế độ ăn",
    group: "Nhóm",
    danger: "Mức nguy hiểm",
    topPredictions: "Top-3 dự đoán",
    correctLabel: "Nhãn lưu album",
    correctionHint: "Có thể sửa nếu AI đoán sai.",
    saveIdle: "Lưu vào album",
    saveLoading: "Đang lưu",
    viewAlbum: "Xem album",
    needImage: "Chọn một ảnh trước khi nhận diện.",
    predictFailed: "Không thể nhận diện ảnh.",
    loginRequired: "Bạn cần đăng nhập trước khi lưu.",
    saved: "Đã lưu vào album.",
    saveFailed: "Không thể lưu kết quả.",
    supabaseMissing: "Cần cấu hình Supabase env.",
    loginToSave: "Đăng nhập để lưu",
    logout: "Đăng xuất",
    authEyebrow: "Supabase Auth",
    authArtAlt: "Ảnh minh họa động vật trong tự nhiên",
    loginTitle: "Đăng nhập",
    signupTitle: "Tạo tài khoản",
    authLead: "Đăng nhập để lưu album cá nhân.",
    loginTab: "Đăng nhập",
    signupTab: "Đăng ký",
    email: "Email",
    password: "Mật khẩu",
    submitting: "Đang xử lý",
    signupCreated: "Tài khoản đã được tạo. Hãy xác nhận email nếu Supabase yêu cầu.",
    collectionEyebrow: "Album cá nhân",
    collectionTitle: "Collection",
    all: "All",
    collectionNeedsConfig: "Cần cấu hình Supabase để xem album.",
    collectionLoadFailed: "Không thể tải album.",
    collectionEmpty: "Album đang trống",
    collectionEmptyBody: "Nhận diện một ảnh để bắt đầu.",
    identifyNew: "Nhận diện ảnh mới",
    savedPhotoAlt: "Ảnh đã lưu của",
    delete: "Xóa",
    profileEyebrow: "Profile",
    profileTitle: "Dấu chân khám phá",
    identifyMore: "Nhận diện thêm",
    savedImages: "Ảnh đã lưu",
    uniqueSpecies: "Loài khác nhau",
    topGroup: "Nhóm nổi bật",
    none: "Chưa có",
    unknown: "Không rõ"
  },
  en: {
    navIdentify: "Identify",
    navCollection: "Album",
    navStats: "Stats",
    navAccount: "Account",
    primaryNav: "Primary navigation",
    langLabel: "Language",
    heroEyebrow: "AI animal recognition",
    heroLead: "Upload a photo, review confidence, and save it to your personal album.",
    heroCta: "Start",
    heroAlbum: "Open album",
    heroMetric: "91.7% test accuracy",
    heroCardTitle: "Identify real-world photos",
    heroCardBody: "Photos, confidence, and species data stay at the center.",
    uploadTitle: "Upload image",
    uploadHint: "JPG, PNG, WebP. Max 10MB.",
    chooseImage: "Choose or capture image",
    selectedImageAlt: "Selected animal image",
    predictIdle: "Identify",
    predictLoading: "Identifying",
    clearImage: "Clear",
    emptyResultTitle: "No result yet",
    emptyResultBody: "Choose an image to see species, confidence, and top-3 predictions.",
    highConfidence: "High confidence",
    uncertainConfidence: "Uncertain",
    lowConfidence: "Low confidence",
    habitat: "Habitat",
    diet: "Diet",
    group: "Group",
    danger: "Danger level",
    topPredictions: "Top-3 predictions",
    correctLabel: "Album label",
    correctionHint: "Edit this if AI is wrong.",
    saveIdle: "Save to album",
    saveLoading: "Saving",
    viewAlbum: "View album",
    needImage: "Choose an image before identifying.",
    predictFailed: "Could not identify this image.",
    loginRequired: "Sign in before saving.",
    saved: "Saved to album.",
    saveFailed: "Could not save result.",
    supabaseMissing: "Supabase env is required.",
    loginToSave: "Sign in to save",
    logout: "Sign out",
    authEyebrow: "Supabase Auth",
    authArtAlt: "Wildlife photo preview",
    loginTitle: "Sign in",
    signupTitle: "Create account",
    authLead: "Sign in to save your personal album.",
    loginTab: "Sign in",
    signupTab: "Sign up",
    email: "Email",
    password: "Password",
    submitting: "Working",
    signupCreated: "Account created. Confirm your email if Supabase requires it.",
    collectionEyebrow: "Personal album",
    collectionTitle: "Collection",
    all: "All",
    collectionNeedsConfig: "Supabase config is required to view the album.",
    collectionLoadFailed: "Could not load album.",
    collectionEmpty: "Album is empty",
    collectionEmptyBody: "Identify an image to begin.",
    identifyNew: "Identify new image",
    savedPhotoAlt: "Saved image of",
    delete: "Delete",
    profileEyebrow: "Profile",
    profileTitle: "Discovery stats",
    identifyMore: "Identify more",
    savedImages: "Saved images",
    uniqueSpecies: "Unique species",
    topGroup: "Top group",
    none: "None yet",
    unknown: "Unknown"
  }
} as const;

type TranslationKey = keyof typeof dictionary.vi;

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("vi");

  useEffect(() => {
    const stored = window.localStorage.getItem("animaldex-language");
    if (stored === "vi" || stored === "en") {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("animaldex-language", nextLanguage);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: TranslationKey) => dictionary[language][key]
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }
  return value;
}
