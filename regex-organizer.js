(function() {
  'use strict';

  // 等待页面完全加载
  function waitForElement(selector, callback) {
    const interval = setInterval(() => {
      if (document.querySelector(selector)) {
        clearInterval(interval);
        callback();
      }
    }, 500);
  }

  waitForElement('#saved_regex_scripts', () => {
    // 插入自定义UI
    const organizerContainer = document.createElement('div');
    organizerContainer.id = 'regex-folder-organizer';
    organizerContainer.style.padding = '10px';
    organizerContainer.style.marginBottom = '20px';
    organizerContainer.style.background = '#f9f9f9';
    organizerContainer.style.border = '1px solid #ccc';
    organizerContainer.style.borderRadius = '8px';

    const addFolderButton = document.createElement('button');
    addFolderButton.textContent = '➕ New Folder';
    addFolderButton.style.marginBottom = '10px';
    organizerContainer.appendChild(addFolderButton);

    const folderArea = document.createElement('div');
    organizerContainer.appendChild(folderArea);

    document.querySelector('#saved_regex_scripts').before(organizerContainer);

    const folders = JSON.parse(localStorage.getItem('regex_folder_data') || '[]');

    function saveFolders() {
      localStorage.setItem('regex_folder_data', JSON.stringify(folders));
    }

    function renderFolders() {
      folderArea.innerHTML = '';

      folders.forEach(folder => {
        const folderBlock = document.createElement('div');
        folderBlock.style.marginBottom = '10px';
        folderBlock.style.border = '1px solid #bbb';
        folderBlock.style.borderRadius = '6px';
        folderBlock.style.padding = '6px';
        folderBlock.style.background = '#fff';

        const folderTitle = document.createElement('div');
        folderTitle.textContent = folder.name;
        folderTitle.style.fontWeight = 'bold';
        folderTitle.style.cursor = 'pointer';
        folderTitle.style.marginBottom = '5px';
        folderBlock.appendChild(folderTitle);

        const contentArea = document.createElement('div');
        contentArea.style.marginLeft = '10px';
        contentArea.style.display = 'none';
        folderBlock.appendChild(contentArea);

        folderTitle.onclick = () => {
          contentArea.style.display = contentArea.style.display === 'none' ? 'block' : 'none';
        };

        folder.regexIds.forEach(regexId => {
          const regexElement = document.getElementById(regexId);
          if (regexElement) {
            contentArea.appendChild(regexElement);
          }
        });

        folderArea.appendChild(folderBlock);
      });
    }

    addFolderButton.onclick = () => {
      const folderName = prompt('Enter folder name:', 'Unnamed');
      if (folderName) {
        folders.push({ name: folderName, regexIds: [] });
        saveFolders();
        renderFolders();
      }
    };

    // 拖拽功能
    $(function() {
      $('#saved_regex_scripts').sortable({
        connectWith: '#regex-folder-organizer div div',
        stop: function(event, ui) {
          const movedId = ui.item.attr('id');
          const parentFolder = ui.item.closest('div').prev('div').text();

          if (parentFolder) {
            folders.forEach(folder => {
              if (!folder.regexIds.includes(movedId)) {
                folder.regexIds.push(movedId);
              }
            });
            saveFolders();
          }
        }
      });
    });

    renderFolders();
  });
})();
