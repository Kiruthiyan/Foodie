import { colors } from './colors';
import { spacing, layout } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  layout,
  typography,
};

export type Theme = typeof theme;
export * from './colors';
export * from './spacing';
export * from './typography';
