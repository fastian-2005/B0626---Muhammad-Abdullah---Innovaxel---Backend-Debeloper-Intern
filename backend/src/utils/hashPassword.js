const bcrypt = require('bcrypt')

const hash = async (password) => {
    const ans = await bcrypt.hash(password,10)
    return ans
}

module.exports = hash