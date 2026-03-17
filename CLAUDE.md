# AI Test Repo

Simple Node.js project for testing AI agent capabilities.

## Running
npm start
npm test

## AI Agent Kurallari

### Soru Sorma Davranisi (CLAUDE.md kurallari skill davranisini override eder)
- TUM sorularini TEK SEFERDE sor. Tek tek sorma. Her tur-donus uzun surebilir.
- Her soru icin A/B/C secenekleri sun.
- Sadece birbirine BAGIMLI sorulari (dependent) ikinci tura birak.
- Bagimsiz sorulari AYNI mesajda sor.
- Soru sormadan cozebiliyorsan soru sorma, direkt coz.

### Dependent vs Independent Sorular
Independent (hepsini tek seferde sor):
- "Hangi DB?" + "Auth yontemi?" + "API stili?" → birbirinden bagimsiz

Dependent (sadece cevaptan sonra sor):
- "Hangi DB?" → cevap PostgreSQL ise → "Migration araci? (A: Prisma / B: Knex)"
- Ikinci soru birincinin cevabina bagimli, tek seferde sorulamaz.

### TDD
- Once test yaz, fail ettir, sonra implement et.
- Once kod yazip sonra test yazma. Istisnasiz.

### Cikti Formati (--print modunda)
SADECE 3 formattan birini kullan:

QUESTION:
1. Soru (A/B/C)
2. Soru (A/B/C)

DONE:
Degisiklikler: [dosyalar]
Testler: [test ciktisi]
Dogrulama: [lint/format]

FAILED:
Root cause: [neden]
Denenenler: [ne denendi]
Oneri: [ne yapilsin]
