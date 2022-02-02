const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = {
  all: async (req, res) => {
    const users = await User.find().populate('comments');

    res.send(users);
  },
  register: async (req, res) => {
    try {
      let user = await User.findOne({ email: req.body.email })
      if (user) {
        throw new Error('This email is already taken!');
      }

      // tuka pravime enkripcija na password-ot so koristenje na bcrypt module-ot
      req.body.password = bcrypt.hashSync(req.body.password);
      user = await User.create(req.body);

      res.send({
        error: false,
        message: 'New user record created!',
        user: user
      });
    } catch (error) {
      res.send({
        error: true,
        message: error.message
      });
    }
  },
  login: async (req, res) => {
    try {
      /**
       * Problem: Dali postoi korisnik so dadeni email i password
       * 1. Proveruvame po email
       * 1.1. Ako toj email ne postoi, frli greska
       * 1.2. Ako toj email postoi, prodolzi ponatamu (ne pravi nisto)
       * ..
       * do 2 stigame samo preku 1.2.
       * ..
       * 2. Proveruvame po password
       * 2.1. Password-ot na korisnikot koj sme go nasle pri cekor 1 ne se sovpagja so password-ot od request-ot
       *      i vrakjame greska
       * 2.2. Password-ite se sovpagjaat, znaci prodolzi ponatamu (ne pravi nisto)
       */

      const user = await User.findOne({ email: req.body.email });

      // Negative checks
      if (!user) {
        throw new Error('Invalid credentials');
      }

      if (!bcrypt.compareSync(req.body.password, user.password)) {
        throw new Error('Invalid credentials');
      }

      // dali dokolku kodot stigne so izvrsuvanje na ovaa linija mozeme
      // da bideme sigurni deka postoi korisnik so dadenite email i pass

      /**
       * Da, mozeme da bideme sigurni, zatoa sto ako ne postoel korisnik so dadeniot email, programata
       * kje zavrsela na linija 49, i ako password-ot na toj korisnik ne bil ist so dadeniot password,
       * programata kje zavrsela na linija 53.
       */

      // JWT Auth: JSON Web Token Authentication

      /**
       * 1. Treba da go enkodirame id-to i email na korisnikot i vreme na istekuvanje na tokenot vo samiot token
       */
      const payload = {
        id: user._id,
        email: user.email
      }
      // payload ---enkripcija---> jwt token ----dekripcija---> payload
      const token = jwt.sign(payload, process.env.AUTH_SECRET, {
        expiresIn: '50m'
      });

      res.send({
        error: false,
        message: 'User logged in',
        token: token
      });
    } catch (error) {
      res.send({
        error: true,
        message: error.message
      });
    }
  }
}

/** ENV files
 * Files koi vo sebe imaat environment variables
 */