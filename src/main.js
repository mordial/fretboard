import { draw, clicked } from './canvas'
import loadPreset from './presets'

let maxFrets = 35

export const notes = {
    sharps: [ 'a', 'a#', 'b', 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#' ],
    flats:  [ 'a', 'bb', 'b', 'c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab' ]
}

let data = {
    startFret: undefined, 
      endFret: undefined, 
  accidentals: undefined, 
      strings: []
}

window.onload = function() 
{
    registerEventListeners() 
    gatherParameters() 
}


function registerEventListeners() 
{
    [ ...document.getElementsByTagName( 'input' ) ].forEach( 
        input => 
        {
            if( input.id === 'scale-input' ) { 
                input.onchange = function() {
                    loadPreset( data )
                }
            } else {
                input.onchange = gatherParameters
            }
        }
    )

    document.getElementById( 'fretboard' ).onclick = function( event ) 
    { 
        clicked( event, data, false  ) 
    }

    document.getElementById( 'fretboard' ).addEventListener('contextmenu', 
        function( event ) 
        {
            event.preventDefault() 
            clicked( event, data, true ) 
        }, 
        false
    )

    window.addEventListener( 'resize', gatherParameters )

    document.getElementById( 'clear'    ).onclick = clearFretboard
    document.getElementById( 'download' ).onclick = downloadFretboard
}


export function gatherParameters()
{
    let inputs = {
              frets: document.getElementById( 'frets-input' ),
             tuning: document.getElementById( 'tuning-input' ),
        accidentals: document.querySelector( 'input[name="accidentals"]:checked' )
    }

    data.tuning = inputs.tuning.value
        .replace( /\s/g, '' )
        .toLowerCase() 
        .split( ',' )
        .reverse() 

    let frets = inputs.frets.value
        .replace( /\s/g, '' ) 
        .split( '-' )

    data.startFret = parseInt( frets[ 0 ] )
    data.endFret   = parseInt( frets[ 1 ] )

    if( isNaN( data.startFret ) || isNaN( data.endFret ) ) 
    {
        data.startFret = 0
        data.endFret   = 24
    }

    data.startFret = data.startFret >= data.endFret ? 0 : data.startFret
    data.endFret   = data.endFret > maxFrets ? maxFrets : data.endFret 

    inputs.frets.value = data.startFret + '-' + data.endFret

    data.accidentals = inputs.accidentals.value 

    if( !checkAccidentals() ) { /* Invalid tuning */ }   

    buildStrings() 
}


function buildStrings( ) 
{
    for( let x in data.tuning ) 
    {
        if( !data.strings[ x ] ) data.strings[ x ] = { selected: [] } 
        data.strings[ x ].pitch = data.tuning[ x ]    
    }
    for( let x in data.strings ) 
    {
        if( x >= data.tuning.length ) {
            data.strings.splice( x, 1 )
            continue
        }
        for( let y in data.strings[ x ].selected ) {
            if( data.strings[ x ].selected[ y ].fret > data.endFret ||
                data.strings[ x ].selected[ y ].fret < data.startFret 
            ) {
                data.strings[ x ].selected.splice( y, 1 ) 
            }
        }
    }
    draw( data ) 
}


function checkAccidentals()
{
    for( let x of data.tuning ) 
        if( !notes[ data.accidentals ].includes( x ) ) return false 
    return true 
}


function clearFretboard() 
{
    for( let x of data.strings ) x.selected = [] 
    gatherParameters() 
}


function downloadFretboard() 
{
    let link = document.createElement('a')
    link.download = 'fretboard.png'
    link.href = document.getElementById( 'fretboard' ).toDataURL()
    link.click()
}