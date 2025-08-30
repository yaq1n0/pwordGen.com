export type PasswordOptions = {
  length: number;
  includeUpper: boolean;
  includeLower: boolean;
  includeDigits: boolean;
  includeSymbols: boolean;
  customChars: string;
  excludeSimilar: boolean;
  exclude: string;
  requireEachSelectedClass: boolean;
};

export const defaultOptions: PasswordOptions = {
  length: 16,
  includeUpper: true,
  includeLower: true,
  includeDigits: true,
  includeSymbols: true,
  customChars: "",
  excludeSimilar: false,
  exclude: "",
  requireEachSelectedClass: true
};
