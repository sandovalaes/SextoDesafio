import { Router } from 'express';
import User from '../../models/user.model.js';

const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password, rol } = req.body;
    try {
        const newUser = new User({ first_name, last_name, email, age, password, rol });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error al registrar usuario');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    try {
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) return res.status(404).send('Usuario no encontrado');

        if (user.password !== password) return res.status(404).send('Clave erronea.');
        
        req.session.user = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            rol: user.rol
        };
        console.log(req.session.user)
        res.redirect('/api/products/view');

    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

export default router;
