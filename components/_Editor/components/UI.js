import SelectionPathMenu from './SelectionPathMenu'
import Slot from './Slot'
import { withTheme } from '../apps/theme'

const SIDEBAR_BLOCK_OPTIONS =
  'SIDEBAR_BLOCK_OPTIONS'
export const SidebarBlockOptions = ({
  children,
}) => (
  <Slot id={SIDEBAR_BLOCK_OPTIONS}>
    {children}
  </Slot>
)

const SIDEBAR_FORMAT_OPTIONS =
  'SIDEBAR_FORMAT_OPTIONS'
export const SidebarFormatOptions = ({
  children,
}) => (
  <Slot id={SIDEBAR_FORMAT_OPTIONS}>
    {children}
  </Slot>
)

const SIDEBAR_INSERT_OPTIONS =
  'SIDEBAR_INSERT_OPTIONS'
export const SidebarInsertOptions = ({
  children,
}) => (
  <Slot id={SIDEBAR_INSERT_OPTIONS}>
    {children}
  </Slot>
)

const SIDEBAR_TEXT_OPTIONS =
  'SIDEBAR_TEXT_OPTIONS'
export const SidebarTextOptions = ({
  children,
}) => (
  <Slot id={SIDEBAR_TEXT_OPTIONS}>
    {children}
  </Slot>
)

const SIDEBAR_BOTTOM = 'SIDEBAR_BOTTOM'
export const SidebarBottom = ({ children }) => (
  <Slot id={SIDEBAR_BOTTOM}>{children}</Slot>
)

const SIDEBAR_TOP = 'SIDEBAR_TOP'
export const SidebarTop = ({ children }) => (
  <Slot id={SIDEBAR_TOP}>{children}</Slot>
)

export default withTheme()(({ styles }) => (
  <div {...styles.layout.ui}>
    <SelectionPathMenu />
    <div id={SIDEBAR_TOP} />
    <div id={SIDEBAR_TEXT_OPTIONS} />
    <div id={SIDEBAR_FORMAT_OPTIONS} />
    <div id={SIDEBAR_BLOCK_OPTIONS} />
    <div id={SIDEBAR_INSERT_OPTIONS} />
    <div id={SIDEBAR_BOTTOM} />
  </div>
))
