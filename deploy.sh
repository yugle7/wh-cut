bubblewrap init --manifest=https://yugle7.github.io/wh-cut/manifest.webmanifest

cwebp -q 70 -m 6 screenshot.png -o screenshot.webp

# без фона
rsvg-convert -w 192 -h 192 icon.svg -o icons/icon-192.png
rsvg-convert -w 512 -h 512 icon.svg -o icons/icon-512.png

# с фоном
rsvg-convert -w 192 -h 192 icon-maskable.svg -o icons/icon-maskable-192.png
rsvg-convert -w 512 -h 512 icon-maskable.svg -o icons/icon-maskable-512.png