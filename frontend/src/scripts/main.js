// frontend/src/scripts/main.js

import { loadHeader } from './components/header.js'
import { loadSidebar } from './components/side_bar.js'

document.addEventListener('DOMContentLoaded', () => {
    
    // ⚠️ Тимчасово коментуємо, щоб уникнути TypeError від loadHeader
    // loadHeader(); 
    
    // ✅ loadSidebar тепер працюватиме, оскільки ID="app-container" є в HTML
    loadSidebar('app-container', '#menuTriggerBtn'); 
});