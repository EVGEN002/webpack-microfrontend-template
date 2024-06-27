const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

// Пример использования
const api = () => {
  fetch(`${apiUrl}/data`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  })
    .then(response => {
      // Обработка ответа
    })
    .catch(error => {
      // Обработка ошибок
  });
}