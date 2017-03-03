﻿﻿// # Quintus platformer example
//
// [Run the example](../quintus/examples/platformer/index.html)
// WARNING: this game must be run from a non-file:// url
// as it loads a zone json file.
//
// This is the example from the website homepage, it consists
// a simple, non-animated platformer with some enemies and a 
// target for the player.
window.addEventListener("load",function() {

// Set up an instance of the Quintus engine  and include
// the Sprites, Scenes, Input and 2D module. The 2D module
// includes the `TileLayer` class as well as the `2d` component.
var Q = window.Q = Quintus({audioSupported: [ 'wav','mp3','ogg' ]})
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        // Maximize this game to whatever the size of the browser is
        .setup({ maximize: true })
        // And turn on default input controls and touch input (for UI)
        .controls(true).touch()
        // Enable sounds.
        .enableSound();
        
       Q.input.joypadControls();


// Load and init audio files.

var x1; //co-ordinate of which zone
var y1; //co-ordianate of which zone
var score;
var strength = 100;
var i = 0;
var t = 0;
var n = 0
var q = 0;
text = "";
var pass;
var swimGear;
var lavaBoots;
var jumpingBoots;
var flyBot;
var spaceBot;
var multiplier2;
var multiplier20;
var multiplier200;
var invincible;
var float;
var slow;
var giftRandom;
var blueKey;
var previousScoreToCompare;
var fall;
var horizontalMonsterResistance;



Q.SPRITE_PLAYER = 1;
Q.SPRITE_COLLECTABLE = 2;
Q.SPRITE_ENEMY = 4;
Q.SPRITE_DOOR = 8;
Q.Sprite.extend("Player",{

  init: function(p)
 {

    this._super(p,
   {
      sheet: "player",  // Setting a sprite sheet sets sprite width and height
      sprite: "player",
      direction: "right",
      standingPoints: [ [ -4, 22], [ -11, 17 ], [-11,-24], [11,-24], [11, 17 ], [ 8, 22 ]],
      duckingPoints : [ [ -8, 22], [ -11, 17 ], [-11,-5], [11,-5], [11, 17 ], [ 8, 22 ]],
      jumpSpeed: -550,
      speed: 300,
      strength: 100,
      type: Q.SPRITE_PLAYER,
      collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_DOOR | Q.SPRITE_COLLECTABLE
    });

    this.p.points = this.p.standingPoints;
    this.add('2d, platformerControls, animation, tween');
    

    this.on("bump.top","breakTile");

    this.on("sensor.tile","checkLadder");
    this.on("enemy.hit","enemyHit");
    this.on("jump");
    this.on("jumped");

    Q.input.on("down",this,"checkDoor");
  },

  jump: function(obj)
 {
    // Only play sound once.
    if (!obj.p.playedJump)
  {
      Q.audio.play('jump.wav');
      obj.p.playedJump = true;
    }
  },

  jumped: function(obj)
  {

    obj.p.playedJump = false;
  },

  checkLadder: function(colObj) 
  {
    if(colObj.p.ladder) 
    { 
      this.p.onLadder = true;
      this.p.ladderX = colObj.p.x;

    }
  },

  checkDoor: function()
  {
    this.p.checkDoor = true;
  },

  resetZone: function()
  {
        score = 0;
        strength = 100;
        this.animate({opacity: 1});
        Q.stageScene('hud', 3, this.p);
  },

  enemyHit: function(data) 
  {
    var col = data.col;
    var enemy = data.enemy;
    this.p.vy = -150;
    if (col.normalX == 1)
    {
      // Hit from left.
      this.p.x -=15;
      this.p.y -=15;
    }
    else 
    {
      // Hit from right;
      this.p.x +=15;
      this.p.y -=15;
    }
    this.p.immune = true;
    this.p.immuneTimer = 0;
    this.p.immuneOpacity = 1;
    strength -= 25;
    
    Q.stageScene('hud', 3, this.p);
    if (strength <= 0 ) 
    {
       strength = 0;
       Q.stageScene("endGame",1, { label: "You passed away!" }); 
       this.destroy();
       this.resetZone();
    }

  },

  continueOverSensor: function() 
 {
    this.p.vy = 0;
    if(this.p.vx != 0) {
      this.play("walk_" + this.p.direction);
    } else {
      this.play("stand_" + this.p.direction);
    }
  },




  breakTile: function(col) 
  {
    if(col.obj.isA("TileLayer")) 
    {
      
     if (col.tile == 1 || col.tile == 8|| col.tile == 16 || col.tile == 24)
     {
         col.obj.setTile(col.tileX, col.tileY, 2);
         score += 25;
         Q.stageScene('hud', 3, this.p);
     }
   
     if(col.tile == 32 || col.tile == 40|| col.tile == 48|| col.tile == 56)
     {
         col.obj.setTile(col.tileX, col.tileY, 3);
         score  -= 50;
        if (score < 0)
        {
             score = 0;
        }
         Q.stageScene('hud', 3, this.p);
     }

     


     if (col.tile == 184)
     {

          if ((x1 == 4 &&  y1 == 1 && pass == true) || (x1 == 9 && y1 == 1))
          {
             x1 += 1;
             Q.audio.stop();
             Q.audio.play('onyva.wav', {loop: false});
             Q.stageScene("endGame",1, { label: "Welcome aboard the \n Montreal metro!" }); 
             this.destroy();
             Q.stageScene('hud', 3, this.p);
          }

          else if (x1 == 4 &&  y1 == 1 && pass == false)
          {
             Q.stageScene("message",1, { label: "Transport pass \nrequired!" }); 
             Q.stageScene('hud', 3, this.p);
          }

          else if (x1 == 7 &&  y1 == 1 && lavaBoots == true)
          {
             x1 += 1;
             Q.stageScene("endGame",1, { label: "Geothermal molten \n lava!" }); 
             this.destroy();
             Q.stageScene('hud', 3, this.p);
          }

          else if (x1 == 7 &&  y1 == 1 && lavaBoots == false)
          {
             Q.stageScene("message",1, { label: "Lava boots \nmandatory!" }); 
             Q.stageScene('hud', 3, this.p);
          }

          else if (x1 == 12 &&  y1 == 0 && jumpingBoots== true)
          {
             x1 += 1;
             Q.stageScene("endGame",1, { label: "Icy Ville Glacé \n de Montreal!" }); 
             this.destroy();
             Q.stageScene('hud', 3, this.p);
          }

          else if (x1 == 12 &&  y1 == 0 && jumpingBoots == false)
          {
             Q.stageScene("message",1, { label: "Jumping boots\n mandatory!" }); 
             Q.stageScene('hud', 3, this.p);
          }


          else
          {
             x1 += 1;
             Q.stageScene("endGame",1, { label: "Heading east..." }); 
             this.destroy();
             Q.stageScene('hud', 3, this.p);
          }
          
     }

     if (col.tile == 192)
     {
          x1 -= 1;
          Q.stageScene("endGame",1, { label: "Heading West..." }); 
          this.destroy();
          Q.stageScene('hud', 3, this.p);
     }

     if (col.tile == 200)
     {
          if (x1 == 8 &&  y1 == 2 && swimGear == true)
          {
             x1 += 1;
             y1 -= 1;
             Q.stageScene("endGame",1, { label: "Leaving the\n  molten mine!" }); 
             this.destroy();
             Q.stageScene('hud', 3, this.p);
          }

          else if (x1 == 8 &&  y1 == 2 && swimGear == false)
          {
             Q.stageScene("message",1, { label: "You need the \n swim gear!" }); 
             Q.stageScene('hud', 3, this.p);
          }

          else
          {
             y1 -= 1;
             Q.stageScene("endGame",1, { label: "Climbing Up..." }); 
             this.destroy();
             Q.stageScene('hud', 3, this.p);
          }
     }

     if (col.tile == 208)
     {
             y1 += 1;
             Q.stageScene("endGame",1, { label: "Climbing Down..." }); 
             this.destroy();
             Q.stageScene('hud', 3, this.p);
     }

     if (col.tile == 216)
     {
             pass = true;
             Q.stageScene("message",1, { label: "Transport Pass \n found!" }); 
             col.obj.setTile(col.tileX, col.tileY, 10);
     }

     if (col.tile == 224)
     {
             swimGear = true;
             Q.stageScene("message",1, { label: "Swim gear found! " }); 
             col.obj.setTile(col.tileX, col.tileY, 10);
     }

     if (col.tile == 232)
     {
             lavaBoots = true;
             Q.stageScene("message",1, { label: "Lava boots found!" }); 
             col.obj.setTile(col.tileX, col.tileY, 10);
     }

     if (col.tile == 240)
     {
             jumpingBoots = true;
             Q.stageScene("message",1, { label: "High jumpers found!" }); 
             col.obj.setTile(col.tileX, col.tileY, 10);
     }

     if (col.tile == 248)
     {
             flyBot = true;
             Q.stageScene("message",1, { label: "Rising above the \n worlds!" }); 
             col.obj.setTile(col.tileX, col.tileY, 10);
             Q.gravityY = -0.05*100;
             if (this.p.vy < -600)
             {
                this.p.vy = -600;
             }
     }

     if (col.tile == 288)
     {
             spaceBot = true;
             Q.stageScene("message",1, { label: "You now can \n roll in tight \n spaces!" }); 
             col.obj.setTile(col.tileX, col.tileY, 10);
     }

     if (col.tile == 256)
     {
            i +=1
            if (x1 == 1)
           {
              if (y1 == 1)
             {
                  if(i == 1)
                 {
                     text = "Hi Mark, I\'m Italo Dubois";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 2)
                 {
                     text = "Each zone typically \n has a: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 3)
                 {
                     text = "Q block for \n questions";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 4)
                 {
                     text = "N block for \n nice goodies.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 5)
                 {
                     text = "That is L\'île Apprentissage.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 6)
                 {
                     text = "Jump repeatedly.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 7)
                 {
                     text = "Messages will loop.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 8)
                 {
                     text = "Sometimes, you \n will find I blocks \n for Info.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 9)
                 {
                     text = "N blocks are \n nice goodies. \n This can be \n answers or jokes.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 10)
                 {
                     text = "T blocks are Tutorials";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 11)
                 {
                     text = "Learn by playing...";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 12)
                 {
                     text = "Play through zones \n and hidden areas.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 13)
                 {
                     text = "That\'s my mansion.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 14)
                 {
                     text = "Look around...";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 15)
                 {
                     text = "Meet Chantal Dubois, \n my fictitious doll-bot \n and wife \n";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 15)
                 {
                     text = "She'\s possibly around...";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 16)
                 {
                     text = "A picture of my \n doll \n is in one of \n the last levels \n in a pink room. \n We had a baby \n girl.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 17)
                 {
                     text = "She comes around \n to fill in N blocks \n with answers to \n questions or \n cracks jokes.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 18)
                 {
                     text = "You will find \n two health potions \n there.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 19)
                 {
                     text = "Bump other blocks \n to obtain \n walk-through equipment, \n improve health, \n gamble, \n or obtain potions \n or gifts.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 20)
                 {
                     text = "Watch for monsters \n. like rail car bots, \n spikes, \n red spiders, \n and metro bots!";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(i == 21)
                 {
                     text = "Credits to Maxime \n Groulx, a 10-year-old \n creative brilliant who \n designed the level \n 5 pitfall packed with \n goodies!";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Click \'k\' button \n to exit.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   i = 0;
               }
             }
           }

            else if (x1 == 2)
           {
              if (y1 == 1)
             {
                  if(i == 1) { text = "Welcome to the \n Montreal General \n Cemetary";}
                  else if(i == 2) { text = "Avoid walking on \n the ground"; }
                  else
                 {
                      text = "Click \'k\' button \n to exit.";
                     i = 0;
                 }
                 Q.stageScene("message",1, { label: "" + text + "" }); 
              }
           }

           else if (x1 == 6)
           {
              if (y1 == 1)
             {
                  if(i == 1) { text = "Risk \n equals \n Reward";}
                  else if(i == 2) { text = "Can you make \n it? \n We passed \n de la Savane \n metro on orange \n line."; }
                  else
                 {
                      text = "Click \'k\' button \n to exit.";
                     i = 0;
                 }
                Q.stageScene("message",1, { label: "" + text + "" }); 
              }
           }

           else if (x1 == 7)
           {
              if (y1 == 1)
             {
                  if(i == 1) { text = "You discovered a \n great treasure!";}
                  else if(i == 2) { text = "There is an \n  item treasure too! \n Also, watch for \n hidden pits."; }
                  else
                 {
                      text = "Click \'k\' button \n to exit."; 
                      i = 0;
                 }
                 Q.stageScene("message",1, { label: "" + text + "" });
              }
           }

           else if (x1 == 8)
           {
              if (y1 == 1)
             {
                  if(i == 1) { text = "Oh my shylo! \n It\'s sooo scary...";}
                  else if(i == 2) { text = "And hot.....\n I see a lava boots \n safe with 7 \n spare boots."; }
                  else
                 {
                      text = "Click \'k\' button \n to exit. \n Watch for snails \n in the way!";
                     i = 0;
                 }
                Q.stageScene("message",1, { label: "" + text + "" }); 
              }
              else if (y1 == 2)
             {
                  if(i == 1) { text = "WOOOOW!!!!!! \n Lets get back \n up!";}
                  else if(i == 2) { text = "Italo: Don\'t panic. \n Stay close to \n ladders!"; }
                  else
                 {
                      text = "Click \'k\' button \n to exit."; 
                      i = 0;
                 }
              Q.stageScene("message",1, { label: "" + text + "" });
              }
              else {}
           }

           else if (x1 == 10)
           {
              if (y1 == 0)
             {
                  if(i == 1) { text = "We passed the \n lave mine.";}
                  else if(i == 2) { text = "Now the cold \n frigid water?"; }
                 else
                 {
                      text = "Click \'k\' button \n to exit."; 
                     i = 0;
                 }
                 Q.stageScene("message",1, { label: "" + text + "" }); 
              }

              else if (y1 == 1)
             {
                  if(i == 1) { text = "Some kind of \n money artist \n the blue line?";}
                  else if(i == 2) { text = "Looks like metro Outremont."; }
                  else
                 {
                      text = "Click \'k\' button \n to exit.";  
                     i = 0;
                 }
                Q.stageScene("message",1, { label: "" + text + "" }); 
              }
             else {}
           }

           else if (x1 == 11)
           {
              if (y1 == 0)
             {
                  if(i == 1) { text = "Another money \n exhibition filled \n with honey! Haha";}
                  else if(i == 2) { text = "Maybe I should \n spare some stealth \n for the looks!"; }
                  else
                 {
                      text = "Click \'k\' button \n to exit.";   
                     i = 0;
                 }
                Q.stageScene("message",1, { label: "" + text + "" });
              }
           }

           else if (x1 == 12)
           {
              if (y1 == 0)
             {
                  if(i == 1) { text = "Italo: It\'s extremely slippery!";}
                  else if(i == 2) { text = "Watch the pits."; }
                  else
                 {
                      text = "Click \'k\' button \n to exit.";  
                     i = 0;
                 }
                 Q.stageScene("message",1, { label: "" + text + "" });
              }
           }

           else if (x1 == 14)
           {
              if (y1 == 0)
             {
                  if(i == 1) { text = "Seems like a \n tower forest!";}
                  else if(i == 2) { text = "Maybe I will fly!"; }
                  else
                 {
                      text = "Click \'k\' button \n to exit.";  
                     i = 0;
                 }
                 Q.stageScene("message",1, { label: "" + text + "" });
              }
           }

           else if (x1 == 15)
           {
              if (y1 == 0)
             {
                  if(i == 1) { text = "Italo: Are you ready \n for a new \n experience?";}
                  else if(i == 2) { text = "The flybot as \n at the far \n right. Get \n as many items \n as you can. \n Become a millionaire \n with multipliers! \n Good luck!."; }
                  else
                 {
                      text = "Click \'k\' button \n to exit.";  
                     i = 0;
                 }
                 Q.stageScene("message",1, { label: "" + text + "" });
              }
           }

           else
           {
           }
           
     }


    if (col.tile == 280)
     {
            q +=1
            if (x1 == 1)
           {
              if (y1 == 1)
             {
                  if(q == 1)
                 {
                     text = "Congugez: \n Verb to BE, \'être\', \n Présent indicatif is: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb to BE, \n Passé composé is: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }

           }

            else if (x1 == 2)
           {
              if (y1 == 1)
             {
                  if(q == 1)
                 {
                     text = "Verb to BE, \n Imparfait: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb to BE, \n Plus-que-parfait: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }

           }

            else if (x1 == 3)
           {
              if (y1 == 1)
             {
                  if(q == 1)
                 {
                     text = "Verb to BE, \n Passé simple: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb to BE, \n Passé antérieur: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }

           }

            else if (x1 == 4)
           {
              if (y1 == 1)
             {
                  if(q == 1)
                 {
                     text = "Verb to BE, \n Futur simple: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb to BE, \n Futur antérieur: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }

           }

            else if (x1 == 5)
           {
              if (y1 == 1)
             {
                  if(q == 1)
                 {
                     text = "Verb to HAVE, \'avoir\', \n Présent indicatif: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb to HAVE, \n Passé composé: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }

           }

            else if (x1 == 6)
           {
              if (y1 == 1)
             {
                  if(q == 1)
                 {
                     text = "Verb to HAVE, \'avoir\', \n Imparfait: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb to HAVE, \n Plus-que-parfait: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }

           }

            else if (x1 == 7)
           {
              if (y1 == 1)
             {
                  if(q == 1)
                 {
                     text = "Verb to HAVE, \'avoir\', \n Passé simple: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb to HAVE, \n Passé antérieur: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }

           }

            else if (x1 == 8)
           {
              if (y1 == 1)
             {
                  if(q == 1)
                 {
                     text = "Verb to HAVE, \'avoir\', \n Futur simple: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb to HAVE, \n Futur antérieur: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }

              else if (y1 == 2)
             {
                  if(q == 1)
                 {
                     text = "Verb CAN, \'pouvoir\', \n Présent Indicatif: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb CAN, \n : Passé composé";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }

              else
             {}

           }

            else if (x1 == 9)
           {
              if (y1 == 1)
             {
                  if(q == 1)
                 {
                     text = "Verb CAN (\'pouvoir\'), \n Imparfait: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb CAN (\'pouvoir\'), \n Plus-que-parfait: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }
           }

            else if (x1 == 10)
           {
              if (y1 == 0)
             {
                  if(q == 1)
                 {
                     text = "Verb CAN, \n Passé simple: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb CAN, \n Passé antérieur: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }

             else  if (y1 == 1)
             {
                  if(q == 1)
                 {
                     text = "Verb CAN, \n Futur simple: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb CAN, \n Futur antérieur: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }
            else {}
           }

            else if (x1 == 11)
           {
              if (y1 == 0)
             {
                  if(q == 1)
                 {
                     text = "Verb to DO, \'faire\', \n Présent indicatif: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb to DO, \n Passé composé: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }
           }

            else if (x1 == 12)
           {
              if (y1 == 0)
             {
                  if(q == 1)
                 {
                     text = "Verb to DO, \'faire\', \n Imparfait: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb to DO, \n Plus-que-parfait: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }
           }

            else if (x1 == 13)
           {
              if (y1 == 0)
             {
                  if(q == 1)
                 {
                     text = "Verb to DO, \'faire\', \n Passé simple: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb to DO, \n Passé antérieur: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }
           }

            else if (x1 == 14)
           {
              if (y1 == 0)
             {
                  if(q == 1)
                 {
                     text = "Verb to DO, \'faire\', \n Futur simple: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Verb to DO, \n Futur anterieur: ";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }
           }

            else if (x1 == 15)
           {
              if (y1 == 0)
             {
                  if(q == 1)
                 {
                     text = "Now you learned \n how to congugate \n verbs to BE, \n to HAVE, CAN, and \n to DO.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(q == 2)
                 {
                     text = "Another app is \n is coming soon \n with 4 new verbs. \n Price: ONLY $0.99";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Good luck!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   q = 0;
               }
             }
           }
           
     }


    if (col.tile == 264)
    {
            t +=1
            if (x1 == 3)
           {
              if (y1 == 1)
             {
                  if(t == 1)
                 {
                     text = "Pay attention to \n exceptions in the \n suffixes.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Remember my hint.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   t = 0;
               }
             }
           }

            else if (x1 == 15)
           {
              if (y1 == 0)
             {
                  if(t == 1)
                 {
                     text = "Place the bot \n on your back. \n Position the harness. \n Your connector links \n and harness should \n not wobble.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(t == 2)
                 {
                     text = "2 - When you land, \n your feet and knees \n must be together.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(t == 3)
                 {
                     text = "3 - Always look at \n horizon and flare. \n You will land \n in another game \n eventually.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Remember my hint.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   t = 0;
               }
             }
           }

   }



    if (col.tile == 272)
     {
            n +=1
            if (x1 == 1)
           {
              if (y1 == 1)
             {
                  if(n == 1)
                 {
                     text = "Verb to BE, \'être\': \n Présent Indicatif\n Je suis \n Tu es \n Il est \n Nous Sommes \n Vous êtes \n Ils sont";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                  else if(n == 2)
                 {
                     text = "Verb to BE, \'être\': \n Passé Composé \n J\'ai été \n Tu as été \n Il a été \n Nous avons été \n Vous avez été \n Ils ont été";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                 }

                else
               {
                    text = "Ta-Dah!.";
                    Q.stageScene("message",1, { label: "" + text + "" }); 
                   n = 0;
               }
             }
           }

            else if (x1 == 2)
           {
              if (y1 == 1)
             {
                  if(n == 1) { text = "Verb to BE, \'être\': \n Imparfait \n j\'étais \n tu étais \n il était \n nous étions \n vous étiez \n ils étaient \n "; }
                  else if(n == 2) { text = "Plus-que-parfait \n j\'avais été \n tu avais été \n il avait été \n nous avions été \n vous aviez été \n ils avaient été \n "; }
                  else { text = "Ta-Dah!."; n = 0;}
                  Q.stageScene("message",1, { label: "" + text + "" }); 
             }
           }

            else if (x1 == 3)
           {
              if (y1 == 1)
             {
                  if(n == 1) { text = "Verb to BE, \'être\': \n Passé simple \n je fus \n tu fus \n il fut \n nous fûmes \n vous fûtes \n ils furent \n "; }
                  else if(n == 2) { text = "Verb to BE, \'être\': \n Passé antérieur \n j\'eus été \n tu eus été \n il eut été \n nous eûmes été \n vous eûtes été \n ils eurent été \n "; }
                  else { text = "Ta-Dah!."; n = 0;}
                  Q.stageScene("message",1, { label: "" + text + "" }); 
             }
           }

            else if (x1 == 4)
           {
              if (y1 == 1)
             {
                  if(n == 1) { text = "Verb to BE, \'être\': \n Futur \n je serai \n tu seras \n il sera \n nous serons \n vous serez \n ils seront \n "; }
                  else if(n == 2) { text = "Futur antérieur \n j\'aurai été \n tu auras été \n il aura été \n nous aurons été \n vous aurez été \n ils auront été \n "; }
                  else { text = "Ta-Dah!."; n = 0;}
                  Q.stageScene("message",1, { label: "" + text + "" }); 
             }
           }

            else if (x1 == 5)
           {
              if (y1 == 1)
             {
                  if(n == 1) { text = "Verb to HAVE, \'avoir\': \n Présent \n j\'ai \n tu as \n il a \n nous avons \n vous avez \n ils ont \n "; }
                  else if(n == 2) { text = "Verb to HAVE, \'avoir\': \n Passé composé \n j\'ai eu \n tu as eu \n il a eu \n nous avons eu \n vous avez eu \n ils ont eu \n "; }
                  else { text = "Ta-Dah!."; n = 0;}
                  Q.stageScene("message",1, { label: "" + text + "" }); 
             }
           }

            else if (x1 == 6)
           {
              if (y1 == 1)
             {
                  if(n == 1) { text = "Verb to HAVE, \'avoir\': \n Imparfait \n j\'avais \n tu avais \n il avait \n nous avions \n vous aviez \n ils avaient \n "; }
                  else if(n == 2) { text = "Verb to HAVE, \'avoir\': \n Plus-que-parfait \n j\'avais eu \n tu avais eu \n il avait eu \n nous avions eu \n vous aviez eu \n ils avaient eu \n "; }
                  else { text = "Ta-Dah!."; n = 0;}
                  Q.stageScene("message",1, { label: "" + text + "" }); 
             }
           }

            else if (x1 == 7)
           {
              if (y1 == 1)
             {
                  if(n == 1) { text = "Verb to HAVE, \'avoir\': \n Passé simple \n j\'eus \n tu eus \n il eut \n nous eûmes \n vous eûtes \n ils eurent \n "; }
                  else if(n == 2) { text = "Verb to HAVE, \'avoir\': \n Passé antérieur \n j\'eus eu \n tu eus eu \n il eut eu \n nous eûmes eu \n vous eûtes eu \n ils eurent eu \n "; }
                  else { text = "Ta-Dah!."; n = 0;}
                  Q.stageScene("message",1, { label: "" + text + "" }); 
             }
           }

            else if (x1 == 8)
           {
              if (y1 == 1)
             {
                  if(n == 1) { text = "Verb to HAVE, \'avoir\': \n Futur \n j\'aurai \n tu auras \n il aura \n nous aurons \n vous aurez \n ils auront \n "; }
                  else if(n == 2) { text = "Verb to HAVE, \'avoir\': \n Futur antérieur \n j\'aurai eu \n tu auras eu \n il aura eu \n nous aurons eu \n vous aurez eu \n ils auront eu \n "; }
                  else { text = "Ta-Dah!."; n = 0;}
                  Q.stageScene("message",1, { label: "" + text + "" }); 
             }
              else if (y1 == 2)
             {
                  if(n == 1) { text = "Verb CAN, \'pouvoir\': \n Présent \n je peux \n tu peux \n il peut \n nous pouvons \n vous pouvez \n ils peuvent \n "; }
                  else if(n == 2) { text = "Verb CAN, \'pouvoir\': \n Passé composé \n j\'ai pu \n tu as pu \n il a pu \n nous avons pu \n vous avez pu \n ils ont pu \n "; }
                  else { text = "Ta-Dah!."; n = 0;}
                  Q.stageScene("message",1, { label: "" + text + "" }); 
             }
             else {}
           }

            else if (x1 == 9)
           {
              if (y1 == 1)
             {
                  if(n == 1) { text = "Verb CAN, \'pouvoir\': \n Imparfait \n je pouvais \n tu pouvais \n il pouvait \n nous pouvions \n vous pouviez \n ils pouvaient \n "; }
                  else if(n == 2) { text = "Verb CAN, \'pouvoir\': \n Plus-que-parfait \n j\'avais pu \n tu avais pu \n il avait pu \n nous avions pu \n vous aviez pu \n ils avaient pu \n "; }
                  else { text = "Ta-Dah!."; n = 0;}
                  Q.stageScene("message",1, { label: "" + text + "" }); 
             }
           }

            else if (x1 == 10)
           {
              if (y1 == 0)
             {
                  if(n == 1) { text = "Verb CAN, \'pouvoir\': \n Passé simple \n je pus \n tu pus \n il put \n nous pûmes \n vous pûtes \n ils purent \n "; }
                  else if(n == 2) { text = "Verb CAN, \'pouvoir\': \n Passé antérieur \n j\'eus pu \n tu eus pu \n il eut pu \n nous eûmes pu \n vous eûtes pu \n ils eurent pu \n "; }
                  else { text = "Ta-Dah!."; n = 0;}
                  Q.stageScene("message",1, { label: "" + text + "" }); 
             }
              else if (y1 == 1)
             {
                  if(n == 1) { text = "Verb CAN, \'pouvoir\': \n Futur \n je pourrai \n tu pourras \n il pourra \n nous pourrons \n vous pourrez \n ils pourront \n "; }
                  else if(n == 2) { text = "Verb CAN, \'pouvoir\': \n Futur antérieur \n j\'aurai pu \n tu auras pu \n il aura pu \n nous aurons pu \n vous aurez pu \n ils auront pu \n "; }
                  else { text = "Ta-Dah!."; n = 0;}
                  Q.stageScene("message",1, { label: "" + text + "" }); 
             }
             else {}
           }

            else if (x1 == 11)
           {
              if (y1 == 0)
             {
                  if(n == 1) { text = "Verb to DO, \'faire\': \n Présent \n je fais \n tu fais \n il fait \n nous faisons \n vous faites \n ils font \n "; }
                  else if(n == 2) { text = "Verb to DO, \'faire\': \n Passé composé \n j\'ai fait \n tu as fait \n il a fait \n nous avons fait \n vous avez fait \n ils ont fait \n "; }
                  else { text = "Ta-Dah!."; n = 0;}
                  Q.stageScene("message",1, { label: "" + text + "" }); 
             }
           }

            else if (x1 == 12)
           {
              if (y1 == 0)
             {
                  if(n == 1) { text = "Verb to DO, \'faire\': \n Imparfait \n je faisais \n tu faisais \n il faisait \n nous faisions \n vous faisiez \n ils faisaient \n "; }
                  else if(n == 2) { text = "Verb to DO, \'faire\': \n Plus-que-parfait \n j\'avais fait \n tu avais fait \n il avait fait \n nous avions fait \n vous aviez fait \n ils avaient fait \n "; }
                  else { text = "Ta-Dah!."; n = 0;}
                  Q.stageScene("message",1, { label: "" + text + "" }); 
             }
           }

            else if (x1 == 13)
           {
              if (y1 == 0)
             {
                  if(n == 1) { text = "Verb to DO, \'faire\': \n Passé simple \n je fis \n tu fis \n il fit \n nous fîmes \n vous fîtes \n ils firent \n "; }
                  else if(n == 2) { text = "Verb to DO, \'faire\': \n Passé antérieur \n j\'eus fait \n tu eus fait \n il eut fait \n nous eûmes fait \n vous eûtes fait \n ils eurent fait \n "; }
                  else { text = "Ta-Dah!."; n = 0;}
                  Q.stageScene("message",1, { label: "" + text + "" }); 
             }
           }

            else if (x1 == 14)
           {
              if (y1 == 0)
             {
                  if(n == 1) { text = "Verb to DO, \'faire\': \n Futur \n je ferai \n tu feras \n il fera \n nous ferons \n vous ferez \n ils feront \n "; }
                  else if(n == 2) { text = "Verb to DO, \'faire\': \n Futur antérieur \n j\'aurai fait \n tu auras fait \n il aura fait \n nous aurons fait \n vous aurez fait \n ils auront fait \n "; }
                  else { text = "Ta-Dah!."; n = 0;}
                  Q.stageScene("message",1, { label: "" + text + "" }); 
             }
           }

           
     }


     
     if (col.tile == 296)
     {
          Q.stageScene("police1",1, { label: "Dégagez la \n circulation S.V.P." }); 
          Q.stageScene('hud', 3, this.p);
          col.obj.setTile(col.tileX,col.tileY, 304);
     }

     if (col.tile == 304)
     {
          Q.stageScene("police2",1, { label: "Dégage." }); 
          Q.stageScene('hud', 3, this.p);
          col.obj.setTile(col.tileX,col.tileY, 312);
     }

     if (col.tile == 312)
     {
          Q.stageScene("police3",1, { label: "DÉGAGE!!!!" }); 
          Q.stageScene('hud', 3, this.p);
          col.obj.setTile(col.tileX,col.tileY, 320);
     }

     if (col.tile == 320)
     {
          Q.stageScene("police4",1, { label: "DÉ-GAGE!!! MOVE!!!!!" }); 
          Q.stageScene('hud', 3, this.p);
          col.obj.setTile(col.tileX,col.tileY, 328);
     }

     if (col.tile == 328)
     {
             x1 ==1;
             y1 == 1;
             Q.stageScene("endGame",1, { label: "ARRESTATION!" }); 
             this.destroy();
             this.resetZone();
     }

     if (col.tile == 336)
     {
          Q.stageScene("fire",1, { label: "Oni\'s Fire \n Department" }); 
          Q.stageScene('hud', 3, this.p);
     }

     if (col.tile == 376)
     {
          Q.stageScene("phone",1, { label: "Phone" }); 
          Q.stageScene('hud', 3, this.p);
     }

     if (col.tile == 656)
     {
          Q.stageScene("message",1, { label: "Hello. \n I\'m a doll bot. \n Where\'s Mommy? Her \n name is \n Chantal Dubois." }); 
     }
    }
    Q.audio.play('tile.wav');
  },

  step: function(dt)
  {
    var processed = false;
    if (this.p.immune) 
   {
      // Swing the sprite opacity between 50 and 100% percent when immune.
      if ((this.p.immuneTimer % 12) == 0)
      {
        var opacity = (this.p.immuneOpacity == 1 ? 0 : 1);
        this.animate({"opacity":opacity}, 0);
        this.p.immuneOpacity = opacity;
      }
      this.p.immuneTimer++;
      if (this.p.immuneTimer > 144) {
        // 3 seconds expired, remove immunity.
        this.p.immune = false;
        this.animate({"opacity": 1}, 1);
      }
    }

    if(this.p.onLadder || float == 1)
   {
      this.p.gravity = 0;

      if(Q.inputs['up']) 
     {
        this.p.vy = -this.p.speed;
        this.p.x = this.p.ladderX;
        this.play("climb");

      }
     else if(Q.inputs['down']) 
     {
        this.p.vy = this.p.speed;
        this.p.x = this.p.ladderX;
        this.play("climb");

     
      } 
     else
      {
        this.continueOverSensor();
      }
      processed = true;
    } 

   if(slow == 1)
   {
      this.p.speed = 100;
   }

    if (x1 == 11 && y1 == 0)
    {
         if (this.p.y > 320)
         {
            this.p.speed = 75;
            Q.gravityY = 0.5*100;
           this.p.jumpSpeed = -400;
         }
        else
        {
          this.p.speed = 300;
          Q.gravityY = 6.8*100;
          this.p.jumpSpeed = -550;
        }
    } 

    if ((x1 == 12 && y1 == 0) || (x1 == 13 && y1 == 0))
    {
            if(Q.inputs['right'])
           {
              this.p.speed += 2;
              if (this.p.speed > 400)
             {
                this.p.speed = 400;
             }
            this.p.vx = this.p.speed;
           }
          else if (Q.inputs['left'])
          {
            this.p.speed -= 2;
            if (this.p.speed < -400)
             {
                this.p.speed = -400;
             }
            this.p.vx = this.p.speed;
          }
          else
         {
             if (this.p.speed > 10)
             {
                this.p.speed -= 1;
             }
             else if (this.p.speed > -10 && this.p.speed <= 10)
             {
                this.p.speed = 0;
             }
             else
             {
                this.p.speed += 1;
             }
            this.p.vx = this.p.speed;
         }
        
    } 

   if (x1 >= 13)
   {
         this.p.jumpSpeed = -700
    }



    if(!processed && this.p.door)
    {
      this.p.gravity = 1;
      if(this.p.checkDoor && this.p.landed > 0)
      {
        // Enter door.
        this.p.y = this.p.door.p.y;
        this.p.x = this.p.door.p.x;
        this.play('climb');
        this.p.toDoor = this.p.door.findLinkedDoor();
        processed = true;
      }
      else if (this.p.toDoor)
     {
        // Transport to matching door.
        this.p.y = this.p.toDoor.p.y;
        this.p.x = this.p.toDoor.p.x;
        this.stage.centerOn(this.p.x, this.p.y);
        this.p.toDoor = false;
        this.stage.follow(this);
        processed = true;
      }
    } 
      
    if(!processed)
    { 
      this.p.gravity = 1;

      if(Q.inputs['down'] && !this.p.door) 
      {
        this.p.ignoreControls = true;
        this.play("duck_" + this.p.direction);
        if(this.p.landed > 0)
        {
          this.p.vx = this.p.vx * (1 - dt*2);
        }
        this.p.points = this.p.duckingPoints;
      }

     else
     {
        this.p.ignoreControls = false;
        this.p.points = this.p.standingPoints;

        if(this.p.vx > 0)
       {
          if(this.p.landed > 0)
         {
            this.play("walk_right");
          } 
         else
         {
            this.play("jump_right");
          }
          this.p.direction = "right";
        }

        else if(this.p.vx < 0)
        {
          if(this.p.landed > 0) 
         {
            this.play("walk_left");
          } 
         else
         {
            this.play("jump_left");
         }
         this.p.direction = "left";
       } 

       else
        {
          this.play("stand_" + this.p.direction);
        }
           
      }
    }

    this.p.onLadder = false;
    this.p.door = false;
    this.p.checkDoor = false;




         if(this.p.y > 20000  && x1 == 8 && y1 == 2 && fall == 0) 
         {
            Q.stageScene("endGame",1, { label: "You died in \n lava!" });
            Q.audio.play('fall.wav');
            this.destroy();
            this.resetZone();
         }

         if(this.p.y > 2000 && !(x1 == 8 && y1 == 2) && fall == 0) 
         {
                Q.stageScene("endGame",1, { label: "You died!" });
                Q.audio.play('fall.wav');
                this.destroy();
                this.resetZone();
         }

         if(this.p.y < 0 && x1 == 15 && y1 == 0) 
         {
                Q.stageScene("ending",1, { label: "The End!" });
         }



    


    
 
    

    

    
    

 

        

    

    

    }
});

Q.Sprite.extend("Enemy", {
  init: function(p,defaults)
 {

    this._super(p,Q._defaults(defaults||{},
   {
      sheet: p.sprite,
      vx: 0,
      vy: 0,
      defaultDirection: 'left',
      type: Q.SPRITE_ENEMY,
      collisionMask: Q.SPRITE_DEFAULT
    }));

    this.add("2d, aiBounce, animation");
    this.on("bump.top",this,"die");
    this.on("hit.sprite",this,"hit");
 },

  step: function(dt)
  {

    if(this.p.dead) 
   {
         this.del('2d, aiBounce');
         this.p.deadTimer++;
         if (this.p.deadTimer > 120)
         {
        // Dead for 120 frames, remove it.
        
           this.destroy();


         }
         return;
   }
    var p = this.p;

    p.vx += p.ax * dt;
    p.vy += p.ay * dt;

    p.x += p.vx * dt;
    p.y += p.vy * dt;

    this.play('walk');
 },

  hit: function(col)
  {
    if(col.obj.isA("Player") && !col.obj.p.immune && !this.p.dead && invincible !=1)
   {
      col.obj.trigger('enemy.hit', {"enemy":this,"col":col});
      Q.audio.play('hit.wav');

    }
  },

  die: function(col)
  {


    if(col.obj.isA("Player") && horizontalMonsterResistance == 0)
   {
     Q.audio.play('jumped.wav');
      score += 25;
      Q.stageScene('hud', 3, this.p);
      this.p.vx=this.p.vy=0;
      this.play('dead');
      this.p.dead = true;
      var that = this;
      col.obj.p.vy = -600;
      this.p.deadTimer = 0;
      horizontalMonsterResistance = 2;
    }
   else if (col.obj.isA("Player") && horizontalMonsterResistance > 0)
   {
        col.obj.p.immune = true;
        col.obj.p.immuneTimer = 0;
        horizontalMonsterResistance -= 1;
        if (horizontalMonsterResistance < 0)
        { 
             horizontalMonsterResistance = 0;
        }
       Q.audio.play("land.wav");
       col.obj.p.vy = -600;
   }

   else
   {
   }
  }
});

Q.Enemy.extend("GroundEnemy", {
  init: function(p) {
    this._super(p,{
      w: 96,
      h: 96,
      vx: -50
    });
  },

  step: function(dt) {
  

    var dirX = this.p.x / Math.abs(this.p.x);
    var ground = Q.stage().locate(this.p.x, this.p.y + this.p.h/2 + 1, Q.SPRITE_DEFAULT);
    var nextElement = Q.stage().locate(this.p.x + dirX * this.p.w/2 + dirX, this.p.y + this.p.h/2 + 1,Q.SPRITE_DEFAULT);
    var nextTile;

    if(nextElement instanceof Q.TileLayer) {
     nextTile = true;
    }


    if(!nextTile && ground) 
    {
     if(this.p.vx > 0) 
     {
       if (this.p.defaultDirection == "right") 
       {
         this.p.flip = "x";
       }
       else 
      {
        this.p.flip = false;
      }
    }
    else 
    {
      if(this.p.defaultDirection == "left") {
        this.p.flip = "x";
      }
      else {
       this.p.flip = false;
      }
    }
    this.p.vx = -this.p.vx;
   }

    if(this.p.dead) 
   {
      
      this.del('2d, aiBounce');
      this.p.deadTimer++;
      if (this.p.deadTimer > 240)
      {
        // Dead for 240 frames, remove it.
        
        this.destroy();

      }
      return;
   }
    var p = this.p;

    p.vx += p.ax * dt;
    p.vy += p.ay * dt;

    p.x += p.vx * dt;
    p.y += p.vy * dt;

    this.play('walk');
 }
});



Q.Enemy.extend("VerticalEnemy", {
  init: function(p) {
    this._super(p,{
      w: 96,
      h: 96,
      vy: -25,
      rangeY: 50,
      gravity: 0
    });

     this.p.initialY = this.p.y;
     this.p.initialVy = this.p.vy;
     this.p.vyDirection = this.p.vy/Math.abs(this.p.vy);

     this.on("bump.top, bump.bottom", function(collision) {
       this.p.vy = -Math.abs(this.p.initialVy) * this.p.vyDirection;
       this.p.vyDirection = this.p.vy/Math.abs(this.p.vy);
     });
  },

 step: function(dt) {


    if(this.p.dead) 
   {
      this.del('2d, aiBounce');
      this.p.deadTimer++;
      if (this.p.deadTimer > 240)
      {
        // Dead for 240 frames, remove it.
        
        this.destroy();

      }
      return;
   }
    var p = this.p;

    p.vx += p.ax * dt;
    p.vy += p.ay * dt;

    p.x += p.vx * dt;
    p.y += p.vy * dt;

    this.play('walk');

                
    if(this.p.y - this.p.initialY >= this.p.rangeY && this.p.vy > 0) {
     this.p.vy = -this.p.vy;
     this.p.vyDirection *= -1;
    } 
    else if(-this.p.y + this.p.initialY >= this.p.rangeY && this.p.vy < 0) {
     this.p.vy = -this.p.vy;
     this.p.vyDirection *= -1;
    } 


  }
});







Q.Sprite.extend("Collectable", {
  init: function(p) {
    this._super(p,{
      sheet: p.sprite,
      type: Q.SPRITE_COLLECTABLE,
      collisionMask: Q.SPRITE_PLAYER,
      sensor: true,
      vx: 0,
      vy: 0,
      gravity: 0
    });
    this.add("animation");

    this.on("sensor");
  },

  // When a Collectable is hit.
  sensor: function(colObj) 
  {
    // Increment the score.
    if (this.p.amount) 
   {
      if (multiplier200 == 200)
      {
         this.p.amount *= multiplier200
      }
      else if (multiplier20 == 20)
      {
         this.p.amount *= multiplier20
      }
      else if (multiplier2 == 2)
      {
         this.p.amount *= multiplier2
      }
      else
      {
      }
      score += this.p.amount;


      Q.stageScene('hud', 3, this.p);
    }
   Q.audio.play('coin.wav');
    this.destroy();
  }
});

Q.Sprite.extend("Door", {
  init: function(p) {
    this._super(p,{
      sheet: p.sprite,
      type: Q.SPRITE_DOOR,
      collisionMask: Q.SPRITE_NONE,
      sensor: true,
      vx: 0,
      vy: 0,
      gravity: 0
    });
    this.add("animation");

    this.on("sensor");
  },
  findLinkedDoor: function() {
    return this.stage.find(this.p.link);
  },
  // When the player is in the door.
  sensor: function(colObj) {
    // Mark the door object on the player.
    colObj.p.door = this;
  }
});

Q.Collectable.extend("Heart", {
  sensor: function(colObj) {
    if (this.p.strength) {
      strength = Math.max(strength + 25, 100);
      Q.stageScene('hud', 3, this.p);
      Q.audio.play('heart.wav');
      Q.stageScene("message",1, { label: "You gained health!" }); 
    }
    this.destroy();
  }
});

Q.Collectable.extend("Pill", {
  sensor: function(colObj) {
    if (this.p.strength) {
       if (strength < 200)
       {
          strength = 200;
       }
      Q.stageScene('hud', 3, this.p);
      Q.audio.play('heart.wav');
      Q.stageScene("message",1, { label: "Your health is \n maximized at 200!" }); 
    }
    this.destroy();
  }
});


Q.Collectable.extend("Mult2", {
  sensor: function(colObj) {
     if (this.p.multiplier2) {
         multiplier2 = 2;
         Q.stageScene('hud', 3, this.p);
         Q.audio.play('win.wav');
        Q.stageScene("message",1, { label: "Points multiplied \n by 2! "}); 
    }
    this.destroy();
  }
});

Q.Collectable.extend("Mult20", {
  sensor: function(colObj) {
     if (this.p.multiplier20) {
         multiplier20 = 20;
         Q.stageScene('hud', 3, this.p);
        Q.audio.play('win.wav');
        Q.stageScene("message",1, { label: "Points multiplied \n by 20!" }); 

    }
         this.destroy();
  }
});

Q.Collectable.extend("Mult200", {
  sensor: function(colObj) {
     if (this.p.multiplier200) {
         multiplier200 = 200;
         Q.stageScene('hud', 3, this.p);
         Q.audio.play('win.wav');
         Q.stageScene("message",1, { label: "Points multipied \n by 200!" }); 

    }
          this.destroy();
  }
});

Q.Collectable.extend("Gamble", {
  sensor: function(colObj) {
      previousScoreToCompare = score;
      score = Math.floor((Math.random() * score * 2) + 1);
      if (previousScoreToCompare  >= score)
      {
           Q.audio.play('lose.wav');
           Q.stageScene("message",1, { label: "You lost money!" }); 
      }
      else
      {
           Q.audio.play('win.wav');
           Q.stageScene("message",1, { label: "You won money!" }); 
      }
      Q.stageScene('hud', 3, this.p);
      this.destroy();
  }
});

Q.Collectable.extend("Invincible", {
  sensor: function(colObj) {
      invincible = 1;
      Q.audio.play('heart.wav');
      Q.stageScene("message",1, { label: "Invincibility to \n enemies!" }); 
      this.destroy();
  }
});

Q.Collectable.extend("Float", {
  sensor: function(colObj) {
      float = 1;
      Q.audio.play('heart.wav');
      Q.stageScene("message",1, { label: "Float on!" }); 
      this.destroy();
  }
});

Q.Collectable.extend("Slow", {
  sensor: function(colObj) {
      slow = 1;
      Q.audio.play('lose.wav');
      Q.stageScene("message",1, { label: "Mobility Lost!" }); 
      this.destroy();
  }
});

Q.Collectable.extend("Music", {
  sensor: function(colObj) {
         Q.audio.stop();
         Q.audio.play('onyva.wav', {loop: false});
         this.destroy();
  }
});

Q.Collectable.extend("Chocolate", {
  sensor: function(colObj) {
    if (this.p.strength) {
      strength = Math.floor((Math.random() * 500) + strength);
      Q.stageScene('hud', 3, this.p);
      Q.audio.play('heart.wav');
      Q.stageScene("message",1, { label: "Magic chocolate! \n Super added health!" }); 
    }
    this.destroy();
  }
});

Q.Collectable.extend("Gift", {
  sensor: function(colObj) {
      if (giftRandom == 1)
     {
         score += 1;
         Q.stageScene("message",1, { label: "You won a toonie!\n $2" }); 
        Q.audio.play('win.wav');
     }
      else if (giftRandom == 2)
     {
         score += 10;
         Q.stageScene("message",1, { label: "You won $10!" }); 
         Q.audio.play('win.wav');
     }
      else if (giftRandom == 3)
     {
         score += 100;
         Q.stageScene("message",1, { label: "You won $100!" }); 
        Q.audio.play('win.wav');
     }
      else if (giftRandom == 4)
     {
         if (strength < 200)
         {
             strength = 200;
         }
         Q.stageScene("message",1, { label: "You won maximum \n health at 200!" }); 
         Q.audio.play('win.wav');
     }

      else if (giftRandom == 8)
     {
       previousScoreToCompare = score;
       score = Math.floor((Math.random() * score * 2) + 1);
       if (previousScoreToCompare  >= score)
       {
           Q.audio.play('lose.wav');
           Q.stageScene("message",1, { label: "You lost money!" }); 
       }
       else
       {
           Q.audio.play('win.wav');
           Q.stageScene("message",1, { label: "You won money!" }); 
       }
     }

      else if (giftRandom == 9)
     {
         score += 1000;
        Q.stageScene("message",1, { label: "You won $1000!" }); 
        Q.audio.play('win.wav');
        
         
     }
      else if (giftRandom == 10)
     {
         score += 5000;
        Q.stageScene("message",1, { label: "You won $5000!" }); 
        Q.audio.play('win.wav');
     }
      else if (giftRandom == 13)
     {
         if (this.p.strength) {
               strength = Math.max(strength + 25, 100);
              Q.stageScene("message",1, { label: "You won health!" }); 
              Q.audio.play('heart.wav');
         }
     }
      else if (giftRandom == 14)
     {
         invincible = 1;
         Q.stageScene("message",1, { label: "You are now \n invincible to enemies!" }); 
        Q.audio.play('win.wav');
     }
      else if (giftRandom == 15)
     {
         float = 1;
         Q.stageScene("message",1, { label: "Float on!" }); 
     }

      else if (giftRandom == 16)
     {
         slow = 1;
        Q.stageScene("message",1, { label: "Mobility lost...\n Boooo. You are \n stuck!" }); 
        Q.audio.play('lose.wav');
     }

      else if (giftRandom == 17)
     {
         Q.audio.stop();
         Q.audio.play('onyva.wav', {loop: false});
     }

      else if (giftRandom == 18)
     {
         if (this.p.strength) {
               strength = Math.floor((Math.random() * 500) + strength);
              Q.stageScene("message",1, { label: "Magic chocolate! \n You won added \n health! \n" }); 
              Q.audio.play('heart.wav');
         }
     }
      else
     {
         Q.audio.play('lose.wav');
         Q.stageScene("message",1, { label: "Sorry, try again!" }); 
     }

      Q.stageScene('hud', 3, this.p);
      this.destroy();
  }
});

Q.Collectable.extend("Blue_Key", {
  sensor: function(colObj) {
    blueKey = 1;
   Q.stageScene("message",1, { label: "Congratulations, graduate!" }); 
    this.destroy();
  }
});


Q.scene("zone1-1",function(stage)
{
 
 stage.insert(new Q.Repeater({ asset: "10.png", speedX: 0.0, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone1-1.tmx", stage);
  Q.audio.stop();
 Q.audio.play('city.wav', {loop: true});
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
Q.stageScene('hud', 3, this.p);

 x1 = 1;
 y1 = 1;

i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});

Q.scene("zone2-1",function(stage)
{
  
  stage.insert(new Q.Repeater({ asset: "10.png", speedX: 0.0, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone2-1.tmx", stage);
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
 Q.stageScene('hud', 3, this.p);


 x1 = 2;
 y1 = 1;


i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});

Q.scene("zone3-1",function(stage)
{
  
  stage.insert(new Q.Repeater({ asset: "10.png", speedX: 0.0, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone3-1.tmx", stage);
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
Q.stageScene('hud', 3, this.p);



 x1 = 3;
 y1 = 1;


i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});

Q.scene("zone4-1",function(stage)
{
  
  stage.insert(new Q.Repeater({ asset: "10.png", speedX: 0.0, speedY: 1.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone4-1.tmx", stage);
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
Q.stageScene('hud', 3, this.p);


 x1 = 4;
 y1 = 1;


i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});

Q.scene("zone5-1",function(stage)
{
  
  stage.insert(new Q.Repeater({ asset: "3.png", speedX: 0.0, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone5-1.tmx", stage);
  Q.audio.stop();
 Q.audio.play('metro.wav', {loop: true});
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
Q.stageScene('hud', 3, this.p);


 x1 = 5;
 y1 = 1;


i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});

Q.scene("zone6-1",function(stage)
{
  
  stage.insert(new Q.Repeater({ asset: "3.png", speedX: 0.0, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone6-1.tmx", stage);
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
Q.stageScene('hud', 3, this.p);


 x1 = 6;
 y1 = 1;


i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});



Q.scene("zone7-1",function(stage)
{
  
  stage.insert(new Q.Repeater({ asset: "3.png", speedX: 0.0, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone7-1.tmx", stage);
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
Q.stageScene('hud', 3, this.p);


 x1 = 7;
 y1 = 1;


i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});


Q.scene("zone8-1",function(stage)
{
  
  stage.insert(new Q.Repeater({ asset: "9.png", speedX: 0.0, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone8-1.tmx", stage);
  Q.audio.stop();
 Q.audio.play('lava.wav', {loop: true});
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
Q.stageScene('hud', 3, this.p);


 x1 = 8;
 y1 = 1;


i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});


Q.scene("zone8-2",function(stage)
{
  
  stage.insert(new Q.Repeater({ asset: "3.png", speedX: 0.0, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone8-2.tmx", stage);
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
  Q.stageScene('hud', 3, this.p);


 x1 = 8;
 y1 = 2;


i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});


Q.scene("zone9-1",function(stage)
{
  
  stage.insert(new Q.Repeater({ asset: "3.png", speedX: 0.0, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone9-1.tmx", stage);
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
  Q.stageScene('hud', 3, this.p);


 x1 = 9;
 y1 = 1;


i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});


Q.scene("zone10-1",function(stage)
{
  
  stage.insert(new Q.Repeater({ asset: "3.png", speedX: 0.0, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone10-1.tmx", stage);
  Q.audio.stop();
  Q.audio.play('metro.wav', {loop: true});
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
  Q.stageScene('hud', 3, this.p);


 x1 = 10;
 y1 = 1;


i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});


Q.scene("zone10-0",function(stage)
{
  
  stage.insert(new Q.Repeater({ asset: "10.png", speedX: 0.0, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone10-0.tmx", stage);
  Q.audio.stop();
  Q.audio.play('city.wav', {loop: true});
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
  Q.stageScene('hud', 3, this.p);


 x1 = 10;
 y1 = 0;


i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});

Q.scene("zone11-0",function(stage)
{
  
  stage.insert(new Q.Repeater({ asset: "23.png", speedX: 0.5, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone11-0.tmx", stage);
  Q.audio.stop();
  Q.audio.play('city.wav', {loop: true});
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
  Q.stageScene('hud', 3, this.p);


 x1 = 11;
 y1 = 0;


i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});


Q.scene("zone12-0",function(stage)
{
  
  stage.insert(new Q.Repeater({ asset: "23.png", speedX: 0.5, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone12-0.tmx", stage);
  Q.audio.stop();
  Q.audio.play('ice.wav', {loop: true});
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
  Q.stageScene('hud', 3, this.p);


 x1 = 12;
 y1 = 0;


i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});

Q.scene("zone13-0",function(stage)
{
  
  stage.insert(new Q.Repeater({ asset: "23.png", speedX: 0.5, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone13-0.tmx", stage);
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
  Q.stageScene('hud', 3, this.p);


 x1 = 13;
 y1 = 0;


i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});

Q.scene("zone14-0",function(stage)
{
  fall = 1;
 x1 = 14;
 y1 = 0;
  stage.insert(new Q.Repeater({ asset: "10.png", speedX: 0.0, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone14-0.tmx", stage);
  Q.audio.stop();
  Q.audio.play('city.wav', {loop: true});
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
  Q.stageScene('hud', 3, this.p);






i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});

Q.scene("zone15-0",function(stage)
{
  fall = 1;
 x1 = 14;
 y1 = 0;
  stage.insert(new Q.Repeater({ asset: "10.png", speedX: 0.0, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
  Q.stageTMX("zone15-0.tmx", stage);
  stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});
  Q.stageScene('hud', 3, this.p);


 x1 = 15;
 y1 = 0;



i = t = n = q = invincible = float = slow = 0;
horizontalMonsterResistance = 2;
multiplier2 = multiplier20 = multiplier200 = 1;
giftRandom = Math.floor((Math.random() * 23) + 1);

});

Q.scene("ending",function(stage)
{
  stage.insert(new Q.Repeater({ asset: "ending.png", speedX: 0.0, speedY: 0.0, repeatY: true, repeatX: true, scale: 1.00 }));
});




Q.scene('gameMenu',function(stage) {
  var box = stage.insert(new Q.UI.Container({ 
    x: Q.width/2, y: Q.height/2,  fill: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({x: 0, y: 0, fill: "#FFFFFF",
                                           label: "START GAME" }))         
  button.on("click",function() {
    Q.stageScene("zone1-1");
    Q.stageScene('hud', 3, Q('Player').first().p);
  });
  box.fit(50);
});






Q.scene('endGame',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/3, y: Q.height/3, fill: "rgba(0,0,0,0.5)",
      border: 5,
      shadow: 10,
      font: "Comic Sans MS",
      shadowColor: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: -80, fill: "#FFFFFF",
                                           label: "Reload Area" }))         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene("zone" + String(x1) + "-" + String(y1));
    Q.stageScene('hud', 3, this.p);
  });
  box.fit(50);
});

Q.scene('police1',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/3, y: Q.height/3, fill: "rgba(0,0,0,0.5)",
      border: 5,
      shadow: 10,
      font: "Comic Sans MS",
      shadowColor: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: -80, fill: "#FFFFFF",
                                           label: "OK" }))         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
       box.destroy();
  });
  box.fit(50);
});

Q.scene('police2',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/3, y: Q.height/3, fill: "rgba(0,0,0,0.5)",
      border: 5,
      shadow: 10,
      font: "Comic Sans MS",
      shadowColor: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: -80, fill: "#FFFFFF",
                                           label: "OK, Sir" }))         
  var label = box.insert(new Q.UI.Text({color: "#FFFFFF", font: "12px Arial", x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
       box.destroy();
  });
  box.fit(50);
});

Q.scene('police3',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/3, y: Q.height/3, fill: "rgba(0,0,0,0.5)",
      border: 5,
      shadow: 10,
      font: "Comic Sans MS",
      shadowColor: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: -80, fill: "#FFFFFF",
                                           label: "No, officer!" }))         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
       box.destroy();
  });
  box.fit(50);
});

Q.scene('police4',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/3, y: Q.height/3, fill: "rgba(0,0,0,0.5)",
      border: 5,
      shadow: 10,
      font: "Comic Sans MS",
      shadowColor: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: -80, fill: "#FFFFFF",
                                           label: "No!" }))         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
       box.destroy();
  });
  box.fit(50);
});

Q.scene('police5',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/3, y: Q.height/3, fill: "rgba(0,0,0,0.5)",
      border: 5,
      shadow: 10,
      font: "Comic Sans MS",
      shadowColor: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: -80, fill: "#FFFFFF",
                                           label: "Oh God!" }))         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
       box.destroy();
  });
  box.fit(50);
});

Q.scene('fire',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/3, y: Q.height/3, fill: "rgba(0,0,0,0.5)",
      border: 5,
      shadow: 10,
      font: "Comic Sans MS",
      shadowColor: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: -80, fill: "#FFFFFF",
                                           label: "FIRE!" }))         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
       box.destroy();
  });
  box.fit(50);
});

Q.scene('phone',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/3, y: Q.height/3, fill: "rgba(0,0,0,0.5)",
      border: 5,
      shadow: 10,
      font: "Comic Sans MS",
      shadowColor: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: -80, fill: "#FFFFFF",
                                           label: "Calling..." }))         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
       box.destroy();
  });
  box.fit(50);
});


Q.scene('message',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/3, y: Q.height/3, fill: "rgba(0,0,0,0.5)",
      border: 5,
      shadow: 10,
      font: "Comic Sans MS",
      shadowColor: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: -80, fill: "#FFFFFF",
                                           label: "Okee Dokee!" }))         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
       box.destroy();
  });
  box.fit(50);
});








Q.scene('hud',function(stage) {
  var container = stage.insert(new Q.UI.Container({
      fill: "rgba(255,255,0,0.7)",
      border: 5,
      shadow: 10,
      font: "Comic Sans MS",
      shadowColor: "rgba(0,0,0,0.5)",
      x: 2,
      y: 2
      
  }));




if (strength > 500)
{
    var label2 = container.insert(new Q.UI.Text({x:100, y: 25,
    label: "☻☻☻ " + strength + "", color: "blue" }));
}

else if (strength > 200 && strength <= 500)
{
  var label2 = container.insert(new Q.UI.Text({x:100, y: 25,
  label: "☻☻" + strength + "", color: "green" }));
}

else if (strength > 100 && strength <= 200)
{
  var label2 = container.insert(new Q.UI.Text({x:100, y: 25,
  label: "☻" + strength + "", color: "yellow" }));
}

else if (strength > 75 && strength <= 100)
{
  var label2 = container.insert(new Q.UI.Text({x:100, y: 25,
  label: "♥♥♥♥ " + strength + "", color: "orange" }));
}

else if (strength > 50 && strength <= 75)
{
  var label2 = container.insert(new Q.UI.Text({x:100, y: 25,
  label: "♥♥♥ " + strength + "", color: "orange" }));
}

else if (strength > 25 && strength <= 50)
{
  var label2 = container.insert(new Q.UI.Text({x:100, y: 25,
  label: "♥♥ " + strength + "", color: "orange" }));
}
else
{
  var label2 = container.insert(new Q.UI.Text({x:100, y: 25,
     label: " " + strength + "", color: "red" }));
}

 var label3 = container.insert(new Q.UI.Text({x:100, y: 50,
    label: "$ " + score + "    L: " + x1 + "-" + y1, color: "white" }));

  container.fit(20);
});



Q.loadTMX("zone1-1.tmx, zone2-1.tmx, zone3-1.tmx, zone4-1.tmx,  zone5-1.tmx,  zone6-1.tmx, zone7-1.tmx, zone8-1.tmx, zone8-2.tmx, zone9-1.tmx, zone10-1.tmx, zone10-0.tmx, zone11-0.tmx, zone12-0.tmx,  zone13-0.tmx,  zone14-0.tmx, zone15-0.tmx, 3.png, 9.png, 10.png, 23.png, ending.png, collectables.json, doors.json, enemies.json, fire.mp3, jump.wav, jumped.wav, heart.wav, hit.wav, coin.wav, fall.wav, land.wav, tile.wav, onyva.wav, win.wav, lose.wav, player.json, player.png, collectables.png, zone1-1.mp3, city.wav, metro.wav, lava.wav, ice.wav, enemies.png", function() {
    Q.compileSheets("player.png","player.json");
    Q.compileSheets("collectables.png","collectables.json");
    Q.compileSheets("enemies.png","enemies.json");
    Q.compileSheets("doors.png","doors.json");
    Q.animations("player", {
      walk_right: { frames: [0,1,2,3,4,5,6,7,8,9,10], rate: 1/15, flip: false, loop: true },
      walk_left: { frames:  [0,1,2,3,4,5,6,7,8,9,10], rate: 1/15, flip:"x", loop: true },
      jump_right: { frames: [13], rate: 1/10, flip: false },
      jump_left: { frames:  [13], rate: 1/10, flip: "x" },
      stand_right: { frames:[14], rate: 1/10, flip: false },
      stand_left: { frames: [14], rate: 1/10, flip:"x" },
      duck_right: { frames: [15], rate: 110, flip: false },
      duck_left: { frames:  [15], rate: 1/10, flip: "x" },
      climb: { frames:  [16, 17], rate: 1/3, flip: false }
    });
    var EnemyAnimations = {
      walk: { frames: [0,1], rate: 1/3, loop: true },
      dead: { frames: [2], rate: 1/10 }
    };
    Q.animations("car", EnemyAnimations);
    Q.animations("wheel", EnemyAnimations);
    Q.animations("spike", EnemyAnimations);
    Q.animations("board", EnemyAnimations);
    Q.animations("fly", EnemyAnimations);

    pass = swimGear = lavaBoots = jumpingBoots  = flyBot = spaceBot = false;
    multiplier20= multiplier20 =  multiplier200 = 1;
    score = invincible = float = slow = blueKey = fall = 0;
    giftRandom = Math.floor((Math.random() * 23) + 1);
    horizontalMonsterResistance = 2;


   Q.stageScene("gameMenu");






  
}, {
  progressCallback: function(loaded,total) {
    var element = document.getElementById("loading_progress");
    element.style.width = Math.floor(loaded/total*100) + "%";

    if (loaded == total) {
      document.getElementById("loading").remove();
    }
  }
});

// ## Possible Experimentations:
// 
// The are lots of things to try out here.
// 
// 1. Modify zone.json to change the zone around and add in some more enemies.
// 2. Add in a second zone by creating a zone2.json and a zone2 scene that gets
//    loaded after zone 1 is complete.
// 3. Add in a title screen
// 4. Add in a hud and points for jumping on enemies.
// 5. Add in a `Repeater` behind the TileLayer to create a paralax scrolling effect.

});			


