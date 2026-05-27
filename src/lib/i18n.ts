export type SupportedLocale = 'en-AU' | 'zh-Hans' | 'vi' | 'ar';

export interface LocaleOption {
  code: SupportedLocale;
  label: string;
  dir: 'ltr' | 'rtl';
}

export const supportedLocales: LocaleOption[] = [
  { code: 'en-AU', label: 'English', dir: 'ltr' },
  { code: 'zh-Hans', label: '中文', dir: 'ltr' },
  { code: 'vi', label: 'Tiếng Việt', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
];

const messages: Record<SupportedLocale, Record<string, string>> = {
  'en-AU': {
    estimateNotice: 'Your estimate is a planning guide and needs professional review before written scope confirmation.',
    startQuote: 'Start kitchen quote',
    privacyNotice: 'Please acknowledge the privacy collection notice before submitting.',
  },
  'zh-Hans': {
    estimateNotice: '此估算仅供规划参考，书面范围确认前需要专业审核。',
    startQuote: '开始厨房报价',
    privacyNotice: '提交前请确认您已阅读隐私收集通知。',
  },
  vi: {
    estimateNotice: 'Ước tính này chỉ dùng để lập kế hoạch và cần được chuyên gia kiểm tra trước khi xác nhận phạm vi bằng văn bản.',
    startQuote: 'Bắt đầu báo giá bếp',
    privacyNotice: 'Vui lòng xác nhận thông báo thu thập thông tin cá nhân trước khi gửi.',
  },
  ar: {
    estimateNotice: 'هذا التقدير مخصص للتخطيط فقط ويحتاج إلى مراجعة مهنية قبل تأكيد نطاق العمل كتابياً.',
    startQuote: 'ابدأ عرض سعر المطبخ',
    privacyNotice: 'يرجى تأكيد إشعار جمع المعلومات الشخصية قبل الإرسال.',
  },
};

export function getLocalizedMessage(locale: SupportedLocale, key: keyof typeof messages['en-AU']) {
  return messages[locale]?.[key] ?? messages['en-AU'][key];
}

export function isRtlLocale(locale: SupportedLocale) {
  return supportedLocales.find((option) => option.code === locale)?.dir === 'rtl';
}
