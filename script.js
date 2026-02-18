// Vollständiges Textadventure (Deutsch)
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

  // Knoten des Abenteuers
  const nodes = {
    start: {
      text: `Du bist {name}, ein Jugendlicher mit der seltenen Gabe, Feuer aus deinen Händen zu schießen. In einer stürmischen Nacht griffen die Wolfsrudel das Dorf an. Du wurdest getrennt — deine Eltern wurden von den Wölfen ins ferne Schloss verschleppt. Nun stehst du am Waldrand, die Luft riecht nach Rauch und nassen Blättern. Du hast ein Ziel: das Schloss erreichen, deine Eltern befreien und den Cyborg-Wolf besiegen.`,
      options:[{t:'Aufbruch in den Wald',next:'entrance'}]
    },

    entrance: {
      text: `Der Pfad teilt sich. Rechts führt ein schmaler, dunkler Weg direkt durch den Wald; links plätschert ein Fluss und bietet Deckung. Beide Wege haben ihre Risiken.`,
      options:[
        {t:'Durch den Wald (schneller, riskant)',next:'wolfPatrol'},
        {t:'Dem Fluss folgen (langsamer, sicherer)',next:'fishingHut'}
      ]
    },

    wolfPatrol: {
      text: `Du bewegst dich vorsichtig, als hinter einem umgestürzten Baum plötzlich mehrere Wölfe auftauchen. Ihre Augen glühen im Halbdunkel. Du kannst kämpfen oder leise versuchen, vorbei zu schleichen.`,
      options:[
        {t:'Feuer einsetzen und angreifen',next:'afterPatrol',e:['useFire','defeatWolf']},
        {t:'Schleichen versuchen',next:'sneakPast'}
      ]
    },

    sneakPast: {
      text: `Du hältst den Atem an und schleichst zwischen den Felsen hindurch. Ein Jungwolf bemerkt dich und fängt an zu bellen — du rennst los und entkommst knapp. Du bist erschöpft, hast jedoch Zeit verloren.`,
      options:[{t:'Trotzdem zum Schloss weiter',next:'ruins'},{t:'Am Fluss ausruhen',next:'fishingHut'}],
      e:['scare']
    },

    afterPatrol: {
      text: `Deine Flammen brechen aus und vertreiben die Wölfe. Du verbrennst einige Dornen und hinterlässt eine Spur aus Glut. Das Singen in deinen Händen fühlt sich stärker an.`,
      options:[{t:'Weiter Richtung Schloss',next:'ruins'},{t:'Den Fluss suchen und verschnaufen',next:'fishingHut'}],
      e:['confident']
    },

    fishingHut: {
      text: `Am Fluss liegt eine kleine, halb zerfallene Hütte. Im Inneren findest du eine alte Laterne, einen rostigen Schlüssel und ein Bündel mit Brotkrumen. Etwas hier fühlt sich vertraut an.`,
      options:[
        {t:'Nimm den Schlüssel',next:'gotKey',e:['gainKey']},
        {t:'Nimm die Laterne',next:'gotTorch',e:['gotTorch']},
        {t:'Nur kurz rasten',next:'restAtHut'}
      ]
    },

    restAtHut: {
      text: `Du ruhst kurz aus. Die Ruhe gibt dir Kraft, aber die Zeit läuft. Im fernen Wald hörst du Hundeheulen.`,
      options:[{t:'Weiter zum Schloss',next:'ruins'},{t:'Doch noch etwas suchen',next:'searchHut'}],
      e:['rest']
    },

    gotKey: {
      text: `Der Schlüssel ist schwer, aber stabil. Vielleicht passt er an einem der Schlösser im Schloss.`,
      options:[{t:'Zum Schloss aufbrechen',next:'ruins'},{t:'Die Hütte genauer durchsuchen',next:'searchHut'}]
    },

    gotTorch: {
      text: `Die Laterne brennt ruhig und wird dir helfen, dunkle Gänge zu erhellen — falls du Brennmaterial findest.`,
      options:[{t:'Weiter zum Schloss',next:'ruins'},{t:'Suche nach Brennmaterial',next:'searchHut'}]
    },

    searchHut: {
      text: `Du findest etwas Tuch und alte Seile. Nichts, was sofort nützlich aussieht, aber vielleicht improvisierbar.`,
      options:[{t:'Aufbrechen zum Schloss',next:'ruins'}],
      e:['foundRags']
    },

    ruins: {
      text: `Vor dem Schloss erstrecken sich verfallene Vorwerke und zerbrochene Statuen. Kleine Rudel patrouillieren hier, doch es gibt auch einen schmalen Pfad zur Rückseite des Schlosses.`,
      options:[{t:'Rudelkampf wagen',next:'fightRudels',e:['defeatWolf']},{t:'Um die Ruinen herum schleichen',next:'aroundRuins'}]
    },

    fightRudels: {
      text: `Du stellst dich den Wölfen. Dein Feuer erhellt die Nacht und treibt sie zurück, doch du erschöpfst dich dabei. Einige Wölfe sind besiegt, andere fliehen, um Verstärkung zu holen.`,
      options:[{t:'Weiter zum Haupteingang',next:'castleGate'},{t:'Nach einem geheimen Pfad suchen',next:'aroundRuins'}],
      e:['tired','defeatWolf']
    },

    aroundRuins: {
      text: `Im Schatten der Ruinen findest du einen schmalen Durchgang, der zur Rückseite des Schlosses führt — dort soll eine Kellertür sein.`,
      options:[{t:'Dem Pfad folgen',next:'backGate'},{t:'Zum Haupteingang gehen',next:'castleGate'}]
    },

    castleGate: {
      text: `Das Haupttor ist massiv und von Wolfswachen bewacht. Auf den Zinnen patrouillieren mehrere Figuren. Ein direkter Angriff wäre tödlich ohne Plan.`,
      options:[
        {t:'Schlüssel verwenden (falls vorhanden)',next:'gateOpen',cond:'gainKey'},
        {t:'Wachen mit Feuer ablenken',next:'distractGuards',e:['useFire']},
        {t:'Geheimen Eingang suchen',next:'backGate'}
      ]
    },

    backGate: {
      text: `Hinter dem Schloss liegt eine kleine Kellertür, halb verdeckt von Efeu. Sie scheint verschlossen, aber der Schlüssel könnte passen.`,
      options:[
        {t:'Mit Gewalt öffnen',next:'breakDoor',e:['tired']},
        {t:'Schlüssel benutzen (falls du ihn hast)',next:'gateOpen',cond:'gainKey'},
        {t:'Fackel benutzen, um besser sehen zu können',next:'darkCorridor',cond:'gotTorch'}
      ]
    },

    breakDoor: {
      text: `Mit letzter Kraft rammt du die Tür — sie knarrt auf. Ein kalter Luftstrom schlägt dir entgegen. Du spürst die Erschöpfung.`,
      options:[{t:'Vorsichtig eintreten',next:'darkCorridor'}],
      e:['tired']
    },

    gateOpen: {
      text: `Der Schlüssel passt. Du öffnest eine kleine Seitentür, die in einen alten Versorgungsbereich führt. Der Geruch von Öl und Metall hängt in der Luft — gut, du bist im Inneren des Schlosses.`,
      options:[{t:'Leise weiter in Richtung Thronsaal',next:'darkCorridor'},{t:'Kurz verschnaufen und Plan machen',next:'planBeforeThrone'}]
    },

    planBeforeThrone: {
      text: `Du sammelst deine Gedanken. Der Schlüssel hat dir einen Vorteil verschafft. Wenn du vorsichtig bist, kannst du den Cyborg-Wolf überraschen.`,
      options:[{t:'Weiter zum Thronsaal',next:'darkCorridor'},{t:'Zuerst nach Vorräten suchen',next:'searchSupplies'}]
    },

    searchSupplies: {
      text: `In einem Lagerraum findest du etwas Öl und Stoff — nützlich, um eine improvisierte Fackel zu bauen. Vielleicht kannst du so dunkle Sensoren stören.`,
      options:[{t:'Weiter zum Thronsaal',next:'darkCorridor'}],
      e:['foundSupplies']
    },

    darkCorridor: {
      text: `Die Treppe führt dich hinauf in leere Hallen. Überall liegen Spuren von Kampf und Metall. Irgendwo weiter vorn ist der Thronsaal — und dein Ziel.`,
      options:[{t:'Leise weiterschleichen',next:'throneRoom'},{t:'Mit Feuer einen Sturmlauf machen',next:'throneRoom',e:['useFire']}] 
    },

    distractGuards: {
      text: `Du entfachst ein Feuersignal. Einige Wachen stürmen zur Quelle des Lichts, andere sind alarmiert, aber eine Lücke entsteht — genug, um in das Schloss vorzudringen.`,
      options:[{t:'Jetzt hineinstürmen',next:'throneRoom'},{t:'Langsam und leise vorgehen',next:'throneRoom'}],
      e:['useFire']
    },

    throneRoom: {
      text: `Der Thronsaal ist riesig und düster. In der Mitte sitzt der Cyborg-Wolf auf einem mechanischen Thron. Deine Eltern sind gefesselt neben dem Thron. Seine Sensoren leuchten rot — er ist bereit.`,
      options:[{t:'Direkt angreifen',next:'finalFight'},{t:'Versuche, seine Schwachstelle zu finden (Rücken / Sensoren)',next:'finalFight'}]
    },

    finalFight: {
      text: `Der Kampf ist intensiv. Die Entscheidungen, die du getroffen hast — Schlüssel, Feuer, Vorräte, Müdigkeit — beeinflussen, wie der Kampf ausgeht.`,
      options:[
        {t:'Alles geben (Risiko)',next:'ending',e:['useFire','finalStrike']},
        {t:'Sicherer, gezielter Angriff',next:'ending',e:['finalStrike']}
      ]
    },

    ending: {
      text: `Das Schicksal entscheidet...`,
      options:[{t:'Ergebnis anzeigen',next:null}]
    }
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
      if(e==='foundRags') state.rags = true
      if(e==='foundSupplies') state.supplies = true
      if(e==='finalStrike') state.finalStrike = (state.finalStrike||0) + 1
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
    ;(node.options||[]).forEach(opt=>{
      if(opt.cond){
        if(opt.cond==='gainKey' && !state.hasKey) return
        if(opt.cond==='gotTorch' && !state.gotTorch) return
      }
      const btn = document.createElement('button')
      btn.textContent = opt.t
      btn.addEventListener('click', ()=>{
        state.decisionCount = (state.decisionCount||0) + 1
        if(opt.e) applyEffects(Array.isArray(opt.e)?opt.e:[opt.e])
        // global limit: nach 10 Entscheidungen endet das Spiel
        if(state.decisionCount >= 10){
          showEnding()
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
    if(state.gotTorch) parts.push('Laterne: Ja')
    if(state.wolvesDefeated) parts.push(`Wölfe besiegt: ${state.wolvesDefeated}`)
    if(state.tired) parts.push(`Erschöpfung: ${state.tired}`)
    status.textContent = parts.join(' • ')
  }

  function showEnding(){
    // Hide game UI
    game.classList.add('hidden')
    endSec.classList.remove('hidden')

    const usedFire = state.usedFire||0
    const wolves = state.wolvesDefeated||0
    const key = !!state.hasKey
    const supplies = !!state.supplies
    const tired = state.tired||0
    const finalStr = state.finalStrike||0

    let result = ''

    // Conditions for different endings
    if(finalStr > 0 && (usedFire >= 2 || (key && supplies)) && tired < 3){
      result = `Triumph! ${state.name} entfesselt all seine Kraft. Mit Feuer, List und dem gefundenen Schlüssel gelingt es, den Cyborg-Wolf zu überwältigen. Deine Eltern sind gerettet. Die Wölfe ziehen sich zurück – das Schloss bleibt stehen. Ein neuer Morgen beginnt.`
    } else if((usedFire > 0 && wolves >=2) || (key && usedFire>0)){
      result = `${state.name} kämpft heldenhaft. Der Cyborg-Wolf wird schwer verwundet; die Eltern werden befreit, aber das Schloss ist beschädigt. Ihr Rückzug ist schwer — doch ihr überlebt.`
    } else if(tired >=3 && !supplies){
      result = `Erschöpft und ohne ausreichende Vorbereitung gelingt es nicht, den Cyborg-Wolf endgültig zu besiegen. Du rettest vielleicht einen Elternteil, musst dich aber zurückziehen. Hoffnung bleibt, doch der Preis war groß.`
    } else {
      result = `Das Schicksal war ungünstig. Ohne die nötigen Ressourcen war der Cyborg-Wolf eine zu große Herausforderung. Du überlebst knapp und musst die Mission abbrechen. Doch vielleicht ist dies nur der Anfang deiner Geschichte.`
    }

    result += `\n\n(Statistik) Entscheidungen: ${state.decisionCount||0} • Wölfe besiegt: ${wolves} • Feuer verwendet: ${usedFire} • Schlüssel: ${key?'Ja':'Nein'} • Erschöpfung: ${tired}`

    endText.textContent = result
  }

  startBtn.addEventListener('click', ()=>{
    const name = (nameInput.value||'Florian').trim() || 'Florian'
    state = {name, decisionCount:0, hasKey:false, usedFire:0, wolvesDefeated:0, tired:0}
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

  // accessibility: Enter starts the game
  nameInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') startBtn.click() })

})()
