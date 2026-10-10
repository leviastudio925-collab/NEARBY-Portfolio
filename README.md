# NEARBY — Bring your break with you

A following, height-adjustable tea table for young adults who want effortless downtime at home or in short-stay accommodation.

Tea, a book and a phone travel together from an enclosed balcony to the living room. The user starts following, parks beside the next seat and adjusts the tabletop after stopping.

**Latest version: 2026-10-10** · six boards · 1684 × 595 px · English layout · IBM Plex Sans · warm orange `#F28A2E`.

[Open the latest editable Figma boards](https://www.figma.com/design/ApoghdbZoRBlbBcDctaMXf/Untitled?node-id=383-3293)

## Current portfolio

| Board | Content | Preview |
| --- | --- | --- |
| 01 | Background + Everyday leisure context | [PNG](previews/board-01.png) |
| 02 | Scenario research + Current leisure journey | [PNG](previews/board-02.png) |
| 03 | Concept + Technical research | [PNG](previews/board-03.png) |
| 04 | System + Indoor places | [PNG](previews/board-04.png) |
| 05 | Device + Personal app | [PNG](previews/board-05.png) |
| 06 | Prototype + Leisure scenario | [PNG](previews/board-06.png) |

![Following tea table — prototype and leisure scenario](previews/board-06.png)

[Six-page preview PDF](leisure/NEARBY_Leisure_Portfolio_Preview.pdf) · [中文项目结构](leisure/docs/NEARBY_中文项目结构_休闲茶几.md) · [Sources and visual attribution](leisure/docs/SOURCES.md)

The PDF is a raster preview of the current Figma boards. Figma remains the editable layout source.

## Latest files

- `leisure/models/NEARBY_Leisure_Product.blend`: editable product model, tea-and-reading items, FOLLOW / STAY / HEIGHT controls and product scenes.
- `leisure/assets/`: product renders, AI concept scenes, attributed context photos and the personal leisure map.
- `leisure/docs/`: Chinese project structure, English copy, current Figma board IDs and sources.
- `leisure/scripts/`: model adaptation and rendering source.
- `previews/`: current six-board snapshots.
- `source-demo/`: original prototype presentation and demonstration video.

## Evidence and proposed behavior

The original cabinet, lift assembly and process photographs are retained. The creator reports four A2 motor electric pushrods, a powered wheel base that can follow a person, a camera, local STM32 face recognition and a simple phone interface.

The latest project records select STM32H743 + OV2640 for local face matching. The fixed-ROI matching core has been tested on a PC; board testing remains pending. Identity matching and continuous tracking are separate engineering tasks.

The revised personal app, indoor map, saved parking places, height presets and movement-state rules are interaction proposals. Scene images are AI concept simulations; context photographs illustrate activities, not completed fieldwork. User needs and the current journey are hypotheses derived from the revised brief. No measured movement accuracy, spill stability, load capacity or usability improvements are claimed.

Core proposed sequence: **prepare → FOLLOW → change room → STAY → HEIGHT → resume the break**. Height adjustment takes place while parked. Home mapping and route boundaries have not been presented as an implemented SLAM system. Short-stay use means indoor accommodation, not validated luggage transport or outdoor operation.

## Earlier project versions

The earlier dementia-care direction is retained in Git history and in `archive/care-2026-10-09/`. The legacy root `models/`, `assets/`, `docs/`, `scripts/` and `exports/` belong to that earlier direction. Use `leisure/` and the linked latest Figma boards for current work.

Third-party sources retain their rights. This private portfolio repository does not grant a blanket redistribution license.
