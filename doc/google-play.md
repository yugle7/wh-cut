## 1. Загрузить AAB в Google Play

Создать приложение в Google Play Console.

Сначала использовать:

```text
Testing → Internal testing
```

Создать release и загрузить:

```text
app-release-bundle.aab
```

После загрузки Google Play использует **Google Play App Signing**.

---

## 2. Получить Google Play App Signing SHA-256

В новом интерфейсе:

```text
Protected with Play
→ Play Store protection
→ Manage Play App Signing
```

Найти:

```text
App signing key certificate
→ SHA-256
```

Добавить этот fingerprint в `assetlinks.json`:

```json
"sha256_cert_fingerprints": [
  "UPLOAD_KEY_SHA256",
  "GOOGLE_PLAY_APP_SIGNING_SHA256"
]
```

Закоммитить и запушить:

```bash
git add .well-known/assetlinks.json
git commit -m "Update Digital Asset Links"
git push
```

---

## 3. Проверить именно версию из Google Play

Это важно.

Установить приложение **из Internal testing**, а не APK вручную.

Если всё правильно, приложение открывается **без адресной строки Chrome.**

Если появляется адресная строка — проверить:

```bash
adb logcat -d | grep -i -E "OriginVerifier|digital_asset_links|assetlinks"
```

Ошибка:

```text
Statement failure matching fingerprint
```

означает проблему с SHA-256 в `assetlinks.json`.

---

## 4. Если SHA всё равно непонятен

Можно получить сертификат **реально установленного APK**:

```bash
adb shell pm path YOUR.APPLICATION.ID
```

Затем:

```bash
adb pull <путь_к_base.apk> ~/app.apk
```

И:

```bash
keytool -printcert -jarfile ~/app.apk
```

Полученный:

```text
SHA256:
```

должен присутствовать в `assetlinks.json`.

Это особенно полезно, если Google Play использует другой signing certificate.

---

## 5. После успешного Internal testing

Заполнить Google Play:

* Store listing;
* описание;
* иконку;
* feature graphic;
* screenshots;
* категорию;
* Content rating;
* Data safety;
* Privacy policy;
* Target audience;
* App access.

Затем создать Production release.

---

### Самая короткая схема

```text
     AAB
       │
       ▼
Google Play
       │
       └── App Signing SHA-256
       │
       ▼
assetlinks.json
       │
       ▼
https://DOMAIN/.well-known/assetlinks.json
       │
       ▼
Android verification
       │
       ▼
Trusted Web Activity
       │
       ▼
Google Play
```

**Ключевой нюанс, который стоит запомнить:** для PWA на `DOMAIN/PROJECT/` файл Digital Asset Links всё равно находится в **корне домена**:

```text
DOMAIN/.well-known/assetlinks.json
```


### 6. Google Play Console

**Test and release → Production → Create new release**

### 7. Выбери AAB

Если версия уже была опубликована в Internal testing, Google Play обычно позволяет **выбрать существующий App Bundle** из библиотеки релизов.

Выбери нужную версию, например:

```text
1.0.2 (4)
```

### 8. Создай Production release

**Next → Review release → Start rollout to production**

### 9. Если Google не разрешает Production

Для новых **личных developer accounts** Google может потребовать закрытое тестирование перед Production. 
Тогда в Play Console будет показано конкретное требование.

Если у тебя появляется такое сообщение — **пришли его сюда**, потому что там важен тип аккаунта и требуемый тест.

### 10. После отправки

Статус сначала будет примерно:

```text
In review
```

После проверки:

```text
Available on Google Play
```

И тогда приложение станет доступно обычным пользователям.
