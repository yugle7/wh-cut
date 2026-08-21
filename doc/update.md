## Обновление PWA/TWA в Google Play

### Если изменился только сайт

Изменил:

```text
index.html
script.js
style.css
sw.js
```

Достаточно:

```bash
git add .
git commit -m "Update app"
git push
```

**AAB пересобирать не нужно.**

---

### Если изменился TWA/Android

Например, изменил иконку, цвета, ориентацию или другие параметры `twa-manifest.json`.

```bash
cd ~/android/wh-cut
```

1. Обновить версию:

```bash
bubblewrap update --appVersionName="1.0.1"
```

`versionCode` увеличится автоматически.

2. Собрать новый AAB:

```bash
bubblewrap build
```

3. В Google Play Console:

```text
Testing → Internal testing
→ Create new release
→ Upload app-release-bundle.aab
→ Publish
```

После проверки можно выпускать в Production.

---

### Важно

**Не создавай новый keystore.** Используй тот же:

```text
~/android/wh-cut/android.keystore
```

и тот же alias.

`applicationId` тоже не меняй:

```text
io.github.yugle7.whcut
```

`assetlinks.json` при обычном обновлении **менять не нужно**.

### Итого

```text
Изменил PWA → git push

Изменил Android/TWA →
bubblewrap update
→ bubblewrap build
→ новый AAB
→ Google Play
```

