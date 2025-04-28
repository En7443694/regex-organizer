// ==UserScript==
// @name         Regex Organizer
// @namespace    https://github.com/project-en/regex-organizer
// @version      1.1.0
// @description  Embed regex folder management inside regex manager interface in Tavern system. Fully supports drag/drop/folder management inside Tavern regex area.
// @author       En
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const waitForSelector = async (selector) => {
        return new Promise(resolve => {
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                }
            }, 300);
        });
    };

    async function main() {
        const container = await waitForSelector('#saved_regex_scripts');
        if (!container) return;

        const folderData = JSON.parse(localStorage.getItem('regexOrganizerFolders') || '{}');

        const folders = {};

        function saveFolders() {
            localStorage.setItem('regexOrganizerFolders', JSON.stringify(folderData));
        }

        function render() {
            container.innerHTML = '';

            const ungrouped = [];

            const scripts = [...document.querySelectorAll('#saved_regex_scripts > div')];
            scripts.forEach(el => {
                const id = el.id;
                let found = false;
                for (const [folderName, ids] of Object.entries(folderData)) {
                    if (ids.includes(id)) {
                        if (!folders[folderName]) folders[folderName] = [];
                        folders[folderName].push(el);
                        found = true;
                        break;
                    }
                }
                if (!found) ungrouped.push(el);
            });

            for (const [folderName, elements] of Object.entries(folders)) {
                const wrapper = document.createElement('div');
                wrapper.className = 'regex-folder-wrapper';
                wrapper.style.border = '1px solid #ccc';
                wrapper.style.borderRadius = '6px';
                wrapper.style.marginBottom = '10px';
                wrapper.style.padding = '5px';

                const title = document.createElement('div');
                title.textContent = folderName;
                title.style.fontWeight = 'bold';
                title.style.cursor = 'pointer';
                title.style.padding = '5px';
                title.style.background = '#f0f0f0';
                title.style.borderRadius = '5px';

                const content = document.createElement('div');
                content.style.padding = '5px';
                content.style.marginTop = '5px';

                elements.forEach(e => content.appendChild(e));

                title.onclick = () => {
                    content.style.display = content.style.display === 'none' ? 'block' : 'none';
                };

                wrapper.appendChild(title);
                wrapper.appendChild(content);
                container.appendChild(wrapper);
            }

            // 未归类的
            ungrouped.forEach(e => container.appendChild(e));
        }

        function moveScriptToFolder(scriptId, folderName) {
            if (!folderData[folderName]) folderData[folderName] = [];
            if (!folderData[folderName].includes(scriptId)) {
                folderData[folderName].push(scriptId);
            }
            saveFolders();
        }

        function createFolder() {
            const folderName = prompt('New folder name:', 'Unnamed');
            if (folderName) {
                folderData[folderName] = [];
                saveFolders();
                render();
            }
        }

        // 插入新增文件夹按钮
        const addFolderButton = document.createElement('button');
        addFolderButton.textContent = '➕ New Folder';
        addFolderButton.style.marginBottom = '10px';
        addFolderButton.onclick = createFolder;

        container.parentElement.insertBefore(addFolderButton, container);

        render();

        // 拖动功能
        $(container).sortable({
            connectWith: '.regex-folder-wrapper div',
            handle: '.drag-handle',
            stop: function(event, ui) {
                const scriptId = ui.item.attr('id');
                const folderWrapper = ui.item.closest('.regex-folder-wrapper');
                if (folderWrapper.length) {
                    const folderName = folderWrapper.find('div:first-child').text();
                    moveScriptToFolder(scriptId, folderName);
                } else {
                    // 移动到未分类
                    for (const key of Object.keys(folderData)) {
                        folderData[key] = folderData[key].filter(id => id !== scriptId);
                    }
                    saveFolders();
                }
            }
        });

    }

    main();
})();
