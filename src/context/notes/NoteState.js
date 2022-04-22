import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props)=>{

    const notesInitial = [

        {
            "id": "239846293872",
            "user": "alsdjflasdjf",
            "title": "My title",
            "description": "Please wake up early",
            "tag": "personal",
            "date": "today",
            "___v": 0
        },  
        {
            "id": "239846293873",
            "user": "alsdjflasdjf",
            "title": "My title1",
            "description": "Please wake up early1",
            "tag": "personal1",
            "date": "today1",
            "___v": 0
        }

    ]

    const [notes, setNotes] = useState(notesInitial)

    return (
        <NoteContext.Provider value = {{notes, setNotes}}>
            {props.children}
        </NoteContext.Provider>
    )

}

export default NoteState;