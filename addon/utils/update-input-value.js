export default function updateInputValue(input, value) {
  if (!input) { return; }
  if (input.contentEditable === 'true') {
    let currentValue = input.textContent;
    if (currentValue === value) { return; }
    input.textContent = value;
  } else {
    let currentValue = input.value;
    if (currentValue === value) { return; }
    input.value = value;
  }
}
