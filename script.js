document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.toggle('dark-mode', currentTheme === 'dark');
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }

    const switchTheme = (e) => {
        const isDark = e.target.type === 'checkbox' ? e.target.checked : !document.body.classList.contains('dark-mode');
        
        if (isDark) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            toggleSwitch.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            toggleSwitch.checked = false;
        }
    };

    toggleSwitch.addEventListener('change', switchTheme, false);
    document.querySelector('.sun-icon').addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) switchTheme({ target: { checked: false } });
    });
    document.querySelector('.moon-icon').addEventListener('click', () => {
        if (!document.body.classList.contains('dark-mode')) switchTheme({ target: { checked: true } });
    });

    // Reset via Logo
    document.getElementById('logo-trigger').addEventListener('click', () => {
        document.getElementById('new-message-btn').click();
    });

    // State
    let currentData = {
        category: '',
        relationship: '',
        tone: '',
        length: '',
        context: '',
        lastMessages: []
    };

    // Supabase Config
    const SUPABASE_URL = 'https://kthywyatpbvqnnzcygfd.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0aHl3eWF0cGJ2cW5uemN5Z2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMzM0NzksImV4cCI6MjA5MDgwOTQ3OX0.eqvuXBqkOKPLOBcGwCy0HOMn_FxG2enH8q4KFYDQwhw';

    // DOM Elements
    const steps = document.querySelectorAll('.step');
    const backBtn = document.getElementById('back-btn');
    const categoryCards = document.querySelectorAll('.category-card');
    const chipGroups = document.querySelectorAll('.chips-group');
    const generateBtn = document.getElementById('generate-trigger');
    const extraContext = document.getElementById('extra-context');
    const resultsList = document.getElementById('results-list');
    const loadingText = document.getElementById('loading-text');
    const toast = document.getElementById('toast');

    // Navigation functions
    const goToStep = (stepId) => {
        steps.forEach(s => s.classList.remove('active'));
        document.getElementById(stepId).classList.add('active');
        
        // Header visibility logic: Back button only from step-config onwards
        if (stepId === 'step-categories') {
            backBtn.classList.add('hidden');
        } else {
            backBtn.classList.remove('hidden');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    backBtn.addEventListener('click', () => {
        const activeStep = document.querySelector('.step.active').id;
        if (activeStep === 'step-config') goToStep('step-categories');
        if (activeStep === 'step-results') goToStep('step-config');
    });

    // Step 1: Category Selection
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            currentData.category = card.dataset.category;
            goToStep('step-config');
        });
    });

    // Step 2: Config (Chips)
    chipGroups.forEach(group => {
        const chips = group.querySelectorAll('.chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Clear others in same group
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                
                // Save value
                let field = '';
                if (group.id === 'relation-chips') field = 'relationship';
                if (group.id === 'tone-chips') field = 'tone';
                if (group.id === 'length-chips') field = 'length';
                
                if (field) currentData[field] = chip.dataset.value;
            });
        });
    });

    // Step 2 to 3: Generate
    generateBtn.addEventListener('click', async () => {
        if (!currentData.relationship || !currentData.tone || !currentData.length) {
            alert('Por favor, selecione quem receberá a mensagem, o tom e o tamanho desejado.');
            return;
        }

        currentData.context = extraContext.value;
        goToStep('step-loading');
        
        // Start Loading Animation (Visual)
        const animationPromise = animateLoading();

        try {
            // Real Generation call
            const messages = await generateDynamicMessages(currentData);
            
            // Wait for at least one phase of animation for UX
            await animationPromise;

            currentData.lastMessages = messages; 
            renderResults(messages);
            goToStep('step-results');
        } catch (error) {
            console.error("Erro na geração:", error);
            alert("Oops! Tivemos um probleminha para gerar suas mensagens. Verifique sua conexão ou tente novamente em instantes.");
            goToStep('step-config');
        }
    });

    // Loading Animation Logic
    const animateLoading = async () => {
        const phases = [
            "A redigir a primeira...",
            "Injetando criatividade...",
            "Gerando uma nova opção com o tom perfeito...",
            "Quase lá..."
        ];

        for (const phase of phases) {
            loadingText.innerText = phase;
            await new Promise(r => setTimeout(r, 1200));
        }
    };

    // Step 4: Results Logic
    const renderResults = (messages) => {
        resultsList.innerHTML = '';
        messages.forEach((msg, i) => {
            const card = document.createElement('div');
            card.className = `result-card ${i === 0 ? 'highlight' : ''}`;
            card.innerHTML = `
                <div class="result-number">${i + 1}</div>
                <p class="result-text">${msg}</p>
                <div class="card-actions">
                    <button class="action-btn btn-copy" onclick="copyResult(${i})">
                        <i class="ph ph-copy"></i> COPIAR
                    </button>
                    <button class="action-btn btn-whatsapp" onclick="shareWhatsapp(${i})">
                        <i class="ph ph-whatsapp-logo"></i> WHATSAPP
                    </button>
                </div>
            `;
            resultsList.appendChild(card);
        });
    };

    // Global action helpers
    window.copyResult = (index) => {
        const text = document.querySelectorAll('.result-text')[index].innerText;
        navigator.clipboard.writeText(text).then(() => {
            showToast('Mensagem copiada!');
        });
    };

    window.shareWhatsapp = (index) => {
        const text = document.querySelectorAll('.result-text')[index].innerText;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const showToast = (msg) => {
        toast.innerText = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    // Reset buttons
    document.getElementById('new-suggestions-btn').addEventListener('click', () => {
        generateBtn.click(); // Re-trigger generation
    });

    document.getElementById('new-message-btn').addEventListener('click', () => {
        currentData = { category: '', relationship: '', tone: '', length: '', context: '', lastMessages: [] };
        extraContext.value = '';
        chipGroups.forEach(g => g.querySelectorAll('.chip').forEach(c => c.classList.remove('active')));
        goToStep('step-categories');
    });

    // --- Real AI Integration ---
    const generateDynamicMessages = async (data) => {
        try {
            const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'apikey': SUPABASE_ANON_KEY
                },
                body: JSON.stringify({
                    category: data.category,
                    relationship: data.relationship,
                    tone: data.tone,
                    length: data.length,
                    context: data.context
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Erro na chamada da função.');
            }

            const result = await response.json();
            return result.messages || [];
        } catch (error) {
            throw error;
        }
    };
});
