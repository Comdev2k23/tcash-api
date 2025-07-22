import { sql } from "../config/db.js";

export async function addNotes(req, res, next){
    try {
        const {userId} = req.params
        const {content, is_done } = req.body

       //Get user info
        const [user] = await sql `
            SELECT * FROM users WHERE user_id = ${userId}
        `
        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        if(!content || typeof !is_done !== 'boolean'){
            return res.status(404).json({message: "Required all fields"})
        }

        await sql`
            INSERT INTO notes (user_id, content, is_done)
            VALUES (${userId}, ${content}, ${is_done})
        `
        res.status(201).json({message: "Note has been saved"})
    } catch (error) {
        console.log('Error: Internal Server Error', error)
        next(error)
    }
}

export async function getNotes(req, res, next){
    try {
        const {userId} = req.params

        if(!userId) {
            return res.status(404).json({message: 'User not found'})
        }

        const results = await sql`
            SELECT * FROM notes WHERE user_id = ${userId}
            ORDER BY created_at DESC
        `

        res.status(200).json(results)

    } catch (error) {
        console.log('Error: Internal Server Error', error)
        next(error)
    }
}

export async function deleteNotesById (req, res, next) {
    try {
        const {id} = req.params

        // Validate ID exists and is a positive integer
        if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({ message: 'Valid notes ID is required' });
        }

       const result = await sql `
            DELETE FROM notes WHERE id = ${id}
            RETURNING *
        `
        if(result.length === 0){
            return res.status(404).json({
                message: "Note not found"
            })
        }

        res.status(200).json({
            message: 'Notes has been deleted', 
        deletedNotes: result[0]})
        
    } catch (error) {
        console.log('Error: Internal server error', error)
        next(error)
    }
}