# Saad Birthday Website 🎂

Spring Boot 3 + Thymeleaf birthday website.

## Run
```bash
mvn spring-boot:run
```
Open http://localhost:8080

## Customize
- `src/main/resources/application.properties` → name, from, age, birthday date
- `src/main/resources/static/images/saad.jpg` → replace with Saad's own cropped photo
  (keep the same file name, or update `index.html`)
- `src/main/java/com/abir/birthday/BirthdayController.java` → wishes & memories text
- The photo is shown in full (4:3 polaroid frame). Any photo works; a 4:3 photo fits best.
- Text: `wishes`, `goals` and `letter` lists in `BirthdayController.java`

## Song & video
- Song: put `song.mp3` in `src/main/resources/static/music/` (a floating 🎵 button appears)
- Video: put `memory.mp4` in `src/main/resources/static/memory/` (shown as the last section)
- Restart the app after adding files.

## Deploy on Railway
1. Push this folder to a GitHub repo (add `song.mp3` and `memory.mp4` first; keep each file well under 100 MB).
2. Railway > New Project > Deploy from GitHub repo > pick the repo. Railway finds the `Dockerfile` and builds it.
3. Service > Settings > Networking > **Generate Domain**. That is the link to share.
4. Optional Variables: `BIRTHDAY_NAME`, `BIRTHDAY_AGE`, `BIRTHDAY_DATE` (yyyy-MM-dd).
