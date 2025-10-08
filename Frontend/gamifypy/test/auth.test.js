import { Selector, fixture, test } from 'testcafe';

fixture('Pruebas de Login - GamifyPy')
    .page('http://localhost:5173/auth');

// Caso 1: Credenciales válidas
test('Usuario puede iniciar sesión con credenciales correctas', async t => {
    const emailInput = Selector('#email');
    const passwordInput = Selector('#password');
    const loginButton = Selector('button').withText('INICIAR SESIÓN');

    await t
        .typeText(emailInput, 'solorzanosebastian10@gmail.com')
        .typeText(passwordInput, 'Sebastian101202')
        .click(loginButton)
        .expect(Selector('body').innerText)
        .contains('Niveles', { timeout: 5000 });
});

// Caso 2: Credenciales incorrectas
test('Muestra alerta de error al ingresar credenciales inválidas', async t => {
    const emailInput = Selector('#email');
    const passwordInput = Selector('#password');
    const loginButton = Selector('button').withText('INICIAR SESIÓN');
    const errorAlert = Selector('div').withText('Error al iniciar sesión');

    await t
        .typeText(emailInput, 'solorzanosebastian10@gmail.com')
        .typeText(passwordInput, 'contrasenaIncorrecta')
        .click(loginButton)
        .expect(errorAlert.exists).ok('No se mostró el mensaje de error');
});
