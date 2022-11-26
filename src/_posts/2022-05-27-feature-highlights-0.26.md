---
title: "Fyrox 0.26 Feature Highlights"
date: "2022-05-12"
description: "Fyrox 0.26 is a small release that fixes few very annoying bugs and adds missing functionality."
categories: 
- General
---

Fyrox 0.26 is a small release that fixes few very annoying bugs and adds missing functionality. The list of changes
is somewhat small, but the bugs it fixes are huge.

- Added project template generator - it generates a workspace with three projects `game`, `editor`, `executor` and 
fills it with required boilerplate code.
- Fixed invisible selected item in drop-down list widget.
- Correctly sync node names in `World Viewer`
- Reset editor's camera projection mode switch when creating new scene
- Fixed doubling scene entities in `World Viewer` when loading scene via `StartupData`
- More logging for renderer
- Fixed shader cache - now the engine won't re-compile shaders each 20 seconds.
- Temporarily disable `Lifetime` property editing because it causes crashes
- Do not show `dirty` flag of `Transform` in the `Inspector`
- Provide access to property editors container for editor's `Inspector` - it is now possible
to register your own property editors
- Fixed panic when syncing `Inspector` for an entity with `Option<Texture>` field.
- Added `handle_object_property_changed` and `handle_collection_property_changed` macros to reduce 
boilerplate code in script property handling.
- Added ability to restore resource handles for scripts
- Fixed selection visualization in `Asset Browser`
- Validation for sky box cube map generator