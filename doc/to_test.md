# PWA → Google Play через TWA

## 1. Подготовить PWA

Проверить:

* HTTPS.
* `manifest.webmanifest`.
* Service Worker.
* `display: "standalone"`.
* Корректные `start_url` и `scope`.
* Иконки минимум 512×512, включая maskable.
* PWA нормально работает по адресу:

```text
https://USERNAME.github.io/PROJECT/
```

```bash
rsvg-convert -w 192 -h 192 icon-maskable.svg -o icons/icon-192-maskable.png
rsvg-convert -w 512 -h 512 icon-maskable.svg -o icons/icon-512-maskable.png
```


Для project site:

```json
{
  "start_url": "/PROJECT/",
  "scope": "/PROJECT/"
}
```

---

## 2. Создать GitHub Pages для Digital Asset Links

Для PWA:

```text
https://yugle7.github.io/wh-cut/
```

нужен отдельный GitHub Pages root:

```text
https://yugle7.github.io/
```

Создать репозиторий:

```text
yugle7.github.io
```

В нём:

```text
.well-known/
└── assetlinks.json

index.html
.nojekyll
```

GitHub Pages:

```text
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

`.nojekyll` нужен, чтобы `.well-known` нормально публиковался.

Проверить:

```bash
curl -I https://yugle7.github.io/
curl -I https://yugle7.github.io/.well-known/assetlinks.json
```

Оба должны вернуть `HTTP 200`.

---

## 3. Установить bubblewrap

```bash
npm install -g @bubblewrap/cli
```

Создать TWA:

```bash
bubblewrap init --manifest=https://yugle7.github.io/wh-cut/manifest.webmanifest
```

Для project site:

```text
Domain: yugle7.github.io
URL path: /wh-cut/
```

Основные параметры:

```text
Application name: Раскрой
Short name: whCut
Application ID: io.github.yugle7.whcut
Display mode: standalone
Orientation: portrait-primary
```

---

## 4. Создать signing key

При `bubblewrap init` указать:

```text
Key store location: /Users/gleb/android/wh-cut/android.keystore
Key name: ...
```

* `.keystore`
* пароль keystore
* пароль key
* alias

**Keystore нельзя терять.**

---

## 5. Собрать TWA

```bash
bubblewrap build
```

Получить:

```text
app-release-bundle.aab
app-release-signed.apk
```

Для Google Play нужен:

```text
app-release-bundle.aab
```

---

## 6. Создать первоначальный `assetlinks.json`

Структура:

```json
[
  {
    "relation": [
      "delegate_permission/common.handle_all_urls"
    ],
    "target": {
      "namespace": "android_app",
      "package_name": "io.github.yugle7.whcut",
      "sha256_cert_fingerprints": [
        "YOUR_UPLOAD_KEY_SHA256"
      ]
    }
  }
]
```

SHA-256 получить:

```bash
keytool -list -v -keystore /Users/gleb/android/wh-cut/android.keystore
```

---

## 7. Проверить Digital Asset Links

После публикации:

```bash
curl -s https://yugle7.github.io/.well-known/assetlinks.json
```

Также полезно проверить через Digital Asset Links API:

```bash
curl 'https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https%3A%2F%2FUSERNAME.github.io&relation=delegate_permission%2Fcommon.handle_all_urls'
```

В результате должны присутствовать:

```text
packageName: io.github.yugle7.whcut
```

и соответствующий SHA-256.

---

## 8. Загрузить AAB в Google Play

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

## 9. Получить Google Play App Signing SHA-256

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

## 10. Проверить именно версию из Google Play

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

## 11. Если SHA всё равно непонятен

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

## 12. После успешного Internal testing

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
PWA
 │
 ├── manifest
 ├── service worker
 └── HTTPS
       │
       ▼
Bubblewrap
       │
       ├── package ID
       ├── signing key
       └── TWA
       │
       ▼
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

