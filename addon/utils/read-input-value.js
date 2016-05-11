export default function readInputValue(input) {
  if (!input) { return; }
  return input.contentEditable === 'true' ? input.textContent : input.value;
}
