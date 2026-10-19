# DMX11 — Intro do DN-XI (Remotion)

Motion graphics em estilo documental (papel envelhecido, grade milimetrada, recortes de foto em P&B,
um único acento amarelo) para a narração `public/audio/intro.mp3` (30 s, espanhol).
1920×1080 · 30 fps · 930 frames. Roteiro cena a cena em [STORYBOARD.md](STORYBOARD.md).

## Editar na nuvem

- **Codespaces**: botão *Code → Codespaces → Create codespace on main*. O container instala tudo
  sozinho; depois rode `npm run dev` e abra a porta 3000 (Remotion Studio).
- **Render na nuvem**: todo push na `main` dispara *Actions → Render video*, que gera
  `dmx11-intro.mp4` e o anexa como artefato da execução (Actions → execução → *Artifacts*).
  Para renderizar sem efeitos sonoros: *Run workflow* com `sfx = false`. O volume da trilha e de
  cada efeito fica em `src/Intro.tsx` (`musicVolume`, `WHOOSH`, `CUES`).

## Rodar localmente

```bash
npm ci
npm run dev        # Remotion Studio
npm run render     # out/dmx11-intro.mp4
node scripts/stills.mjs 120 380 530   # frames de revisão em out/stills/
```

## Estrutura

| Pasta | O quê |
|---|---|
| `src/Intro.tsx` | composição: ordem das cenas, áudio, pistas de efeitos sonoros |
| `src/scenes/` | as 6 cenas (S1 zona de disparos → S7 até onde protege) |
| `src/components/` | papel, granulação, traço desenhado, recortes de foto, fitas, Lottie |
| `src/lottie/` | ícones Lottie gerados por `scripts/build-lottie.mjs` |
| `src/data/mexico.ts` | contorno do México gerado por `scripts/build-map.mjs` |
| `public/img/` | fotos reais recortadas (créditos em [CREDITS.md](CREDITS.md)) |
| `public/music/` | trilha de fundo (Magnific · Lyria 3 Pro) |
| `public/sfx/` | efeitos sonoros (Magnific · ElevenLabs SFX) |

GSAP entra via `@remotion/gsap` (timeline pausada, guiada pelo frame) na cena de montagem
(`S4Build`: a blindagem cai sobre o chassi, o carimbo e o zoom na arma) e como biblioteca de
easings em todo o projeto (`src/lib/anim.ts`).
