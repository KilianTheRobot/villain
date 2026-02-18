// Kleines Textadventure in Deutsch
(function(){
  const startBtn = document.getElementById('startBtn')
  const nameInput = document.getElementById('nameInput')
  const intro = document.getElementById('intro')
  const game = document.getElementById('game')
  const sceneText = document.getElementById('sceneText')
  const options = document.getElementById('options')
  const status = document.getElementById('status')
  const endSec = document.getElementById('end')
  const endText = document.getElementById('endText')
  const restart = document.getElementById('restart')

  let state = {}

  const nodes = {
    start: {text: `Du bist {name}, ein Jugendlicher, der Feuer beschwören kann. Böse Wölfe haben dich von deinen Eltern getrennt. Deine Eltern sind in einem großen Schloss gefangen, das von Wolfswachen bewacht wird. Dein Ziel: Sie befreien und den Cyborg-Wolf besiegen.`, options:[{t:'Weiter',next:'entrance'}]},

    entrance: {text: `Du stehst am Waldrand. Vor dir liegt ein dunkler Pfad und ein kleiner, wilder Fluss. Der Weg durch den Wald könnte schneller sein, aber stärker bewacht. Der Fluss ist langsamer, birgt aber Deckung. Was tust du?`, options:[{t:'Durch den Wald gehen (schneller, riskanter)',next:'wolfPatrol'},{t:'Dem Fluss folgen (langsamer, leiser)',next:'fishingHut'}]},

    wolfPatrol: {text: `Du streifst leise durch Bäume und hörst ein Knurren: eine Wolfsstreife steht im Weg.`, options:[{t:'Feuer einsetzen und angreifen',next:'afterPatrol',e:['useFire','defeatWolf']},{t:'Versuchen vorbeizuschleichen',next:'sneakPast'}]},

    sneakPast: {text: `Du schleichst vorbei, ein Wolf merkt dich und bellt — du fliehst glücklicherweise. Du verlierst etwas Zeit.`, options:[{t:'Weiter zum Schloss',next:'ruins'},{t:'Umkehren zum Fluss',next:'fishingHut'}], e:['scare']},

    afterPatrol: {text: `Mit deiner Flammenkraft vertreibst du die Streife. Der Pfad ist nun frei. Du fühlst dich stärker, aber die Wölfe merken sich dein Feuer.`, options:[{t:'Weiter zum Schloss',next:'ruins'},{t:'Am Fluss ausruhen',next:'fishingHut'}], e:['confident']},

    fishingHut: {text: `Am Fluss findest du eine verlassene Fischerhütte. Im Inneren liegt ein alter Schlüssel und eine Fackel.`, options:[{t:'Nimm den Schlüssel',next:'gotKey',e:['gainKey']},{t:'Nimm die Fackel',next:'gotTorch',e:['gotTorch']}]},

    gotKey: {text: `Du nimmst den Schlüssel. Vielleicht gehört er zum Schloss.`, options:[{t:'Weiter zum Schloss',next:'ruins'},{t:'Noch etwas suchen',next:'searchHut'}]},

    gotTorch: {text: `Die Fackel könnte nützlich sein, um dunkle Gänge auszuleuchten.`, options:[{t:'Weiter zum Schloss',next:'ruins'},{t:'Nochmal die Hütte durchsuchen',next:'searchHut'}], e:['gotTorch']},

    searchHut: {text: `Du findest nichts weiter außer ein paar Hundefellen. Ein Geruch erinnert dich an die Nähe des Schlosses.`, options:[{t:'Aufbrechen',next:'ruins'}]},

    ruins: {text: `Vor dir liegen verfallene Ruinen und eine alte Straße, die zum Schloss führt. In den Ruinen lauern kleinere Wolfsrudel.`, options:[{t:'Rudelkampf wagen',next:'fightRudels',e:['defeatWolf']},{t:'Um die Ruinen herum schleichen',next:'aroundRuins'}]},

    fightRudels: {text: `Du kämpfst gegen mehrere Wölfe. Dein Feuer ist mächtig, doch du brauchst Kraft. Du besiegst einige, aber die Spur zum Schloss ist verwischt.`, options:[{t:'Weiter zum Schloss',next:'castleGate'}], e:['tired','defeatWolf']},

    aroundRuins: {text: `Du findest einen versteckten Pfad, der direkt zur Rückseite des Schlosses führt. Vielleicht ist hier ein geheimer Eingang.`, options:[{t:'Dem Pfad folgen',next:'backGate'},{t:'Zum Haupteingang gehen',next:'castleGate'}]},

    castleGate: {text: `Vor dem Schloss: riesige Tore, Wolfswachen auf den Zinnen. Du brauchst entweder einen Schlüssel, oder du musst die Wachen ablenken.`, options:[{t:'Den Schlüssel benutzen (falls du ihn hast)',next:'gateOpen',cond:'gainKey'},{t:'Wachen mit Feuer ablenken',next:'distractGuards',e:['useFire']},{t:'Nach einem geheimen Eingang suchen',next:'backGate'}]},

    backGate: {text: `Hinter dem Schloss: eine kleine Kellertür. Sie wirkt verschlossen.`, options:[{t:'Mit Gewalt öffnen',next:'breakDoor',e:['tired']},{t:'Die Tür mit einem gefundenen Schlüssel öffnen',next:'gateOpen',cond:'gainKey'},{t:'Fackel benutzen um Dunkelheit zu erhellen',next:'darkCorridor',cond:'gotTorch'}]},

    breakDoor: {text: `Du öffnest die Tür mit Mühe. Ein Korridor führt hinein. Du hast dich angestrengt.`, options:[{t:'Reingehen',next:'darkCorridor'}], e:['tired']},

    darkCorridor: {text: `Im Inneren führst du eine schmale Treppe hinauf zum Thronsaal. Irgendwo schlummert der Cyborg-Wolf.`, options:[{t:'Leise weiterschleichen',next:'throneRoom'},{t:'Mit Feuer einen Sturmlauf machen',next:'throneRoom',e:['useFire']} ]},

    distractGuards: {text: `Du entfachst ein Feuerwerk aus Flammen an einer Seite — einige Wachen rennen hin, andere sind alarmiert. Du hast eine Öffnung.`, options:[{t:'Durch die Öffnung stürmen',next:'throneRoom'},{t:'Weiter schleichen',next:'throneRoom'}], e:['useFire']},

    throneRoom: {text: `Im Thronsaal steht er: der Cyborg-Wolf, Metallplatten, rote Sensoren. Er bewacht deine Eltern. Dies ist die letzte Herausforderung.`, options:[{t:'Direkt angreifen',next:'finalFight'},{t:'Versuchen, seinen Rücken zu erreichen (Schlüssel/Stealth hilft)',next:'finalFight'}]},

    finalFight: {text: `Der Kampf beginnt. Deine Entscheidungen zuvor beeinflussen den Ausgang.`, options:[{t:'Kampf beenden',next:'ending'}]},

    ending: {text: `Bereit für das Ende.`, options:[{t:'Siehe Ergebnis',next:null}]}
  }

  function applyEffects(effects){
    if(!effects) return
    effects.forEach(e=>{
      if(e==='gainKey') state.hasKey = true
      if(e==='useFire') state.usedFire = (state.usedFire||0) + 1
      if(e==='defeatWolf') state.wolvesDefeated = (state.wolvesDefeated||0) + 1
      if(e==='gotTorch') state.gotTorch = true
      if(e==='tired') state.tired = (state.tired||0) + 1
      if(e==='confident') state.confident = true
      if(e==='scare') state.scared = true
    })
  }

  function showNode(id){
    if(!id){ // ending
      showEnding();
      return
    }
    const node = nodes[id]
    if(!node) return
    let text = node.text.replace('{name}', state.name)
    sceneText.textContent = text
    options.innerHTML=''
    // Filter options by condition if present
    (node.options||[]).forEach(opt=>{
      if(opt.cond){
        if(opt.cond==='gainKey' && !state.hasKey) return
        if(opt.cond==='gotTorch' && !state.gotTorch) return
      }
      const btn = document.createElement('button')
      btn.textContent = opt.t
      btn.addEventListener('click', ()=>{
        state.decisionCount = (state.decisionCount||0) + 1
        if(opt.e) applyEffects(Array.isArray(opt.e)?opt.e:[opt.e])
        if(node === nodes.finalFight && state.decisionCount >= 10){
          // proceed to ending
          showEnding();
          return
        }
        // if we hit the global limit of decisions, finish
        if(state.decisionCount >= 10){
          showEnding();
          return
        }
        showNode(opt.next)
        renderStatus()
      })
      options.appendChild(btn)
    })
  }

  function renderStatus(){
    const parts = []
    parts.push(`Entscheidungen: ${state.decisionCount||0}/10`)
    if(state.hasKey) parts.push('Schlüssel: Ja')
    if(state.gotTorch) parts.push('Fackel: Ja')
    if(state.wolvesDefeated) parts.push(`Wölfe besiegt: ${state.wolvesDefeated}`)
    status.textContent = parts.join(' • ')
  }

  function showEnding(){
    game.classList.add('hidden')
    endSec.classList.remove('hidden')
    // Determine result
    const usedFire = state.usedFire||0
    const wolves = state.wolvesDefeated||0
    const key = !!state.hasKey
    let text = ''

    // simple outcome decision
    if((key && usedFire>0) || (wolves>=3) || (usedFire>=3)){
      text += `Triumph! ${state.name} kämpft mit Flammenkraft und List und besiegt den Cyborg-Wolf. Deine Eltern werden befreit. Das Schloss stürzt nicht ein, aber die Wölfe ziehen sich zurück.`
    } else if((key && usedFire===0) || (wolves>=1 && usedFire>0)){
      text += `${state.name} schafft es, den Cyborg-Wolf zu schwächen. Nach einem harten Kampf können die Eltern befreit werden, aber der Weg bleibt schwer.`
    } else {
      text += `Das Ende ist bitter. Ohne ausreichende Vorbereitungen war der Cyborg-Wolf zu stark. Du überlebst knapp und musst dich zurückziehen — doch die Hoffnung bleibt.`
    }

    text += `\n\n(Statistik) Entscheidungen: ${state.decisionCount||0} • Wölfe besiegt: ${wolves} • Feuer verwendet: ${usedFire} • Schlüssel: ${key?'Ja':'Nein'}`
    endText.textContent = text
  }

  startBtn.addEventListener('click', ()=>{
    const name = (nameInput.value||'Florian').trim() || 'Florian'
    state = {name, decisionCount:0, hasKey:false, usedFire:0, wolvesDefeated:0}
    intro.classList.add('hidden')
    endSec.classList.add('hidden')
    game.classList.remove('hidden')
    renderStatus()
    showNode('start')
  })

  restart.addEventListener('click', ()=>{
    intro.classList.remove('hidden')
    game.classList.add('hidden')
    endSec.classList.add('hidden')
    nameInput.value = ''
  })

  // small accessibility: start with Enter on input
  nameInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') startBtn.click() })

})()
