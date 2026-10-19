# Créditos de imagem

Fotos usadas como recortes (fundo removido localmente com IS-Net, convertidas para P&B,
borda de papel adicionada). Cole estes créditos na descrição do vídeo:

- **DN-XI** — "DN-XI armored personnel carrier.jpg", foto de **Jesus2138**, Wikimedia Commons,
  licença CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:DN-XI_armored_personnel_carrier.jpg
- **Chassi comercial (Ford F-550)** — "2019 Ford F-550 4WD, front right (NY).jpg", foto de
  **Mr.choppers**, Wikimedia Commons, licença CC BY-SA 3.0 (caçamba removida, imagem espelhada) —
  https://commons.wikimedia.org/wiki/File:2019_Ford_F-550_4WD,_front_right_(NY).jpg
- **Soldado** — "Soldado mexicano, portando un Mk 19.jpg", foto de **IBERZA**, Wikimedia Commons,
  licença CC BY-SA 4.0 (recortado) — https://commons.wikimedia.org/wiki/File:Soldado_mexicano,_portando_un_Mk_19.jpg

- **Oshkosh Sandcat** — "Oshkosh SandCat side.jpg", foto de **Anachrone**, Wikimedia Commons,
  domínio público — https://commons.wikimedia.org/wiki/File:Oshkosh_SandCat_side.jpg
- **Metralhadora calibre .50 (M2)** — "M2 Browning Machine Gun in Givatayim, Israel.jpg", foto de
  **avishai teicher**, Wikimedia Commons, domínio público —
  https://commons.wikimedia.org/wiki/File:M2_Browning_Machine_Gun_in_Givatayim,_Israel.jpg
- **Lança-granadas de 40 mm (Mk 19)** — "MK19-02.jpg", governo dos EUA, Wikimedia Commons,
  domínio público — https://commons.wikimedia.org/wiki/File:MK19-02.jpg

Mapa: Natural Earth (domínio público), via `world-atlas`.

## Áudio

- **Trilhas de fundo** (`public/music/*.mp3`) — geradas no Magnific com Google Lyria 3 Pro.
  Intro: trecho de 59,35 s a 90,35 s da primeira faixa; Parte 1 usa o começo dessa mesma faixa;
  Partes 2, 3, 4 e Final têm faixas próprias, cortadas e niveladas (loudnorm -16 LUFS).
- **Efeitos sonoros** (`public/sfx/*.wav`) — gerados no Magnific (ElevenLabs SFX): papel,
  whoosh, disparo, impacto em blindagem, baque metálico, carimbo e pop. Normalizados a -1 dBFS.

As licenças CC BY-SA pedem que obras derivadas sejam compartilhadas sob a mesma licença.

## Como as fotos foram processadas

```bash
python -I scripts/cutout.py isnet-general-use.onnx dnxi.jpg dnxi_cut.png 60 120 1000 700
python -I scripts/cutout.py isnet-general-use.onnx f550.jpg f550_cut.png 20 55 948 560 0.55 0.85
python -I scripts/clean_chassis.py f550_cut.png f550_clean.png
python -I scripts/cutout.py isnet-general-use.onnx soldier.jpg soldier_cut.png 495 0 853 462 0.5 0.85
python -I scripts/finish_cutout.py <recorte>.png public/img/<nome>.png 7
```
