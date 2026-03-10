let contentData = null;

// Хардкодний логін і пароль для тесту на GitHub Pages
const TEST_CREDS = {
    username: 'admin',
    password: 'password123'
};

document.addEventListener('DOMContentLoaded', () => {
    // Перевіряємо, чи вже залогінені (через sessionStorage)
    if (sessionStorage.getItem('tinyCmsLoggedIn') === 'true') {
        showAdmin();
    }

    // Обробка форми логіну
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('loginUsername').value;
        const pass = document.getElementById('loginPassword').value;
        const errorEl = document.getElementById('loginError');

        if (user === TEST_CREDS.username && pass === TEST_CREDS.password) {
            sessionStorage.setItem('tinyCmsLoggedIn', 'true');
            errorEl.innerText = '';
            showAdmin();
        } else {
            errorEl.innerText = 'Невірний логін або пароль';
        }
    });

    // Кнопки адмінки
    document.getElementById('btnLoad').addEventListener('click', loadData);
    document.getElementById('btnSave').addEventListener('click', saveData);
    document.getElementById('btnLogout').addEventListener('click', () => {
        sessionStorage.removeItem('tinyCmsLoggedIn');
        hideAdmin();
    });
});

function showAdmin() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'block';
    loadData();
}

function hideAdmin() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('adminContainer').style.display = 'none';
    document.getElementById('loginForm').reset();
}

async function loadData() {
    const container = document.getElementById('editorContainer');
    container.innerHTML = '<div class="loader">Loading content...</div>';

    try {
        const res = await fetch('../content/content.json');
        if (!res.ok) throw new Error('Помилка завантаження файлу.');

        // Зберігаємо глибоку копію
        contentData = await res.json();
        renderEditor(contentData, container);
    } catch (err) {
        container.innerHTML = `<div style="color:red; padding:2rem;">Error: ${err.message}</div>`;
    }
}

function renderEditor(data, container) {
    container.innerHTML = '';

    for (const [sectionKey, sectionObj] of Object.entries(data)) {
        const sectionEl = document.createElement('div');
        sectionEl.className = 'editor-section';
        sectionEl.innerHTML = `<h2>${sectionKey}</h2>`;

        renderNode(sectionObj, sectionEl, data, [sectionKey]);

        container.appendChild(sectionEl);
    }
}

function renderNode(node, container, rootData, path) {
    if (Array.isArray(node)) {
        const arrContainer = document.createElement('div');
        arrContainer.className = 'array-container';

        node.forEach((item, index) => {
            const itemContainer = document.createElement('div');
            itemContainer.className = 'array-item';
            itemContainer.innerHTML = `<h3>Item ${index + 1}</h3>`;
            renderNode(item, itemContainer, rootData, [...path, index]);
            arrContainer.appendChild(itemContainer);
        });

        container.appendChild(arrContainer);
    } else if (typeof node === 'object' && node !== null) {
        for (const [key, val] of Object.entries(node)) {
            if (typeof val === 'string') {
                const group = document.createElement('div');
                group.className = 'form-group';

                const label = document.createElement('label');
                label.innerText = key;

                const isLong = val.length > 60 || val.includes('<') || val.includes('\\n');

                let input;
                if (isLong) {
                    input = document.createElement('textarea');
                    input.className = 'form-control';
                    input.value = val;
                } else {
                    input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'form-control';
                    input.value = val;
                }

                input.addEventListener('input', (e) => {
                    updateDataByPath(rootData, [...path, key], e.target.value);
                });

                group.appendChild(label);
                group.appendChild(input);
                container.appendChild(group);
            } else {
                const group = document.createElement('div');
                group.className = 'form-group';

                const label = document.createElement('label');
                label.innerText = key;
                label.style.fontWeight = 'bold';
                label.style.fontSize = '1.1rem';
                label.style.marginTop = '1rem';
                label.style.color = 'var(--primary)';
                group.appendChild(label);

                renderNode(val, group, rootData, [...path, key]);
                container.appendChild(group);
            }
        }
    }
}

function updateDataByPath(obj, pathArr, value) {
    let current = obj;
    for (let i = 0; i < pathArr.length - 1; i++) {
        current = current[pathArr[i]];
    }
    current[pathArr[pathArr.length - 1]] = value;
}

async function saveData() {
    if (!contentData) return;

    const btn = document.getElementById('btnSave');
    const originalText = btn.innerText;
    btn.innerText = 'Збереження...';
    btn.disabled = true;

    try {
        const response = await fetch('save.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contentData, null, 2)
        });

        const result = await response.json().catch(() => null);

        if (response.ok) {
            alert('Зміни успішно збережено на сайті!');
        } else {
            // Якщо не вийшло через save.php, фолбек на завантаження JSON як файлу (для GitHub Pages)
            fallbackSaveData();
        }
    } catch (err) {
        // Якщо сервер повернув помилку з'єднання або щось подібне (як 405 на GH Pages)
        fallbackSaveData();
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

function fallbackSaveData() {
    const jsonStr = JSON.stringify(contentData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    a.click();

    URL.revokeObjectURL(url);

    alert('Цей сервер наразі не підтримує пряме збереження (PHP). Ваш файл content.json скачався. \nБудь ласка, замініть існуючий файл в репозиторії новим.');
}
