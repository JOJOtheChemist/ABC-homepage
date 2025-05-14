/**
 * 组件加载帮助函数
 */

// 获取组件的绝对路径
function getAbsoluteComponentPath(componentName) {
    // 获取当前脚本的路径
    const scripts = document.getElementsByTagName('script');
    const currentScript = scripts[scripts.length - 1];
    const scriptPath = currentScript.src;
    
    console.log('Script path:', scriptPath);
    
    // 从脚本路径解析出基础路径
    const basePath = scriptPath.substring(0, scriptPath.lastIndexOf('/'));
    
    // 构建组件的绝对路径
    const absolutePath = `${basePath}/${componentName}`;
    console.log(`Absolute component path: ${absolutePath}`);
    
    return absolutePath;
}

// 加载组件函数
async function loadComponent(elementId, componentPath) {
    console.log(`Attempting to load component for ${elementId} from ${componentPath}`);
    try {
        const response = await fetch(componentPath);
        console.log(`Fetch response for ${componentPath}:`, response.status);
        if (!response.ok) {
            throw new Error(`Failed to load component: ${response.status} ${response.statusText}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        console.log(`Successfully loaded component for ${elementId}`);
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
        document.getElementById(elementId).innerHTML = `<div class="error">Failed to load component: ${error.message}</div>`;
    }
}

// 加载所有组件
async function loadAllComponents() {
    // 获取绝对路径
    const featureIconsPath = getAbsoluteComponentPath('feature-icons.html');
    const modeSwitchPath = getAbsoluteComponentPath('mode-switch-bar.html');
    const videoRowPath = getAbsoluteComponentPath('video-row.html');
    
    // 加载所有相同的功能图标组件
    const featureIconsPlaceholders = document.querySelectorAll('[id^="feature-icons-"]');
    
    featureIconsPlaceholders.forEach(async (placeholder) => {
        await loadComponent(placeholder.id, featureIconsPath);
    });

    // 加载所有模式切换栏组件
    const modeSwitchPlaceholders = document.querySelectorAll('[id^="mode-switch-"]');
    
    for (const placeholder of modeSwitchPlaceholders) {
        try {
            const response = await fetch(modeSwitchPath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status} ${response.statusText}`);
            }
            let html = await response.text();
            
            // 获取当前标识符，用于自定义IDs
            const sectionId = placeholder.id.replace('mode-switch-placeholder-', '');
            if (sectionId) {
                // 替换ID以匹配section
                html = html.replace('id="textModeBtn"', `id="${sectionId}TextModeBtn"`);
                html = html.replace('id="imgModeBtn"', `id="${sectionId}ImgModeBtn"`);
            }
            
            placeholder.innerHTML = html;
        } catch (error) {
            console.error('Error loading mode switch component:', error, modeSwitchPath);
            placeholder.innerHTML = `<div class="error">Failed to load mode switch: ${error.message}</div>`;
        }
    }

    // 加载所有视频行组件
    const videoRowPlaceholders = document.querySelectorAll('[id^="video-row-"]');
    
    for (const placeholder of videoRowPlaceholders) {
        try {
            const response = await fetch(videoRowPath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status} ${response.statusText}`);
            }
            let html = await response.text();
            
            // 获取当前标识符，用于自定义IDs
            const sectionId = placeholder.id.replace('video-row-placeholder-', '');
            if (sectionId) {
                // 替换ID以匹配section
                html = html.replace('id="videoRow"', `id="${sectionId}VideoRow"`);
                html = html.replace('id="videoRowArrow"', `id="${sectionId}VideoRowArrow"`);
                html = html.replace('id="videoRowArrowLeft"', `id="${sectionId}VideoRowArrowLeft"`);
            }
            
            placeholder.innerHTML = html;
        } catch (error) {
            console.error('Error loading video row component:', error, videoRowPath);
            placeholder.innerHTML = `<div class="error">Failed to load video row: ${error.message}</div>`;
        }
    }
    
    // 设置事件监听器
    setTimeout(() => {
        setupModeButtons();
    }, 500);
}

// 添加模式切换按钮事件
function setupModeButtons() {
    console.log('Setting up mode buttons');
    const buttons = [
        { text: 'recommendTextModeBtn', img: 'recommendImgModeBtn', fn: 'switchRecommendMode' },
        { text: 'studyTextModeBtn', img: 'studyImgModeBtn', fn: 'switchStudyMode' },
        { text: 'emotionTextModeBtn', img: 'emotionImgModeBtn', fn: 'switchEmotionMode' },
        { text: 'hobbyTextModeBtn', img: 'hobbyImgModeBtn', fn: 'switchHobbyMode' },
        { text: 'sideTextModeBtn', img: 'sideImgModeBtn', fn: 'switchSideMode' }
    ];
    
    buttons.forEach(btn => {
        const textBtn = document.getElementById(btn.text);
        const imgBtn = document.getElementById(btn.img);
        
        if (!textBtn || !imgBtn) {
            console.warn(`Mode buttons not found: ${btn.text}, ${btn.img}`);
            return;
        }
        
        console.log(`Found mode buttons: ${btn.text}, ${btn.img}`);
        
        if (typeof window[btn.fn] === 'function') {
            textBtn.addEventListener('click', () => window[btn.fn](0));
            imgBtn.addEventListener('click', () => window[btn.fn](1));
            console.log(`Added event listeners for ${btn.fn}`);
        } else {
            console.warn(`Mode switch function not found: ${btn.fn}`);
        }
    });
}

// 初始化setupVideoRow函数
function initializeVideoRows() {
    // 等待视频行组件加载完成
    setTimeout(() => {
        const videoRowIDs = [
            'videoRow', 'recommendVideoRow', 'studyVideoRow', 'emotionVideoRow', 'hobbyVideoRow', 'sideVideoRow'
        ];
        
        videoRowIDs.forEach(rowId => {
            const row = document.getElementById(rowId);
            if (!row) {
                console.warn(`Video row element not found: ${rowId}`);
                return;
            }
            
            const leftArrowId = rowId + 'ArrowLeft';
            const rightArrowId = rowId + 'Arrow';
            
            if (typeof setupVideoRow === 'function') {
                console.log(`Setting up video row: ${rowId}`);
                setupVideoRow(rowId, leftArrowId, rightArrowId);
            } else {
                console.warn('setupVideoRow function is not defined');
            }
        });
    }, 800);
}

// 页面加载完成后自动加载所有组件
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, starting to load components');
    try {
        await loadAllComponents();
        console.log('Components loaded, initializing video rows');
        // 初始化视频行滑动
        initializeVideoRows();
    } catch (error) {
        console.error('Error during component initialization:', error);
    }
}); 