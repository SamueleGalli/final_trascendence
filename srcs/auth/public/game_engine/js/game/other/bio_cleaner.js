export function show_full_bio(bio, showBioBtn)
{
    const formattedBio = bio.replace(/\\n/g, '<br>').replace(/[\n'"']/g, '').trim();
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = "#09a09b";
    popup.style.fontFamily = "'Liberty', sans-serif";
    popup.style.borderRadius = '8px';
    popup.style.zIndex = '9999';
    popup.style.maxWidth = '80%'; 
    popup.style.maxHeight = '80%'; 
    popup.style.overflowY = 'auto';
    popup.innerHTML = `<p style="text-indent: 20px;">${formattedBio}</p>`;
    function closePopup() {
        popup.remove();
        document.removeEventListener('click', outsideClickListener);
    }
    function outsideClickListener(event) {
        if (!popup.contains(event.target) && event.target !== showBioBtn) {
            closePopup();
        }
    }
    showBioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.body.appendChild(popup);
        document.addEventListener('click', outsideClickListener);
    });
}
