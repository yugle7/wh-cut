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
rsvg-convert -w 192 -h 192 icon.svg -o icons/icon-192.png
rsvg-convert -w 512 -h 512 icon.svg -o icons/icon-512.png
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
```

**Ключевой нюанс, который стоит запомнить:** для PWA на `DOMAIN/PROJECT/` файл Digital Asset Links всё равно находится в **корне домена**:

```text
DOMAIN/.well-known/assetlinks.json
```

