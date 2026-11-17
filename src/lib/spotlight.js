export function spotlight(event) {
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', (event.clientX - rect.left).toFixed(0) + 'px')
  el.style.setProperty('--my', (event.clientY - rect.top).toFixed(0) + 'px')
}