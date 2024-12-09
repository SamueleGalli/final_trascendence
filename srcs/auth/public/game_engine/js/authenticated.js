
// Funzione per configurare l'avatar
export function configureAvatar(success) {
    // Ottieni gli elementi
    const avatarContainer = document.querySelector('.avatar-container');
    const newButtonsContainer = document.getElementById('newButtonsContainer');    
    const avatarImage = document.getElementById('avatarImage'); // Ottieni l'elemento dell'avatar
    
    // Funzione per mostrare l'avatar
    function showAvatar() {
        avatarContainer.style.display = 'flex'; // Mostra l'avatar
    }
    
    // Funzione per nascondere l'avatar
    function hideAvatar() {
        avatarContainer.style.display = 'none'; // Nascondi l'avatar
    }
    
    // Controlla se il contenitore con i pulsanti è visibile
    function checkButtonsVisibility() {
        if (success)
            avatarImage.src = 'game_engine/images/rbakhaye.jpg';
        if (!newButtonsContainer.classList.contains('hidden')) {
            showAvatar(); // Mostra l'avatar se i pulsanti sono visibili
        } else {
            hideAvatar(); // Nascondi l'avatar se i pulsanti non sono visibili
        }
    }
    
    // Ascolta le modifiche nella classe "hidden" sul contenitore con i pulsanti
    newButtonsContainer.addEventListener('transitionend', checkButtonsVisibility);
    
    // Inizialmente, controlla se i pulsanti sono visibili
    checkButtonsVisibility();

    // Aggiungi un listener per il clic sull'immagine dell'avatar
    avatarImage.addEventListener('click', function() {
        const menu = document.querySelector('.menu-container');
        menu.classList.toggle('visible'); // Cambia la visibilità del menu
    });
}