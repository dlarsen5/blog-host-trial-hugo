---
title: "TEST: tide pools on a toy grid"
date: 2026-11-04
description: "Synthetic TEST post for a blog hosting trial. Not a real article."
tags:
  - test
  - hosting-trial
aliases:
  - hosting trial test post
---

**TEST POST.** Everything on this page is synthetic. It exists only to compare how blog hosts render the same Obsidian note. The companion page is [[books|Finished books]].

## A toy tide model

Picture a strip of rock divided into eight cells. Each cell has a height, and the sea level rises and falls on a fixed cycle. A cell is a *pool* when the water has drained from it but the cells on both sides still hold water higher than the cell itself. None of this describes a real place.

| cell | height (cm) | pool at low tide |
| --- | ---: | :---: |
| a | 12 | no |
| b | 4 | yes |
| c | 9 | no |
| d | 3 | yes |

The rule in code:

```python
def pools(heights, sea):
    """Return the indexes of cells that hold water after the sea drops to `sea`."""
    return [
        i for i in range(1, len(heights) - 1)
        if heights[i] < min(heights[i - 1], heights[i + 1]) and heights[i] > sea
    ]
```

> [!note] Synthetic data
> The heights above are made up for this TEST page. The model ignores waves, rain and evaporation[^1].

## Inline image

A 1-bit ordered-dither interference pattern, generated for this test:

![[trial-dither.png]]

## Inline video

Four seconds of Conway's Game of Life, generated with ffmpeg for this test:

![[trial-clip.mp4]]

## What this page checks

- the [[books|books page]] wikilink resolves
- the callout above renders as a box, not as a quote with `[!note]` in it
- the footnote below links both ways
- the frontmatter title, date, tags and description show up, and the frontmatter itself does not

[^1]: A real tide pool model would need all three. This one is only here to give the table and the code block something to say.
