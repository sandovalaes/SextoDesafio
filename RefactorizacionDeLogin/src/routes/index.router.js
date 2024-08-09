import { Router } from 'express';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const router = Router();

/*
router.get("/", async (req, res) => {
    try {
        console.log('inicio')
        res.render('home');
    } catch (error) {
        console.error("No se pudo renderizar la vista", error);
    }
})
*/

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

router.get('/', isAuthenticated, (req, res) => {
    res.render('home', { user: req.session.user });
});

export default router;
