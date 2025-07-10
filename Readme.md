# 📧 Resilient Email Sending Service

A simple and robust email sending system built using **JavaScript** that simulates real-world resilience patterns like retries, fallback providers, rate limiting, idempotency, and circuit breakers.

---

## ✅ Features Implemented

* **Two Mock Email Providers**: ProviderA and ProviderB
* **Retry Logic**: Up to 3 attempts per provider with exponential backoff
* **Fallback Mechanism**: Switch to second provider if the first fails
* **Idempotency**: Prevents duplicate emails using a unique `email ID`
* **Rate Limiting**: Max 5 emails allowed per 60 seconds
* **Circuit Breaker**: Avoids retrying failing providers for 30 seconds

---

## 🧱 Project Structure

````
```
email-service/
├── src/
│   ├── EmailService.js
│   ├── index.js
│   ├── utils/
│   │   ├── delay.js
│   │   ├── RateLimiter.js
│   │   └── CircuitBreaker.js
│   └── providers/
│       ├── ProviderA.js
│       └── ProviderB.js
├── package.json
├── README.md
```
````

---

## 🚀 How to Run

### 1. Clone the project

```bash
git clone <repo-url>
cd email-service
```

### 2. Run the app

```bash
node index.js
```

> You will see emails being sent, retried, switched between providers, and blocked due to rate limit or circuit breaker.

---

## 🧪 Test Cases Covered

* ✅ Send a new email → should go through
* ✅ Send the same email ID again → should be skipped (idempotency)
* ✅ Exceed rate limit (5 emails in 60 sec) → blocked
* ✅ Force ProviderA to fail → circuit breaker opens
* ✅ Circuit resets after cooldown → resumes sending

---

## 🧠 Concepts Covered

| Feature         | Concept                         |
| --------------- | ------------------------------- |
| Retry           | Exponential backoff             |
| Fallback        | Switch providers on failure     |
| Idempotency     | Avoid duplicates via ID         |
| Rate Limiting   | Throttle email sending rate     |
| Circuit Breaker | Stop retrying failing providers |

---

## 📄 Assumptions

* Providers are mocked using `Math.random()` to simulate success/failure.
* No external APIs are used.
* No database, in-memory `Set()` used to simulate idempotency.
* No third-party libraries except native JS.

---

---

## 👨‍💻 Author

**Niketan Santosh Koyande**
