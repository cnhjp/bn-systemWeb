import StringExtend from './src/StringExtend'
import NumberExtend from './src/NumberExtend'
import ArrayExtend from './src/ArrayExtend'
import DateExtend from './src/DateExtend'
import MathExtend from './src/MathExtend'
import FileExtend from './src/FileExtend'
import { makePluginInstaller } from '@packages/utils/installer'

export default makePluginInstaller((app) => {
  StringExtend.install?.(app)
  NumberExtend.install?.(app)
  ArrayExtend.install?.(app)
  DateExtend.install?.(app)
  MathExtend.install?.(app)
  FileExtend.install?.(app)
})

export * from './src/NumberExtend'
export * from './src/ArrayExtend'
export * from './src/DateExtend'
export * from './src/MathExtend'
export * from './src/FileExtend'
