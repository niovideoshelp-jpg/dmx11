# DMX11 — Intro do DN-XI (Remotion)

Motion graphics em estilo documental (papel envelhecido, grade milimetrada, recortes de foto em P&B,
um único acento amarelo) para a narração em espanhol sobre o DN-XI, em seis partes:

| Composição | Narração | Duração |
|---|---|---|
| `Intro` | `public/audio/intro.mp3` | 31 s |
| `Parte1` | `public/audio/parte1.mp3` — origem do programa (2011–2013, DGIM, Sandcat) | 74 s |
| `Parte2` | `public/audio/parte2.mp3` — chassi Ford F-550 e o que se faz no México | 80 s |
| `Parte3` | `public/audio/parte3.mp3` — peso, ficha técnica, placas parafusadas, run flat | 77 s |
| `Parte4` | `public/audio/parte4.mp3` — blindagem declarada, armamento, SARAF Balam | 154 s |
| `Final` | `public/audio/final.mp3` — investimento, cifras, méritos e limites, DN-XIII | 132 s |
| `Completo` | todas em sequência | ~9 min |

1920×1080 · 30 fps. Roteiro do intro em [STORYBOARD.md](STORYBOARD.md).

## Editar na nuvem

- **Codespaces**: botão *Code → Codespaces → Create codespace on main*. O container instala tudo
  sozinho; depois rode `npm run dev` e abra a porta 3000 (Remotion Studio).
- **Render na nuvem**: todo push na `main` dispara *Actions → Render video*, que renderiza as seis
  partes em paralelo e depois junta tudo em `DN-XI-completo.mp4`. Cada parte e o filme completo
  ficam como artefatos da execução (Actions → execução → *Artifacts*).
  Para renderizar sem efeitos sonoros: *Run workflow* com `sfx = false`. O volume da trilha e de
  cada efeito fica em `src/Intro.tsx` (`musicVolume`, `CUES`).

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
| `src/Intro.tsx`, `src/parts/` | as composições: cenas (beats) sincronizadas por segundo da narração, trilha e efeitos |
| `src/kit/` | blocos reutilizáveis: cartão de fonte, nome, número, linha do tempo, pictogramas, carimbo, balança, mostrador, mapa, ícones |
| `src/scenes/` | as cenas do intro |
| `src/components/` | papel, granulação, traço desenhado, recortes de foto, fitas, Lottie |
| `src/lottie/` | ícones Lottie gerados por `scripts/build-lottie.mjs` |
| `src/data/mexico.ts` | contorno do México gerado por `scripts/build-map.mjs` |
| `public/img/` | fotos reais recortadas (créditos em [CREDITS.md](CREDITS.md)) |
| `public/music/` | trilha de fundo (Magnific · Lyria 3 Pro) |
| `public/sfx/` | efeitos sonoros (Magnific · ElevenLabs SFX) |

GSAP entra via `@remotion/gsap` (timeline pausada, guiada pelo frame) na cena de montagem
(`S4Build`: a blindagem cai sobre o chassi, o carimbo e o zoom na arma) e como biblioteca de
easings em todo o projeto (`src/lib/anim.ts`).
