const db = require('../db/db')
const pg = require('pg')

const User = {
  create: (name, email, passwordDigest) => {
    const sql = `
      INSERT INTO users(name, email, password_digest)
      VALUES ($1, $2, $3)
      RETURNING *
    `

    return db
      .query(sql, [name, email, passwordDigest])
      .then(dbRes => {
        return { id: dbRes.rows[0].id, name: dbRes.rows[0].name }
      })
  },

  findByEmail: email => {
    const sql = `
      SELECT * FROM users
      WHERE email = $1
    `

    return db
      .query(sql, [email])
      .then(dbRes => dbRes.rows[0])
  },

  findById: id => {
    const sql = `
    SELECT * FROM users
    WHERE id =$1
    `
    
    return db
        .query(sql, [id])
      .then(dbRes => {
        return { id: dbRes.rows[0].id, name: dbRes.rows[0].name }
      })
  },

  getFavorites: id => {
    const sql = `
      SELECT objectId FROM favorites
      WHERE userId = $1
    `
    return db
      .query(sql, [id])
      .then(dbRes => dbRes.rows.map(r => r.objectid))
  },

  addFavorite: (userId, objId) => {
    const select = `
      SELECT COUNT(objectid) FROM favorites
      WHERE userid = $1 AND objectid = $2
    `

    const insert = `
      INSERT INTO favorites (userid, objectid) VALUES ($1, $2)
    `

    const del = `
      DELETE FROM favorites WHERE userid = $1 AND objectid = $2
    `

    db.query(select, [userId, objId]).then(dbRes => {
      if (dbRes.rows[0].count === '0') {
        db.query(insert, [userId, objId])
      } else {
        db.query(del, [userId, objId])
      }
    })
  }
}

module.exports = User