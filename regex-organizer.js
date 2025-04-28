// ==UserScript==
// @name         Regex Organizer
// @namespace    https://github.com/project-en/regex-organizer
// @version      1.0.0
// @description  Organize regex scripts into folders with drag-and-drop support.
// @author       En
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建容器
    const organizerContainer = document.createElement('div');
    organizerContainer.id = 'regex-organizer-container';
    organizerContainer.style.margin = '10px';
    organizerContainer.style.padding = '10px';
    organizerContainer.style.border = '1px solid #ccc';
    organizerContainer.style.borderRadius = '8px';
    organizerContainer.style.background = '#fafafa';

    const title = document.createElement('h2');
    title.textContent = 'Regex Organizer';
    organizerContainer.appendChild(title);

    const addFolderButton = document.createElement('button');
    addFolderButton.textContent = 'New Folder';
    addFolderButton.style.marginBottom = '10px';
    organizerContainer.appendChild(addFolderButton);

    const folderList = document.createElement('div');
    folderList.id = 'folder-list';
    organizerContainer.appendChild(folderList);

    document.body.appendChild(organizerContainer);

    const folders = [];

    function createFolder(name = '未命名') {
        const folder = {
            name,
            regexes: []
        };
        folders.push(folder);
        renderFolders();
    }

    function renderFolders() {
        folderList.innerHTML = '';
        folders.forEach((folder, folderIndex) => {
            const folderDiv = document.createElement('div');
            folderDiv.style.marginBottom = '10px';
            folderDiv.style.padding = '8px';
            folderDiv.style.border = '1px solid #bbb';
            folderDiv.style.borderRadius = '5px';
            folderDiv.style.background = '#fff';

            const folderTitle = document.createElement('div');
            folderTitle.textContent = folder.name;
            folderTitle.style.cursor = 'pointer';
            folderTitle.style.fontWeight = 'bold';
            folderTitle.style.marginBottom = '5px';

            const regexList = document.createElement('div');
            regexList.style.marginLeft = '10px';
            regexList.style.display = 'none'; // 默认收起

            folder.regexes.forEach((regex, regexIndex) => {
                const regexItem = document.createElement('div');
                regexItem.textContent = regex;
                regexList.appendChild(regexItem);
            });

            folderTitle.onclick = () => {
                regexList.style.display = regexList.style.display === 'none' ? 'block' : 'none';
            };

            folderDiv.appendChild(folderTitle);
            folderDiv.appendChild(regexList);
            folderList.appendChild(folderDiv);
        });
    }

    addFolderButton.onclick = () => {
        const name = prompt('Enter folder name:', '未命名');
        createFolder(name);
    };

})();
