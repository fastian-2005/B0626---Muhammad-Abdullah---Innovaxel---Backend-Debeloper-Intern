const bcrypt = require('bcrypt')

const compare = async(enteredPassword,hashedPassword) => {
    const ans = await bcrypt.compare(enteredPassword,hashedPassword)
    return ans

}

module.exports = compare