(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{309:function(e,t,n){"use strict";n.r(t);var o=n(15),i=Object(o.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("p",[e._v("Fyrox is a Rust game engine with lots of out-of-box game-ready features and a full-featured editor. Second\nweek of November is full of significant changes.")]),e._v(" "),t("h2",{attrs:{id:"animation-system-rework"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#animation-system-rework"}},[e._v("#")]),e._v(" Animation System Rework")]),e._v(" "),t("p",[e._v("The most significant event of this week is that animation system of the engine is being reworked. So what's\nwrong with the animation system of the engine so it needs to be reworked? The core of it is fine, however the\nfact that all animations and animation blending state machines (ABSM) lives in their own separate containers\nis adding a lot of headache when managing them.")]),e._v(" "),t("p",[e._v("The next problem is that animations and ABSMs are stored in resources. This complicates relations between scene\nnodes they animate and actual animations. The most significant problem is animation copying. Imagine that you\nhave a character with a bunch of animations and a state machine that blends all these animations to get a final\npose. Right now everything is stored in separate places and to create an animation, you need to create a resource\n(or find one in the internet) and then instantiate it. The instance itself is responsible for actual animation,\nwhile resource is just holding key frames. Now you need to clone your character... and that's where you'll get a\nlot of troubles. At first: you need to copy character nodes, then you need to copy all respective animations\n(remember - they're stored in a  separate container), then you also need to copy the state machine. That's not\nall: next you need to ensure that animation copies works with respective node copies, the same must be done for\nstate machines. As you can see, it is very tedious and error prone.")]),e._v(" "),t("p",[e._v("What's the solution to these problems? Store animations and state machines in respective scene nodes. The engine\nnow has two new nodes:")]),e._v(" "),t("ul",[t("li",[t("code",[e._v("AnimationPlayer")]),e._v(" - this node is a container for animations, it can play the animations it contains and apply\nthem to a scene graph.")]),e._v(" "),t("li",[t("code",[e._v("AnimationBlendingStateMachine")]),e._v(" - this node is a container for a state machine that is used to blend multiple\nanimation into one. It uses specified "),t("code",[e._v("AnimationPlayer")]),e._v(" node as a source of animations.")])]),e._v(" "),t("p",[e._v("Now to clone animated character all you need to do is to call "),t("code",[e._v("Graph::copy_node")]),e._v(" and the rest of work will be\ndone for you. The engine will copy "),t("code",[e._v("AnimationPlayer")]),e._v(" and "),t("code",[e._v("AnimationBlendingStateMachine")]),e._v(" nodes, remap handles\nfrom originals to their respective copies. In addition, property inheritance will also work for these nodes,\nwhich will allow you to create a prefab with all nodes and animations prepared and all its instances will sync\ntheir state if the prefab is changed.")]),e._v(" "),t("p",[e._v('This rework is far from completion, it should be done closer to the next release of "This Week in Fyrox".\nStay tuned.')]),e._v(" "),t("h2",{attrs:{id:"animation-blending-state-machine-editor-rework"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#animation-blending-state-machine-editor-rework"}},[e._v("#")]),e._v(" Animation Blending State Machine Editor Rework")]),e._v(" "),t("p",[t("img",{attrs:{src:"/assets/twif2/absm_editor.png",alt:"absm editor"}})]),e._v(" "),t("p",[e._v("Animation blending state machine helps you to combine multiple animations in one and apply it the scene graph.\nThe new approach to animations mentioned in the previous sections requires significant rework of the editor.\nAt first, the editor does not need the previewer - scene previewer will serve for this purpose. Secondly, its\nown inspector is also removed - it is replaced with the standard editor's inspector. Thirdly, menu is removed\ntoo as well as its own command stack.")]),e._v(" "),t("p",[e._v("The more significant changes has to be done in the internals of the editor. Previously, it worked with AbsmResource\nwhich contained specific data that is then used to create animation blending state machine instances. But now\nit works with "),t("code",[e._v("AnimationBlendingStateMachine")]),e._v(" scene nodes which has slightly different internal structure which\nresults in "),t("a",{attrs:{href:"https://github.com/FyroxEngine/Fyrox/pull/398",target:"_blank",rel:"noopener noreferrer"}},[e._v("large amount of changes"),t("OutboundLink")],1),e._v(".")]),e._v(" "),t("h2",{attrs:{id:"animation-editor-progress"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#animation-editor-progress"}},[e._v("#")]),e._v(" Animation Editor Progress")]),e._v(" "),t("p",[t("img",{attrs:{src:"/assets/twif2/animation_editor.png",alt:"animation editor"}})]),e._v(" "),t("p",[e._v("Animation editor has some improvements too. At first - it now uses tree structure to show curves. Secondly, it\nnow has a toolbar that allows you to play/pause and stop an animation, as well as change it playback speed. The\nUI of the animation editor is now disabled if there's no animation selected.")]),e._v(" "),t("p",[e._v("Animation system rework will also change the appearance of the editor, because "),t("code",[e._v("Animation")]),e._v(" resource will be deleted.\nThe editor will work with "),t("code",[e._v("AnimationPlayer")]),e._v(" nodes instead.")]),e._v(" "),t("h2",{attrs:{id:"editor-improvements"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#editor-improvements"}},[e._v("#")]),e._v(" Editor improvements")]),e._v(" "),t("p",[t("img",{attrs:{src:"/assets/twif2/property_selector.png",alt:"property selector"}})]),e._v(" "),t("p",[e._v("PropertySelector widget is used to select properties from any object that implements "),t("code",[e._v("Reflect")]),e._v(' trait. In this week\nit was improved to show types of the properties and be able to restricts types of properties that can be visible.\nAlso it now prevents to select "nothing" - "OK" button is now disabled until a property is selected.')]),e._v(" "),t("h2",{attrs:{id:"full-list-of-changes-in-random-order"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#full-list-of-changes-in-random-order"}},[e._v("#")]),e._v(" Full List of Changes in Random Order")]),e._v(" "),t("ul",[t("li",[e._v("Removed previewer from ABSM editor.")]),e._v(" "),t("li",[e._v("Removed inspector from ABSM editor - now it uses standard editor's inspector to edit ABSM\nentities.")]),e._v(" "),t("li",[t("code",[e._v("AnimationPlayer")]),e._v(" scene node.")]),e._v(" "),t("li",[t("code",[e._v("AnimationBlendingStateMachine")]),e._v(" scene node.")]),e._v(" "),t("li",[e._v("Toolbar for the animation editor.")]),e._v(" "),t("li",[e._v("Save changes made in the curve editor of the animation editor.")]),e._v(" "),t("li",[e._v("Preserve curve and keys ids in the "),t("code",[e._v("CurveEditor")]),e._v(" widget")]),e._v(" "),t("li",[t("code",[e._v("CurveEditor")]),e._v(" now sends synchronization message when new key was added.")]),e._v(" "),t("li",[e._v("Fixed "),t("code",[e._v("TrackFramesContainer::new")]),e._v(" so it generates curves with unique ids all the times.")]),e._v(" "),t("li",[e._v("Add "),t("code",[e._v("name")]),e._v(" and "),t("code",[e._v("id")]),e._v(" parameters for "),t("code",[e._v("Curve")]),e._v(".")]),e._v(" "),t("li",[e._v("Animation editor now shows tracks using Tree widget.")]),e._v(" "),t("li",[e._v("Ability to animate real numbers and Vector2/3/4.")]),e._v(" "),t("li",[e._v("Restricted types that can be animated in the animation editor (allow animating only numeric properties, prevent animating read-only properties).")]),e._v(" "),t("li",[e._v("Type filtering for PropertySelector widget")]),e._v(" "),t("li",[e._v("Added "),t("code",[e._v("Default")]),e._v(", "),t("code",[e._v("Debug")]),e._v(","),t("code",[e._v("Clone")]),e._v(" impls for "),t("code",[e._v("RawMesh")])]),e._v(" "),t("li",[e._v("Updated "),t("code",[e._v("fyrox-template")]),e._v(" to make sure it generates relevant code.")])]),e._v(" "),t("h2",{attrs:{id:"support"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#support"}},[e._v("#")]),e._v(" Support")]),e._v(" "),t("p",[e._v("If you want to support the development of the project, click one of the links below. Preferable way is to use\n"),t("a",{attrs:{href:"https://boosty.to/fyrox",target:"_blank",rel:"noopener noreferrer"}},[e._v("Boosty"),t("OutboundLink")],1),e._v(" - this way the money will be available for the development immediately.\nAlternatively you can can use "),t("a",{attrs:{href:"https://www.patreon.com/mrdimas",target:"_blank",rel:"noopener noreferrer"}},[e._v("Patreon"),t("OutboundLink")],1),e._v(", but in this case the money will\nbe on-hold for unknown period of time ("),t("a",{attrs:{href:"https://github.com/FyroxEngine/Fyrox/issues/363",target:"_blank",rel:"noopener noreferrer"}},[e._v("details are here"),t("OutboundLink")],1),e._v(").")]),e._v(" "),t("p",[e._v("Also, you can help by fixing one of the "),t("a",{attrs:{href:"https://github.com/FyroxEngine/Fyrox/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22",target:"_blank",rel:"noopener noreferrer"}},[e._v('"good first issues" '),t("OutboundLink")],1),e._v(",\nadding a desired feature to the engine, or making a contribution to the "),t("a",{attrs:{href:"https://github.com/fyrox-book",target:"_blank",rel:"noopener noreferrer"}},[e._v("book"),t("OutboundLink")],1)])])}),[],!1,null,null,null);t.default=i.exports}}]);