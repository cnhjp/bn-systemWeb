import { makeInstaller } from '@packages/utils/installer'
import Components from './component'
import Plugins from './plugin'

export default makeInstaller([...Components, ...Plugins])
