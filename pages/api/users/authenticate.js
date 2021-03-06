const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import getConfig from 'next/config';

import { apiHandler, usersRepo } from 'helpers/api';

const { serverRuntimeConfig } = getConfig();

export default apiHandler({
    post: authenticate
});

function authenticate(req, res) {
    const { username, password } = req.body;
    const user = usersRepo.find(u => u.username === username);

    // validate
    if (!(user && bcrypt.compareSync(password, user.hash))) {
        throw 'Número de usuário ou senha incorretos';
    }

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '7d' });

    // return basic user details and token
    return res.status(200).json({
        id: user.id,
        username: user.username,
        name: user.name,
        curse: user.curse,
        gender: user.gender,
        birth: user.birth,
        about: user.about,
        hobbies: user.hobbies,
        quote: user.quote,
        token
    });
}
