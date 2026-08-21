### 1. Google Play Console

**Test and release → Production → Create new release**

### 2. Выбери AAB

Если версия уже была опубликована в Internal testing, Google Play обычно позволяет **выбрать существующий App Bundle** из библиотеки релизов.

Выбери нужную версию, например:

```text
1.0.0 (2)
```

### 3. Создай Production release

**Next → Review release → Start rollout to production**

### 4. Если Google не разрешает Production

Для новых **личных developer accounts** Google может потребовать закрытое тестирование перед Production. 
Тогда в Play Console будет показано конкретное требование.

Если у тебя появляется такое сообщение — **пришли его сюда**, потому что там важен тип аккаунта и требуемый тест.

### 5. После отправки

Статус сначала будет примерно:

```text
In review
```

После проверки:

```text
Available on Google Play
```

И тогда приложение станет доступно обычным пользователям.
