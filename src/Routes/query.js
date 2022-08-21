import { Router } from 'express'
import { users, groups } from '../DB.js'

export const queryRouter = Router()

queryRouter.get("/:table/:limit/:chars", async (req, res) => {
    req.params.chars = req.params.chars.toString()
    const queryTable = req.params.table == "users" ? Object.values(users.data) : req.params.table == "groups" ?  Object.values(groups.data) : undefined
    if (queryTable == undefined)
        return res.status(400).json({ message: "Invalid query" })
        
    if (isNaN(req.params.limit) || req.params.limit < 0)
        return res.status(400).json({ message: "Limit is not a number or is negative" })

    if (req.params.limit > queryTable.length)
        req.params.limit = queryTable.length

    let query = []
    queryTable.forEach(item => {
        if (item.name.indexOf(req.params.chars) != -1) {
            query.push(item.isPrivate ? 
            { id: item.id, name: item.name, creationDate: item.creationDate } 
            : 
            { id: item.id, name: item.name, creationDate: item.creationDate, inviteToken: item.inviteToken, groups: item.groups && Object.keys(item.groups).map(groupID => ({ name: groups.data[groupID].name, creationDate: groups.data[groupID].creationDate })), members: item.members && Object.values(item.members) })
        }
    })
    if (query.length <= 0)
        return res.status(404).json({ message: "Query data not found" })
    
    res.status(200).json({ message: "Success", query: query.slice(0, req.params.limit), remaining: Math.max(0, query.length - req.params.limit) })
})