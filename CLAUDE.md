# AI Test Repo

Simple Node.js project for testing AI agent capabilities.

## Running
npm start
npm test

## AI Agent Kurallari

Bu kurallar superpowers skill davranislarini override eder (CLAUDE.md > skills).
Bu proje otonom agent tarafindan --print modunda calistirilir. Interaktif degildir.

### Genel Kurallar
- Skill tool, TodoWrite, EnterPlanMode gibi interaktif tool'lar KULLANMA. --print modunda calismiyorlar.
- Her mesajin bir GitHub comment olarak yazilacak. Insan cevap verene kadar beklenecek. Tur sayisini minimize et.
- Brainstorming skill'inin "design doc yaz ve onay al" adimlari ATLA. Direkt implement et.
- Writing plans skill'inin "execution choice sun" adimini ATLA. Direkt execute et.
- Hicbir adimda kullanicidan onay bekleme. Ya coz ya soru sor ya basarisiz ol.

### Soru Sorma (Brainstorming Override)
- TUM sorularini TEK SEFERDE sor. Tek tek sorma.
- Her soru icin A/B/C secenekleri sun.
- Sadece BAGIMLI (dependent) sorulari ikinci tura birak.
- Bagimsiz sorulari AYNI mesajda sor.
- Soru sormadan cozebiliyorsan soru sorma, direkt coz.

Dependent ornek:
- "Hangi DB?" → cevap PostgreSQL ise → "Migration araci? (A: Prisma / B: Knex)"
Independent ornek (hepsini tek seferde sor):
- "Hangi DB?" + "Auth yontemi?" + "API stili?"

### TDD (Test-Driven Development)
- Once test yaz, calistir, FAIL ettigini dogrula.
- Sonra minimum kodu yaz, calistir, PASS ettigini dogrula.
- Once kod yazip sonra test yazma. Istisnasiz.
- "Watch it fail" adimini GERCEKTEN CALISTIR, sadece varsayma.

### Debugging (Systematic Debugging Override)
- Root cause ara, symptom'a yama yapma.
- 3 denemeden sonra cozemiyorsan FAILED formatinda cik. "Insan partner ile tartis" yerine FAILED yaz.
- "Bir fix daha deneyeyim" deme. 3 deneme limiti kesin.

### Dogrulama (Verification Override)
- DONE demeden once TUM testleri calistir ve ciktiyi kontrol et.
- "Should pass" / "Probably works" YASAK. Calistir ve sonucu goster.
- Lint/format araci varsa calistir.

### Cikti Formati
SADECE 3 formattan birini kullan. Baska hicbir sey ekleme.

QUESTION:
1. Soru (A: secenek / B: secenek / C: secenek)
2. Soru (A: secenek / B: secenek)
...

DONE:
Degisiklikler: [dosyalar, ne degisti]
Testler: [test komutu ciktisi - kac test, kaci gecti]
Dogrulama: [lint/format sonucu]

FAILED:
Root cause: [tespit edilen neden]
Denenenler: [ne denendi, neden calismadi]
Oneri: [insan ne yapsin]
