const codeInput = document.getElementById("codeInput");
const previewCode = document.getElementById("previewCode");
const copyBtn = document.getElementById("copyBtn");
const copyMessage = document.getElementById("copyMessage");

function updatePreview() {
  previewCode.textContent = codeInput.value.trim()
    ? codeInput.value
    : "// Your code will appear here...";
}

async function copyCode() {
  const code = codeInput.value;

  if (!code.trim()) {
    copyMessage.textContent = "Please add some code first.";
    return;
  }

  try {
    await navigator.clipboard.writeText(code);
    copyMessage.textContent = "Code copied successfully!";
  } catch {
    copyMessage.textContent = "Copy failed. Please copy manually (Ctrl/Cmd + C).";
  }

  window.setTimeout(() => {
    copyMessage.textContent = "";
  }, 1800);
}

codeInput.addEventListener("input", updatePreview);
copyBtn.addEventListener("click", copyCode);

updatePreview();