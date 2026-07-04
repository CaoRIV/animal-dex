"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Language = "vi" | "en";

export const dictionary = {
  vi: {
    navIdentify: "Nhận diện",
    navCollection: "Album",
    navStats: "Dấu chân",
    navAccount: "Tài khoản",
    primaryNav: "Điều hướng chính",
    langLabel: "Ngôn ngữ",
    heroEyebrow: "Nhận diện động vật bằng AI",
    heroLead: "Chọn một tấm ảnh, xem AnimalDex nhận ra điều gì và lưu lại những lần khám phá của bạn.",
    heroCta: "Thử ngay",
    heroAlbum: "Mở album",
    heroCardTitle: "Xem ảnh thuộc loài nào",
    heroCardBody: "Ảnh, độ chắc chắn và thông tin loài được đặt ở trung tâm.",
    uploadTitle: "Chọn ảnh",
    uploadHint: "Hỗ trợ JPG, PNG, WebP. Tối đa 10MB.",
    chooseImage: "Chọn hoặc chụp ảnh",
    selectedImageAlt: "Ảnh động vật đang được chọn",
    predictIdle: "Xem kết quả",
    predictLoading: "Đang xem ảnh",
    clearImage: "Xóa ảnh",
    emptyResultTitle: "Chưa có ảnh để xem",
    emptyResultBody: "Sau khi chọn ảnh, AnimalDex sẽ gợi ý loài phù hợp nhất và vài khả năng gần giống.",
    highConfidence: "Khớp khá cao",
    uncertainConfidence: "Cần xem lại",
    lowConfidence: "Chưa đủ chắc",
    habitat: "Môi trường sống",
    diet: "Chế độ ăn",
    group: "Nhóm",
    danger: "Mức độ nguy hiểm",
    topPredictions: "Những khả năng gần nhất",
    hoverPreviewEyebrow: "Thông tin đầy đủ",
    matchScore: "Độ khớp",
    savedAt: "Ngày lưu",
    openAnimalDetails: "Xem thông tin",
    closePreview: "Đóng xem nhanh",
    correctLabel: "Tên sẽ lưu trong album",
    correctionHint: "Nếu kết quả chưa đúng, bạn có thể sửa tại đây.",
    saveIdle: "Lưu vào album",
    saveLoading: "Đang lưu",
    viewAlbum: "Xem album",
    needImage: "Bạn chọn một ảnh trước nhé.",
    predictFailed: "AnimalDex chưa xem được ảnh này.",
    loginRequired: "Bạn cần đăng nhập trước khi lưu.",
    saved: "Đã lưu vào album.",
    saveFailed: "Chưa lưu được kết quả.",
    supabaseMissing: "Cần thiết lập Supabase để lưu album.",
    loginToSave: "Đăng nhập để lưu",
    logout: "Đăng xuất",
    authEyebrow: "Tài khoản AnimalDex",
    authArtAlt: "Ảnh minh họa động vật trong tự nhiên",
    loginTitle: "Đăng nhập",
    signupTitle: "Tạo tài khoản",
    authLead: "Đăng nhập để giữ lại album khám phá của bạn.",
    loginTab: "Đăng nhập",
    signupTab: "Đăng ký",
    email: "Email",
    password: "Mật khẩu",
    submitting: "Đang xử lý",
    signupCreated: "Tài khoản đã được tạo. Nếu Supabase yêu cầu, bạn hãy xác nhận email nhé.",
    collectionEyebrow: "Album cá nhân",
    collectionTitle: "Bộ sưu tập",
    all: "Tất cả",
    collectionNeedsConfig: "Cần thiết lập Supabase để xem album.",
    collectionLoadFailed: "Chưa tải được album.",
    collectionEmpty: "Album còn trống",
    collectionEmptyBody: "Hãy thử nhận diện một ảnh để thêm loài đầu tiên.",
    identifyNew: "Thêm ảnh mới",
    savedPhotoAlt: "Ảnh đã lưu của",
    delete: "Xóa",
    profileEyebrow: "Góc cá nhân",
    profileTitle: "Dấu chân khám phá",
    identifyMore: "Khám phá thêm",
    savedImages: "Ảnh đã lưu",
    uniqueSpecies: "Loài khác nhau",
    topGroup: "Nhóm gặp nhiều nhất",
    none: "Chưa có",
    unknown: "Không rõ"
  },
  en: {
    navIdentify: "Identify",
    navCollection: "Album",
    navStats: "Trail",
    navAccount: "Account",
    primaryNav: "Primary navigation",
    langLabel: "Language",
    heroEyebrow: "AI animal recognition",
    heroLead: "Choose a photo, see what AnimalDex finds, and keep your discoveries in one place.",
    heroCta: "Try it",
    heroAlbum: "Open album",
    heroCardTitle: "Identify real-world photos",
    heroCardBody: "Photos, match strength, and species details stay at the center.",
    uploadTitle: "Choose a photo",
    uploadHint: "JPG, PNG, WebP. Up to 10MB.",
    chooseImage: "Choose or take a photo",
    selectedImageAlt: "Selected animal image",
    predictIdle: "See result",
    predictLoading: "Reading image",
    clearImage: "Clear",
    emptyResultTitle: "No photo yet",
    emptyResultBody: "Choose a photo and AnimalDex will suggest the closest species matches.",
    highConfidence: "Strong match",
    uncertainConfidence: "Worth checking",
    lowConfidence: "Not sure yet",
    habitat: "Habitat",
    diet: "Diet",
    group: "Group",
    danger: "Risk level",
    topPredictions: "Closest matches",
    hoverPreviewEyebrow: "Full details",
    matchScore: "Match",
    savedAt: "Saved",
    openAnimalDetails: "View details for",
    closePreview: "Close preview",
    correctLabel: "Name saved to album",
    correctionHint: "You can edit this if the result looks off.",
    saveIdle: "Save to album",
    saveLoading: "Saving",
    viewAlbum: "View album",
    needImage: "Choose a photo first.",
    predictFailed: "AnimalDex could not read this photo.",
    loginRequired: "Sign in before saving.",
    saved: "Saved to album.",
    saveFailed: "Could not save this result.",
    supabaseMissing: "Supabase setup is required to save albums.",
    loginToSave: "Sign in to save",
    logout: "Sign out",
    authEyebrow: "AnimalDex account",
    authArtAlt: "Wildlife photo preview",
    loginTitle: "Sign in",
    signupTitle: "Create account",
    authLead: "Sign in to keep your discovery album.",
    loginTab: "Sign in",
    signupTab: "Sign up",
    email: "Email",
    password: "Password",
    submitting: "Working",
    signupCreated: "Account created. Confirm your email if Supabase asks for it.",
    collectionEyebrow: "Personal album",
    collectionTitle: "Your collection",
    all: "All",
    collectionNeedsConfig: "Supabase setup is required to view the album.",
    collectionLoadFailed: "Could not load the album.",
    collectionEmpty: "Your album is empty",
    collectionEmptyBody: "Try identifying a photo to add your first species.",
    identifyNew: "Add a photo",
    savedPhotoAlt: "Saved image of",
    delete: "Delete",
    profileEyebrow: "Your space",
    profileTitle: "Discovery trail",
    identifyMore: "Explore more",
    savedImages: "Saved images",
    uniqueSpecies: "Unique species",
    topGroup: "Most seen group",
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
