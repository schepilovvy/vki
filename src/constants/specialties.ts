export const SPECIALTIES = [
  'Компьютерные системы и комплексы',
  'Информационные системы и программирование',
  'Интеллектуальные интегрированные системы',
] as const;

export type Specialty = typeof SPECIALTIES[number];


