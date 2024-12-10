# CoolAI 🚀
> This is just a small project/prototype for me to learn, not intended for production. Hence, tokens shall only last for a day.

CoolAI is a cool AI wrapper I made because I want to learn more about making webservice/API/tokens some sort of thing + Gemini API does not really support Javascript, making it hard to implement on static sites. I'd say that it's pretty easy to use, but well, it could definitely be better to use in projects if the token doesn't expire.

## Getting Started

1. Sign up at [CoolAI Auth](https://codingkatty.github.io/coolai/auth)
2. Verify on email, get your API key
3. Start making requests!

```javascript
const response = await fetch('https://coolai.onrender.com/generate', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        prompt: 'What is artificial intelligence?'
    })
});

const data = await response.json();
console.log(data.response);
```

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Google AI](https://img.shields.io/badge/Google_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)