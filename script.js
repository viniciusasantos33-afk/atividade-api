const form = document.getElementById('form-nasa');
const inputData = document.getElementById('data-nascimento');
const loading = document.getElementById('loading');
const resultado = document.getElementById('resultado');
const erro = document.getElementById('erro');

const titulo = document.getElementById('titulo');
const dataExibida = document.getElementById('data-exibida');
const mediaContainer = document.getElementById('media-container');
const descricao = document.getElementById('descricao');
const credito = document.getElementById('credito');

inputData.min = '1995-06-16';
inputData.max = new Date().toISOString().split('T')[0];

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const data = inputData.value;

  if (!data) return;

  loading.classList.remove('hidden');
  resultado.classList.add('hidden');
  erro.classList.add('hidden');

  try {
    const [ano, mes, dia] = data.split('-');
    const dataNASA = `${ano.slice(2)}${mes}${dia}`;

    const url = `https://science.nasa.gov/wp-json/wp/v2/apod-basic/${dataNASA}`;

    console.log('Buscando APOD:', data);
    console.log('URL:', url);

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Não existe uma publicação da NASA para essa data.');
      }

      throw new Error(`Erro HTTP ${response.status}`);
    }

    const apod = await response.json();

    console.log('APOD encontrado:', apod);

    titulo.textContent = apod.title || 'Publicação Astronômica do Dia';
    dataExibida.textContent = `Data oficial: ${apod.date}`;

    descricao.innerHTML = apod.explanation || 'Sem descrição disponível.';

    descricao.querySelectorAll('a').forEach((link) => {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });

    credito.innerHTML = apod.credit || apod.copyright || 'NASA';

    mediaContainer.innerHTML = '';

    if (apod.media_type === 'image' && apod.hdurl) {
      const img = document.createElement('img');

      img.src = apod.hdurl;
      img.alt = apod.alt || apod.title || 'Imagem astronômica da NASA';

      mediaContainer.appendChild(img);
    } else if (apod.media_type === 'video' && apod.url) {
      const iframe = document.createElement('iframe');

      iframe.src = apod.url;
      iframe.title = apod.title || 'Vídeo da NASA';
      iframe.allowFullscreen = true;

      mediaContainer.appendChild(iframe);
    } else {
      const link = document.createElement('a');

      link.href = apod.permalink || apod.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = '🔗 Abrir publicação no site da NASA';

      mediaContainer.appendChild(link);
    }

    resultado.classList.remove('hidden');

  } catch (error) {
    console.error('Erro:', error);

    erro.textContent = `Ops! ${error.message}`;
    erro.classList.remove('hidden');

  } finally {
    loading.classList.add('hidden');
  }
});