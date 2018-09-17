import ToggleButton from './ToggleButton'

export default ({
  children,
  name,
  value,
  onChange,
  ...props
}) => {
  const active = value === name
  return (
    <ToggleButton
      active={active}
      disabled={active}
      onClick={() => onChange(name)}
      {...props}
    >
      {children}
    </ToggleButton>
  )
}
