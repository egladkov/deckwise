Всегда отвечай только на русском языке. Даже если вопрос задан на другом языке, отвечай по-русски. Не переходи на английский без явной просьбы.

## Project Context

Project: Deckwise AI dashboard MVP.

Stack:

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Zustand
* localStorage (только для UI-кэша и настроек)
* Supabase Auth & Supabase Postgres DB (как Source of Truth)
* OpenAI API через Next.js API routes

Проект является MVP. Он использует Supabase Auth для управления сессиями и Supabase DB для хранения данных.
Mock-данные и заглушки остаются только для платежей/биллинга (billing history/payment method) и некоторых специфичных демо-сценариев.

## Main Product Goal

Панель (dashboard) — это рабочее пространство пользователя для проведения ИИ-анализа презентаций (pitch decks).

Пользователь должен иметь возможность:

* регистрироваться и входить через Supabase Auth;
* загружать файл pitch deck;
* запускать ИИ-анализ;
* видеть структурированный инвесторский фидбек;
* просматривать историю анализов;
* управлять данными профиля;
* просматривать текущий лимит и менять mock-тарифный план;
* менять пароль через Supabase Auth;
* удалять аккаунт и связанные данные через защищенный серверный роут;
* использовать MVP с реальной обработкой через OpenAI API.

## Required Dashboard Sections

Панель должна содержать разделы:

* Overview
* New Review
* Review History
* Review Details
* Profile
* Subscription
* Settings

Профиль, Подписка и Настройки должны быть строго разделены. Не смешивайте данные профиля, логику биллинга/подписок и настройки безопасности аккаунта на одной странице.

## Route Structure

```txt
/app
  /(auth)
    /login
    /register
    /forgot-password

  /dashboard
    /page.tsx
    /new-review
    /reviews
    /reviews/[id]
    /profile
    /subscription
    /settings

  /api
    /ai
      /review
      /chat
    /account
      /delete
```

## Dashboard Layout Rules

Совместное использование макета панели (shared dashboard layout).

Десктоп:
* левый sidebar;
* верхний header;
* центральная область контента.

Мобильная версия:
* адаптивный header;
* drawer или нижняя навигация;
* отсутствие горизонтального скролла;
* все формы адаптированы под малые экраны.

Sidebar items:
* Overview
* New Review
* Reviews
* Profile
* Subscription
* Settings
* Logout

Header:
* текущий тарифный план (PlanBadge);
* счетчик лимитов (UsageCard);
* меню пользователя.

## Architecture Rules

Используйте Feature-based структуру:

```txt
src/
  app/
  components/
  stores/
  services/
  lib/
  types/
  constants/
```

Бизнес-логика не должна находиться внутри UI-компонентов.
UI-компоненты должны оставаться презентационными.
Управление состоянием выполняется в Zustand-сторах.
Доступ к персистентным данным — исключительно через сервисный слой (services).
Запросы к OpenAI и административные вызовы Supabase API (например, удаление пользователей) выполняются только через серверные роуты (Next.js API routes).

## TypeScript Rules

Используйте строгий TypeScript.
Не используйте `any`, кроме оправданных случаев.
Явно типизируйте все сущности:
* User
* Plan
* Subscription
* DeckReview
* ReviewStatus
* SlideFeedback
* AIReviewRequest
* AIReviewResponse

Для статусов и идентификаторов тарифов используйте union types.

## Supabase & Security Rules

* **Supabase Auth** — единственный источник правды (Source of Truth) для авторизации и сессий.
* **Supabase DB** — единственный источник правды для профилей, подписок, истории анализов и сообщений чата.
* **Row Level Security (RLS)** — обязательно должна быть включена на всех таблицах БД (`profiles`, `subscriptions`, `deck_reviews`, `review_messages`).
* Пользователь ни при каких условиях не должен иметь возможности просматривать или изменять чужие данные.
* Не вызывайте методы Supabase напрямую из UI-компонентов. Всегда используйте сервисный слой (`services/`).
* Ключ `SUPABASE_SERVICE_ROLE_KEY` и admin-клиент Supabase могут использоваться **только на стороне сервера**. Никогда не экспортируйте их на клиент.
* Ключ `OPENAI_API_KEY` используется строго на сервере.
* Подтверждение регистрации по почте отключается в настройках Supabase Dashboard (`Authentication → Providers → Email → Confirm email = disabled`) для мгновенного входа после регистрации.
* Форма регистрации должна требовать повторный ввод пароля (password + confirmPassword). Поле `confirmPassword` проверяется локально, не сохраняется в БД и не отправляется в Supabase.
* localStorage и IndexedDB используются исключительно в качестве UI-кэша или хранения пользовательских предпочтений (например, тема оформления, свернутый sidebar).
* Удаление аккаунта реализуется только через защищенный серверный роут `/api/account/delete`, выполняющий удаление пользователя из Auth с каскадным удалением его данных в БД.

## AI & Review Output Rules

* Запросы к OpenAI выполняются только через `/api/ai/review` и `/api/ai/chat`.
* Модели ИИ настраиваются через переменные окружения.
* Ответы от ИИ запрашиваются как структурированный JSON и валидируются перед сохранением. Невалидные ответы не должны сохраняться в историю как завершенные.
* Результат анализа должен содержать: общую оценку, оценку-букву, резюме, сильные и слабые стороны, отсутствующие инвесторские сигналы, вопросы инвесторов, постраничный фидбек и рекомендации.

## UI & UX Rules

* Используйте shadcn/ui и Tailwind CSS.
* Сохраняйте единый визуальный стиль сайта и панели.
* Используйте empty states при отсутствии данных, loading states для асинхронных операций (upload, extraction, analysis) и toasts для уведомлений об успехе или ошибках.
* Ошибки для пользователя должны быть понятными и не содержать технических деталей (stack trace).
