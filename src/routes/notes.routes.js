import express from 'express'
import { addNotes, deleteNotesById, getNotes } from '../controllers/notes.controller.js'

const notesRouter = express.Router()

notesRouter.get('/:userId', getNotes)
notesRouter.delete('/delete/:id', deleteNotesById)
notesRouter.post('/add-notes/:userId', addNotes)


export default notesRouter