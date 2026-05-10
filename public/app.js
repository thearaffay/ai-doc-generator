let selectedFile = null;
let generatedYaml = null;

// File upload handling
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const generateBtn = document.getElementById('generateBtn');

// Drag and drop
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('border-blue-400', 'bg-blue-500/10');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('border-blue-400', 'bg-blue-500/10');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('border-blue-400', 'bg-blue-500/10');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
});

// File input change
fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
});

function handleFile(file) {
  selectedFile = file;
  fileName.textContent = file.name;
  fileInfo.classList.remove('hidden');
  generateBtn.disabled = false;
}

function clearFile() {
  selectedFile = null;
  fileInput.value = '';
  fileInfo.classList.add('hidden');
  generateBtn.disabled = true;
}

async function generateDocs() {
  if (!selectedFile) return;

  const loading = document.getElementById('loading');
  const output = document.getElementById('output');
  const downloadBtn = document.getElementById('downloadBtn');
  const stats = document.getElementById('stats');

  // Show loading
  loading.classList.remove('hidden');
  generateBtn.disabled = true;
  output.innerHTML = '<div class="text-gray-500 text-center py-12"><i class="fas fa-spinner fa-spin text-4xl mb-4"></i><p>Generating documentation...</p></div>';

  try {
    const formData = new FormData();
    formData.append('routeFile', selectedFile);

    const response = await fetch('/api/generate-docs', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      generatedYaml = data.documentation;
      
      // Display output with syntax highlighting
      output.innerHTML = `<pre class="text-green-300 whitespace-pre-wrap">${escapeHtml(data.documentation)}</pre>`;
      
      // Show download button
      downloadBtn.classList.remove('hidden');
      
      // Show stats
      stats.classList.remove('hidden');
      document.getElementById('tokensUsed').textContent = data.stats.tokensUsed;
      document.getElementById('generatedAt').textContent = new Date(data.stats.generatedAt).toLocaleTimeString();
      
      // Success notification
      showNotification('Documentation generated successfully!', 'success');
    } else {
      throw new Error(data.error || 'Failed to generate documentation');
    }

  } catch (error) {
    console.error('Error:', error);
    output.innerHTML = `<div class="text-red-400 text-center py-12"><i class="fas fa-exclamation-triangle text-4xl mb-4"></i><p>${error.message}</p></div>`;
    showNotification('Error generating documentation', 'error');
  } finally {
    loading.classList.add('hidden');
    generateBtn.disabled = false;
  }
}

function downloadYaml() {
  if (!generatedYaml) return;

  const blob = new Blob([generatedYaml], { type: 'text/yaml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'openapi-spec.yaml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showNotification('Documentation downloaded!', 'success');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  }`;
  notification.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-3"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
