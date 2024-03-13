---
title: "How I Made a Game in Fyrox"
date: "2024-03-13"
description: "This article gives an overview of the development process of Fish Folly game."
categories: 
- General
meta:
  - property: og:title
    content: How I Made a Game in Fyrox
  - property: og:description
    content: This article gives an overview of the development process of Fish Folly game.
  - property: og:type
    content: article
  - property: og:url
    content: https://fyrox.rs/blog/post/how-i-made-a-game-in-fyrox/
  - property: og:image
    content: https://fyrox.rs/assets/fish-folly/fish.gif
---

This article shows the overview of the development process of the [Fish Folly](https://github.com/mrDIMAS/FishFolly) 
game using Fyrox Game Engine. It does not go into development details very deeply, though. The current state of the game is 
something like this:

<YtVideo url="https://www.youtube.com/embed/mxcSnWft0gQ" />

## Idea and Assets

The idea of the game was proposed by [@erlend](https://github.com/erlend-sh) back in the April 2022 and it should be a FallGuys-like 3D 
platformer with multiplayer support. I started working on it in May 2022. At first we thought about the visual style of the game 
and decided it to be close to Fish Games series. Erlend purchased a 3D model for the main character:

![fish](/assets/fish-folly/fish.gif)

The next part was to find a good set of tiles for the game levels, and we found an awesome pack of tiles and various 3D models for
the environment by Quaternius ([Ultimate Platformer Pack](https://quaternius.itch.io/ultimate-platformer-pack)). It fits nicely in the
visual style of the game.

## Development

After these preparation steps were done, I started coding the game. The plan was to make an MVP in a few months, but... the universe had
other plans. As you may noticed already, the development of MVP took almost 2 years. This mostly because I'm the lead developer of 
Fyrox and when I see something missing or broken in the engine, I usually go and add/fix stuff. And don't forget that I had a full
time job back in the day, so it was hard-mode development difficulty from the beginning. The first version of the game with 
minimal functionality was done in a few weeks. It was a simple character controller, with a simple map and a few bots running into
nowhere:

<YtVideo url="https://www.youtube.com/embed/DrugAFKi-GQ" />

https://www.youtube.com/watch?v=YRE5g57aZEg

By the end of the June 2022, [@Hyeve](https://github.com/Hyeve-jrs) made a cool map using Quaternius tile set:

![fish](/assets/fish-folly/map.png)

This map was tweaked by me in the final version of the game, the most part of it remained unchanged, I just added more traps, cannons,
spikes, etc. In the beginning of the July 2022 I've added a simple AI to the game:

<YtVideo url="https://www.youtube.com/embed/YRE5g57aZEg" />

It was dead-simple - bots run on navmesh straight to target, jumping when they see a gap in front of them (more on that later). It was 
kinda working, but the chances of finishing a map by any bot was very low. The navmesh was "drawn" by hand:

![navmesh](/assets/fish-folly/navmesh.webp)

Since the game is FallGuys-like, there was a key part that is still missing - ragdoll physics for characters. This took me a lot of 
effort to add it to the game, since I never did it previously:

<YtVideo url="https://www.youtube.com/embed/RuoLInE34dM" />

It is kinda buggy, but sorta works. Looking ahead, it is worth to mention that this ragdoll physics was one the trickiest part of the
entire game to make working properly. Ragdoll principle is very easy at first glance, but it requires a lof of manual work for fine 
tuning. In general, ragdolls are just a set of rigid bodies linked with joints with various constraints (you can read more 
[here](https://fyrox-book.github.io/physics/ragdoll.html)). I even added a special Ragdoll Wizard to the engine (you can see it in action 
[here](https://www.youtube.com/watch?v=TxSlqGhCxYc)). After the initial ragdoll support was added, I switched back to the engine development and 
released four (!) versions of the engine (you can find blog posts [here](https://fyrox.rs/blog/)). As you can see, the entire 2023 was
dedicated to the engine development and the game development was on-hold. 

In January 2024, I decided to continue the development, just to have at least some project on the engine more or less finished. I started
by improving the player's control, improved ragdoll physics a lot and made a [Web-version](https://fyrox.rs/assets/demo/fish_folly/index.html) 
of the game. You can still play it, but it is very outdated by now. Unfortunately, the latest version cannot be run in a web-browser,
because it uses standard TCP sockets for networking. 

At this time the game still didn't have a multiplayer support. By that time, I had very little expertise in making multiplayer games.
I talked with people, read some articles and decided to implement client-server architecture with listen-server approach. Transformation
of the game to client-server architecture was quite painful. There was a lot of trial and error before I found the right way of doing 
things. 

At first, I separated game code into two parts - server and client sides. Server side does the heavy lifting - it runs the entire
game logic, simulates physics, sending messages to the clients, etc. Client side on the other hand is very lightweight, it can be considered
as a simple "player" for commands that comes from the server. It just sets positions and rotations for scene nodes, controls sound sources... 
and that's pretty much it. 

The first version of the multiplayer support was finished by the end of January 2024 - and it looked like this:

<YtVideo url="https://www.youtube.com/embed/b8Fs9fF6AJ8" />

As you can see, at this time I also made a simple UI. This UI was made in the new UI editor, that was implemented not so long ago. Since
this point in time the development was quite rapid. The entire February and the beginning of March 2024 was spent on adding missing game 
features. I added leaderboard, improved bots AI, added more traps, added award scene, added sounds and music, fixed a lot of bugs. 

Bots AI was probably the second non-trivial part of the development. Bots are using navigational mesh of the level to build paths to target.
Since the path contains a lot of gaps and traps, some avoidance algorithm should be added. I ended up with something like this:

![bots ai](/assets/fish-folly/bots_ai.png)

The three vertical lines in front of the bots are ground probes, that checks if there's a gap that can jumped over. It is based on simple
raycasting. The green box is used to determine if there's a trap in front of the bot. If the bot "sees" the trap, it just goes backwards. 
It works kinda ok with rotating traps, but not for stationary spikes.

## Conclusion

The development of this game was a lot of fun, I learned a lof of new stuff. If you want to add your map, some game mechanics, sounds, or
anything you want you can do it in the [game's repository](https://github.com/mrDIMAS/FishFolly). This project was made by the effort of
many people, and you can become one of them.