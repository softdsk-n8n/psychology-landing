let contentData = null;

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    document.getElementById('btnLoad').addEventListener('click', loadData);
    document.getElementById('btnSave').addEventListener('click', saveData);
});

async function loadData() {
    const container = document.getElementById('editorContainer');
    container.innerHTML = '<div class="loader">Loading content...</div>';

    try {
        const res = await fetch('../content/content.json');
        if (!res.ok) throw new Error('Failed to load. Make sure you are running via local server.');

        // Create a deep copy
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

                // Simple heuristic: if string is long or contains HTML tags, use textarea
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

                // Update rootData on input
                input.addEventListener('input', (e) => {
                    updateDataByPath(rootData, [...path, key], e.target.value);
                });

                group.appendChild(label);
                group.appendChild(input);
                container.appendChild(group);
            } else {
                // Nested object or array
                const group = document.createElement('div');
                group.className = 'form-group';

                const label = document.createElement('label');
                label.innerText = key;
                label.style.fontWeight = 'bold';
                label.style.fontSize = '1.1rem';
                label.style.marginTop = '1rem';
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

function saveData() {
    if (!contentData) return;

    const jsonStr = JSON.stringify(contentData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    a.click();

    URL.revokeObjectURL(url);

    alert('Файл збережено! Будь ласка, замініть існуючий файл /content/content.json новим.');
}
