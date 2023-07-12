import React from 'react'
import { useEffect } from 'react';
import GameBoard from '../bb/gameBoard'

export default function GamePanel(props){
  window.myManager.selectedLvl = props.nLevel;
    useEffect(()=>{
        async function prepareGame() {
            await mountPhaser();
            if(!window.game) window.game = new window.Phaser.Game(window.config);
            //window.myManager.myGB.clearLvlInfo();
            //window.myManager.myGB.startLevel(window.myManager.selectedLvl);
          }
          prepareGame();

        return ()=>{
          if (window.game) window.game.destroy(true, false);
        }  
    },[])

    function mountPhaser() {
        window.config = {
          type: window.Phaser.CANVAS,
          width: 1100,
          height: 700,
          parent: 'phaCont',
      
          backgroundColor: '#5accff',
          disableContextMenu: true,
          scene: {
            create: create,
            update: update
          },
          scale: {
            autoCenter: window.Phaser.Scale.CENTER_BOTH,
            mode: window.Phaser.Scale.FIT
          }
      
        };
    }

    return(
         <div style={{ backgroundColor: "#5accff !important" }
       } id='phaCont' />
    );
}

function create() {
  if (window.baseCache.exists("atlasImg") && window.baseCache.exists("atlasJson")) {
    console.log("Create.Basecache has atlas");
    this.textures.addAtlasJSONHash("atlas", window.baseCache.get("atlasImg"),
      window.baseCache.get("atlasJson"));
  }
  else {
    console.log("Create.Basecache has not atlas");
    let atlasImg, atlasJson;
    if (this.game.textures.exists("atlas")) {
      atlasImg = this.game.textures.get("atlas").getSourceImage("atlas");
    }

    if (this.game.cache.json.exists("atlas")) {
      atlasJson = this.game.cache.json.get("atlas");
    }

    if (atlasImg && atlasJson) {
      window.baseCache.add("atlasImg", atlasImg);
      window.baseCache.add("atlasJson", atlasJson);
    }
  }

  let topParent = this.game.scale.parent.parentElement;
  topParent.style.backgroundColor = "#5accff";

  window.myManager.create(this);
  return;
}

function update(time, delTime) {
  // размеры div, содержащего канвас
  let parentSize = this.game.scale.parentSize;

  // элемент с id=phaCont, содержащий канвас
  let contParent = this.game.scale.parent;

  // элемент-родитель для contParent
  let topParent = contParent.parentElement;

  let topParentW = getComputedStyle(topParent).width;
  let topParentH = getComputedStyle(topParent).height;

  let difH = Math.abs(parseFloat(topParentH) - parseFloat(parentSize.height));
  let difW = Math.abs(parseFloat(topParentW) - parseFloat(parentSize.width));

  // if ((difH > 10) || (difW > 10)) {
  //   this.game.scale.setParentSize(parseFloat(topParentW), parseFloat(topParentH));
  // }
}