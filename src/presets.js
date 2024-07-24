import { gatherParameters, notes } from './main' 
import { colours } from './canvas'
import * as presets from '../docs/presets.json' 


export default function loadPreset( data )
{
    let input = document.getElementById( 'scale-input' ).value, root, scale 

    try {
        root  = input.split( ' ' )[ 0 ].toLowerCase().replace( /\s/g, '' ) 
        scale = input.split( ' ' )[ 1 ].toLowerCase().replace( /\s/g, '' )
    } catch ( e ) { return }

    if( !notes[ data.accidentals ].includes( root ) ) 
    {
        alert( 'Incorrect accidentals entered' )
        return 
    }
    if( Object.keys( presets ).includes( scale ) ) 
    {
        //Load them notes bro!!!
        solveFrets( data, root, presets[ scale ] ) 
    } 
    else {
        alert( 'Scale not found' ) 
    }
}


function solveFrets( data, root, intervals ) 
{
    let index = notes[ data.accidentals ].indexOf( root )

    let scaleTones = [] 

    for( let x of intervals ) {
        scaleTones.push( notes[ data.accidentals ][ index % 12 ] ) 
        index += x  
    }

    for( let x of data.strings ) x.selected = [] 

    for( let x in data.strings ) {

        index = notes[ data.accidentals ].indexOf( data.strings[ x ].pitch )

        for( let y = data.startFret; y <= data.endFret; y++ ) {

            let note = notes[ data.accidentals ][ ( y + index ) % 12 ] 

            if( scaleTones.includes( note ) ) {

                data.strings[ x ].selected.push({
                    fret: y, colour: note === root ? colours.rightClick : colours.leftClick 
                })
            } 

        } 
    }

    gatherParameters() 
}