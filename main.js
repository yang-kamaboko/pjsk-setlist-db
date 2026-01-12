
        // --- 0.1 角色印象色字典 ---
        const charColors = {
            "星乃一歌": "#4455DD", 
            "天馬咲希": "#FFDD44", 
            "望月穂波": "#EE6666", 
            "日野森志歩": "#AACC00", 
            "Leo/need": "#4455DD",

            "花里みのり": "#FFCCAA", 
            "桐谷遥": "#99CCFF", 
            "桃井愛莉": "#FFAAAA", 
            "日野森雫": "#99EEEE", 
            "MORE MORE JUMP!": "#88DD88",

            "小豆沢こはね": "#FF6699",
            "白石杏": "#00BBDD", 
            "東雲彰人": "#FF7722", 
            "青柳冬弥": "#0077DD", 
            "Vivid BAD SQUAD": "#FF3366",

            "天馬司": "#FFBB00", 
            "鳳えむ": "#FF66BB",
            "草薙寧々": "#33DD99", 
            "神代類": "#BB88EE",
            "ワンダーランズ×ショウタイム": "#FF9900",

            "宵崎奏": "#BB6688", 
            "朝比奈まふゆ": "#8888CC",
            "東雲絵名": "#CCAA88",
            "暁山瑞希": "#E4A8CA",
            "25時、ナイトコードで。": "#884499",
            
            "初音ミク": "#33CCBB", 
            "鏡音リン": "#FFCC11", 
            "鏡音レン": "#FFEE11", 
            "巡音ルカ": "#FFBBCC", 
            "MEIKO": "#DD4444", 
            "KAITO": "#3366CC",
            "VIRTUAL SINGER": "#77787B",


            "野口瑠璃子": "#4455DD", 
            "礒部花凜": "#FFDD44", 
            "望月穂波": "#EE6666", 
            "中島由貴": "#AACC00", 
            "Leo/need": "#4455DD",

            "小倉唯": "#FFCCAA", 
            "吉岡茉祐": "#99CCFF", 
            "降幡愛": "#FFAAAA", 
            "本泉莉奈": "#99EEEE", 
            "MORE MORE JUMP!": "#88DD88",

            "秋奈": "#FF6699",
            "鷲見友美ジェナ": "#00BBDD", 
            "今井文也": "#FF7722", 
            "伊東健人": "#0077DD", 
            "Vivid BAD SQUAD": "#FF3366",

            "廣瀬大介": "#FFBB00", 
            "木野日菜": "#FF66BB",
            "Machico": "#33DD99", 
            "土岐隼一": "#BB88EE",
            "ワンダーランズ×ショウタイム": "#FF9900",

            "楠木ともり": "#BB6688", 
            "田辺留依": "#8888CC",
            "鈴木みのり": "#CCAA88",
            "佐藤日向": "#E4A8CA",

            "東京フィルハーモニー交響楽団・セカイシンフォニースペシャルバンド": "#000000",
            "大阪交響楽団・セカイシンフォニースペシャルバンド": "#000000",
        };

        // --- 0.2 ユニットロゴ辞書 ---
        const unitLogos = {
            "Leo/need": "./assets/teams_logo/ln_logo_unit.png",
            "MORE MORE JUMP!": "./assets/teams_logo/mmj_logo_unit.png",
            "Vivid BAD SQUAD": "./assets/teams_logo/vbs_logo_unit.png",
            "ワンダーランズ×ショウタイム": "./assets/teams_logo/wxs_logo_unit.png",
            "25時、ナイトコードで。": "./assets/teams_logo/25ji_logo_unit.png",
            "VIRTUAL SINGER": "./assets/teams_logo/vs_logo_unit.png",
        };
        
        // 3. 颜色工具
        function getColor(name) { return charColors[name] || "#999999"; }
        
        function hexToRgba(hex, opacity) {
            if (!hex || !hex.startsWith('#')) return `rgba(255, 255, 255, ${opacity})`;
            let c = hex.substring(1).split('');
            if(c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            c = '0x' + c.join('');
            return 'rgba(' + [(c>>16)&255, (c>>8)&255, c&255].join(',') + ',' + opacity + ')';
        }

        const SAFE_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkAQMAAABKLAcXAAAAA1BMVEX///+nxBvIAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEElEQVQ4y2MYBaNgGAMCAAACTAAAAYrX8AAAAABJRU5ErkJggg==";

        // 1. 全局变量声明
        let songLibrary = {};
        let eventsData = []; // ★ 修正：初始化为空数组
        let currentEvent = null; 
        let currentView = 'offline';
        let rankFilters = ['1', '2', '3', '4']; // 默认全选
        let rankingLimit = 30; // ★ 新增：默认只显示 30 首

        // 2. 加载数据 (修改版：拆分加载 4 个数据文件)
        Promise.all([
            fetch('data_sekalai.json').then(res => res.json()),   // Type 1
            fetch('data_kanshasai.json').then(res => res.json()), // Type 2
            fetch('data_symphony.json').then(res => res.json()),  // Type 3
            fetch('data_connect.json').then(res => res.json()),   // Type 4
            fetch('songs.json').then(res => res.json())           // 歌曲库
        ])
        .then(([sekalai, kanshasai, symphony, connect, songLibraryResult]) => {
            // 辅助函数：提取 events 数组，防止文件为空或格式不对时报错
            const getEvents = (data) => data.events || data || [];

            // ★★★ 核心：合并所有数据 ★★★
            eventsData = [
                ...getEvents(sekalai),
                ...getEvents(kanshasai),
                ...getEvents(symphony),
                ...getEvents(connect)
            ];
            
            songLibrary = songLibraryResult;
            
            console.log("全部分类数据加载成功！总活动数:", eventsData.length);

            // 初始化：默认显示排行榜
            switchView('ranking'); 
        })
        .catch(error => {
            console.error('加载 JSON 失败:', error);
            alert("数据加载失败，请按 F12 查看控制台错误信息。");
        });
        
        // --- 视图切换 (修改版) ---
        function switchView(viewName) {
            currentView = viewName;
            
            // 1. 按钮高亮逻辑
            const buttons = document.querySelectorAll('.view-btn');
            buttons.forEach(btn => {
                // 如果是排行榜按钮
                if (viewName === 'ranking' && btn.classList.contains('ranking-main-btn')) {
                    btn.classList.add('active');
                } 
                // 如果是普通按钮
                else if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${viewName}'`)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // 2. 视图显示/隐藏切换
            const listView = document.getElementById('listView');
            const rankingView = document.getElementById('rankingView');
            const statsView = document.getElementById('statsView'); // 假设你之前有这个

            if (viewName === 'ranking') {
                listView.style.display = 'none';
                if(statsView) statsView.style.display = 'none';
                rankingView.style.display = 'block';
                
                // ★ 新增：每次进入排行榜，重置为 30
                rankingLimit = 30; 
                renderRanking();
            } else {
                rankingView.style.display = 'none';
                if(statsView) statsView.style.display = 'none';
                listView.style.display = 'block';
                
                // 渲染普通列表
                renderList(viewName);
            }
        }

       // --- 列表渲染 (EventType 过滤版) ---
        function renderList(typeFilter) {
            const container = document.getElementById('results');
            container.innerHTML = "";
            
            if (!eventsData || eventsData.length === 0) return;

            // ★★★ 核心修改：根据 eventType 过滤 ★★★
            // 我们把 eventType 转成字符串再比较，防止 JSON 里写的是数字 1 而参数是字符串 "1"
            const filteredData = eventsData.filter(e => String(e.eventType) === String(typeFilter));
            
            if(filteredData.length === 0) {
                container.innerHTML = "<p style='text-align:center; color:#999; width:100%; grid-column: 1 / -1;'>データが見つかりません / 该分类下暂无活动</p>"; 
                return;
            }

            filteredData.forEach(event => {
                const bgStyle = event.image ? `background-image: url('${event.image}')` : `background-color: #ddd`;
                
                // --- 下面生成横幅的代码保持不变 ---
                let bannerHtml = "";
                let typeText = "";
                let typeClass = "";
                const eType = String(event.eventType || "").toLowerCase();

                if (eType === "1" || eType === "sekalai") { typeText = "セカライ"; typeClass = "banner-sekalai"; }
                else if (eType === "2" || eType === "kanshasai") { typeText = "感謝祭"; typeClass = "banner-kanshasai"; }
                else if (eType === "3" || eType === "symphony") { typeText = "シンフォ"; typeClass = "banner-symphony"; }
                else if (eType === "4" || eType === "connect") { typeText = "コネライ"; typeClass = "banner-connect"; }

                if (typeText) {
                    bannerHtml = `<div class="card-banner ${typeClass}">${typeText}</div>`;
                }
                // ----------------------------------

                container.innerHTML += `
                    <div class="event-card" style="${bgStyle}" onclick="openModal(${event.id})">
                        ${bannerHtml}
                        <div class="card-content">
                            <div style="font-size:1.1em; font-weight:bold;">${event.title}</div>
                            <div style="font-size:0.9em; opacity:0.9;">
                                <i class="far fa-calendar-alt"></i> ${event.date}
                            </div>
                        </div>
                    </div>`;
            });
        }

                // --- 全局变量新增 ---
        let currentSublists = []; // 用来存当前活动的标签列表

        // --- 修改：openModal 函数 (通用标签版) ---
        function openModal(id) {
            try {
                currentEventData = eventsData.find(e => e.id == id);
                if (!currentEventData) return;
                
                const event = currentEventData; 

                // 1. 基础信息渲染 (图片、标题、日期等)
                const watermark = document.getElementById('modalWatermark');
                if (event.image) {
                    watermark.src = event.image;
                    watermark.style.display = 'block';
                } else {
                    watermark.style.display = 'none';
                }
                document.getElementById('modalTitle').innerText = event.title;
                document.getElementById('modalDate').innerHTML = `<i class="far fa-calendar-alt"></i> ${event.date} &nbsp;|&nbsp; <i class="fas fa-map-marker-alt"></i> ${event.location}`;

                // 2. 出演者渲染
                renderPerformers(event.performers);

                // ★★★ 3. 动态按钮生成逻辑 ★★★
                const toggleContainer = document.getElementById('sessionToggles');
                toggleContainer.innerHTML = ""; // 清空旧按钮
                currentSublists = []; // 重置数据

                // 情况 A: 有多标签 (sublists)
                if (event.sublists && event.sublists.length > 0) {
                    currentSublists = event.sublists;
                    toggleContainer.classList.remove('hidden');

                    // 循环生成按钮
                    event.sublists.forEach((sub, index) => {
                        const btn = document.createElement('button');
                        // 第一个按钮默认激活
                        btn.className = `session-btn ${index === 0 ? 'active' : ''}`; 
                        btn.innerText = sub.name; // 按钮上的文字 (比如 "昼公演", "大阪")
                        btn.onclick = () => switchTab(index); // 绑定点击事件
                        toggleContainer.appendChild(btn);
                    });

                    // 默认显示第一个标签的内容
                    switchTab(0);
                } 
                // 情况 B: 只有单歌单 (setlist) -> 不显示按钮
                else {
                    toggleContainer.classList.add('hidden'); // 隐藏按钮条
                    renderSongs(event.setlist);
                }

                document.getElementById('detailModal').style.display = 'flex';
                
            } catch (err) {
                console.error(err);
                alert("出错啦：" + err.message);
            }
        }

        // --- 修改：switchTab 函数 (支持更新日期、地点、出演者) ---
        function switchTab(index) {
            if (!currentSublists || !currentSublists[index]) return;
            const targetSub = currentSublists[index];

            // 1. 切换按钮高亮
            const btns = document.querySelectorAll('#sessionToggles .session-btn');
            btns.forEach((b, i) => {
                if (i === index) b.classList.add('active');
                else b.classList.remove('active');
            });

            // 2. 渲染歌单
            renderSongs(targetSub.data);

            // 3. 智能更新日期和地点
            // 逻辑：如果子列表里写了 date，就用它的；否则用最外层的
            const displayDate = targetSub.date || currentEventData.date;
            const displayLocation = targetSub.location || currentEventData.location;
            updateDateLocation(displayDate, displayLocation);

            // ★★★ 4. 新增：智能更新出演者 ★★★
            // 逻辑：如果子列表里写了 performers，就用它的；否则用最外层的
            const displayPerformers = targetSub.performers || currentEventData.performers;
            
            // 调用现有的渲染函数刷新界面
            renderPerformers(displayPerformers);
        }
        // --- 新增辅助函数：更新页面上的日期地点文字 ---
        function updateDateLocation(dateText, locationText) {
            const html = `<i class="far fa-calendar-alt"></i> ${dateText} &nbsp;|&nbsp; <i class="fas fa-map-marker-alt"></i> ${locationText}`;
            document.getElementById('modalDate').innerHTML = html;
        }

        // --- 渲染出演者 ---
        function renderPerformers(rawPerformers) {
            let performersList = [];
            if (Array.isArray(rawPerformers)) {
                performersList = rawPerformers;
            } else {
                performersList = String(rawPerformers || "").split(/,|、|，/);
            }
            
            const performersHtml = performersList
                .map(name => name.trim())
                .filter(name => name)
                .map(name => {
                    const color = getColor(name);
                    return `<span class="performer-badge" style="background-color: ${color}">${name}</span>`;
                }).join('');

            document.getElementById('modalPerformers').innerHTML = `
                <div class="performers-wrapper">
                    <div class="performers-label"><i class="fas fa-users"></i> 出演:</div>
                    ${performersHtml}
                </div>
            `;
        }

        // --- 核心：渲染歌单列表 (含自动初披露判断) ---
        function renderSongs(rawSetlist) {
            const songsContainer = document.getElementById('modalSongs');
            songsContainer.innerHTML = ""; 

            const listData = rawSetlist || [];
            if(listData.length === 0) {
                songsContainer.innerHTML = "<div style='text-align:center; padding:20px; color:#999;'>No Data / データなし</div>";
                return;
            }

            // ★ 1. 定义自动判断初披露的函数 (闭包内使用)
            const checkAutoPremiere = (targetSongId) => {
                // 如果当前活动没有定义类型，或者这就是第一场，跳过自动判断
                if (!currentEventData || !currentEventData.eventType) return null;
                if (!targetSongId) return null;

                const myType = currentEventData.eventType;
                // 将 2022.1.28 转换为日期对象以便比较
                const myDate = new Date(currentEventData.date.replace(/\./g, '/'));

                // 遍历所有活动数据
                for (let otherEvent of eventsData) {
                    // 不需要跟自己比
                    if (otherEvent.id === currentEventData.id) continue;

                    // 只跟“过去”的活动比
                    const otherDate = new Date(otherEvent.date.replace(/\./g, '/'));
                    if (otherDate >= myDate) continue; 

                    // 只比对“同类型”的活动
                    if (otherEvent.eventType === myType) {
                        // 检查昼场有没有这首歌
                        if (otherEvent.setlist && otherEvent.setlist.some(s => s.songId === targetSongId)) {
                            return null; // 以前唱过！
                        }
                        // 检查夜场有没有这首歌
                        if (otherEvent.setlistNight && otherEvent.setlistNight.some(s => s.songId === targetSongId)) {
                            return null; // 以前唱过！
                        }
                    }
                }
                // 循环结束都没发现唱过 -> 是初披露！
                return myType; 
            };

            // 预处理序号
            let songCounter = 0;
            const processedSetlist = listData.map(item => {
                if (item.type === 'break' || item.type === 'mc') return item;
                songCounter++;
                return { ...item, _displayIndex: songCounter };
            });

            // 切分两列
            const splitIndex = Math.ceil(processedSetlist.length / 2);
            const leftSongs = processedSetlist.slice(0, splitIndex);
            const rightSongs = processedSetlist.slice(splitIndex);

            // 生成 HTML 的核心函数
            const generateColumnHtml = (list) => {
                return list.map((item) => {
                    // A. 分割条
                    if (item.type === 'break') {
                        return `
                            <div class="setlist-separator">
                                <i class="fas fa-bullhorn"></i>
                                <span>${item.text}</span>
                            </div>
                        `;
                    }

                    // B. MC 板块
                    if (item.type === 'mc') {
                        const unitKey = item.unit || "System"; 
                        const colorHex = charColors[unitKey] || "#999999"; 
                        const bgStyle = `background-color: ${hexToRgba(colorHex, 0.25)}; border-color: ${hexToRgba(colorHex, 0.4)};`;
                        return `
                            <div class="setlist-mc" style="${bgStyle}">
                                <i class="fas fa-microphone-alt"></i>
                                <span>${item.text}</span>
                            </div>
                        `;
                    }

                    // C. 正常歌曲
                    const globalIndex = item._displayIndex;
                    const songId = item.songId;
                    const songInfo = songLibrary[songId] || { title: `Unknown (${songId})`, cover: "", singers: ["Unknown"], defaultTags: [] };

                    // ★★★ 核心修改：支持“覆盖”逻辑 ★★★
                    
                    // 1. 决定歌手：如果 data.json (item) 里写了 singers，就用它的；否则用库里的
                    const displaySingers = item.singers || songInfo.singers || [];

                    // 2. 决定封面：如果 data.json (item) 里写了 cover，就用它的；否则用库里的
                    // (有些歌不同版本可能封面也不一样，顺手加上这个功能)
                    const displayCover = item.cover || songInfo.cover || SAFE_PLACEHOLDER;

                    // 3. 决定歌名：甚至歌名也可以覆盖 (比如加上 "-Piano Ver.-")
                    const displayTitle = item.title || songInfo.title;

                    // ★★★ 初披露判断逻辑 ★★★
                    let premiereHtml = '';
                    // ★★★ 2. 生成生歌唱标签 (右上角 - 横排版) ★★★
                    let liveHtml = '';
                    if (item.liveVocals) {
                        // ★ 修改这里：使用 .badge-horizontal 类
                        liveHtml = `<div class="badge-horizontal badge-live-red">生歌唱</div>`;
                    }

                    // 生成歌手胶囊 (注意这里把 songInfo.singers 改成了 displaySingers)
                    const singersHtml = displaySingers.map(name => {
                        const color = getColor(name);
                        return `<span class="singer-badge" style="background-color: ${color}">${name}</span>`;
                    }).join('');

                    let shortHtml = '';
                    // 检查 JSON 里有没有写 "shortVer": true
                    if (item.shortVer) {
                        shortHtml = `<div class="badge-bottom-right badge-short-grey">Short Ver</div>`;
                    }

                    // 修改 renderSongs 函数里的这一行：
                    let medleyHtml = item.medley ? `<div class="badge-bottom-right badge-medley-glass">メドレー</div>` : '';

                    let allTags = [...(songInfo.defaultTags || [])]; 
                    if (item.note) allTags.push(item.note);
                    const songCount = allTags.length; 

                   let tagsHtml = '';
                    if (allTags.length > 0) {
                        const tagsStr = allTags.map(tagText => {
                            // 默认样式 (灰色/通用)
                            let tagClass = "tag-version"; 

                            // ★★★ 核心修改：根据文字内容匹配 4 种颜色 ★★★
                            
                            // 1. 感謝祭 (Kanshasai) -> 橙色
                            if (tagText.includes("感謝祭") || tagText.includes("感谢祭")) {
                                tagClass = "tag-kanshasai";
                            } 
                            // 2. シンフォニー (Symphony) -> 深蓝色
                            else if (tagText.includes("交響") || tagText.includes("交响") || tagText.includes("シンフォ")) {
                                tagClass = "tag-symphony";
                            }
                            // 3. セカライ (Sekalai/COLORFUL LIVE) -> 红粉色
                            else if (tagText.includes("セカライ") || tagText.includes("COLORFUL")) {
                                tagClass = "tag-sekalai";
                            }
                            // 4. コネライ (Connect Live) -> 青色
                            else {
                                tagClass = "tag-connect";
                            }

                            return `<span class="song-tag ${tagClass}">${tagText}</span>`;
                        }).join('');
                        tagsHtml = `<div class="song-tags-container">${tagsStr}</div>`;
                    }
                    
                    let watermarkHtml = '';
                    let rowStyle = '';
                    let rowClass = ''; 
                    const singersList = displaySingers;
                    
                    // ============================================================
                    // ★★★ 修改后的队伍判断逻辑 (优先级：活动JSON > 歌曲库 > 自动推断) ★★★
                    // ============================================================
                    
                    // 0. 准备名单 (常量)
                    const standardUnits = ["Leo/need", "MORE MORE JUMP!", "Vivid BAD SQUAD", "Wonderlands×Showtime", "25時、ナイトコードで。", "VIRTUAL SINGER", "Virtual Singer", "ワンダーランズ×ショウタイム", "25時、ナイトコードで。"]; 
                    const vsNames = ["初音ミク", "鏡音リン", "鏡音レン", "巡音ルカ", "MEIKO", "KAITO", "VIRTUAL SINGER", "Virtual Singer", "バーチャル・シンガー", "VS"];
                    const whiteLogoUnits = ["Leo/need", "レオニ", "MORE MORE JUMP!", "モモジャン", "25時、ナイトコードで。", "25-ji, Nightcord de.", "ニーゴ"];

                    // ★ 步骤 1: 第一优先级 - 检查当前活动数据 (item) 里的 "unit"
                    let targetUnit = item.unit; 

                    // ★ 步骤 2: 第二优先级 - 如果活动数据没写，检查 songs.json (songInfo) 里的 "unit"
                    if (!targetUnit) {
                        targetUnit = songInfo.unit;
                    }

                    // ★ 步骤 3: 第三优先级 - 如果还是没有，尝试从歌手列表 (displaySingers) 自动反推
                    if (!targetUnit) {
                        // 尝试在歌手里找有没有 "Leo/need" 这种队伍名
                        targetUnit = displaySingers.find(name => standardUnits.includes(name));
                    }

                    // ★ 步骤 4: 兜底判断 - 如果全是 VS 歌手，归为 VIRTUAL SINGER
                    if (!targetUnit && displaySingers.length > 0 && displaySingers.every(name => vsNames.includes(name))) {
                        targetUnit = "VIRTUAL SINGER";
                    }

                    // ★ 步骤 5: "人类检测" 安全锁
                    // 逻辑：如果当前被判定为 VS，但歌手里出现了“人类”(不在 vsNames 表里的人)，强制变回混合队伍
                    if (targetUnit === "VIRTUAL SINGER" || targetUnit === "Virtual Singer") {
                        const hasHuman = displaySingers.some(name => !vsNames.includes(name));
                        if (hasHuman) {
                            targetUnit = null; // 强制置空 -> 触发 rainbow-bg (彩虹背景)
                        }
                    }
                    
                    if (targetUnit && unitLogos[targetUnit]) {
                        const logoUrl = unitLogos[targetUnit];
                        let extraClass = whiteLogoUnits.includes(targetUnit) ? "invert-white" : "";
                        watermarkHtml = `<img src="${logoUrl}" class="unit-watermark ${extraClass}">`;
                        
                        const unitColorHex = getColor(targetUnit);
                        // 确保 hexToRgba 函数存在
                        if(typeof hexToRgba === 'function') {
                            rowStyle = `background-color: ${hexToRgba(unitColorHex, 0.15)};`; 
                        }
                    } else {
                        rowClass = 'rainbow-bg'; // 没找到队伍 -> 彩虹背景
                    }

                    let commentHtml = '';
                    if (item.comment) commentHtml = `<div class="song-comment-row">${item.comment}</div>`;

                    const coverSrc = songInfo.cover ? songInfo.cover : SAFE_PLACEHOLDER;
                    
                    return `
                        <div class="song-row ${rowClass}" style="${rowStyle}">
                            ${watermarkHtml}
                            <div class="song-body">
                                <div class="song-left-col">
                                    <img src="${coverSrc}" class="song-cover-img" alt="cover">
                                    ${liveHtml}      ${premiereHtml}
                                    ${shortHtml}
                                    ${medleyHtml} 
                                </div>
                                <div class="song-info">
                                    <div class="song-title">
                                        <span class="song-number-inline">#${globalIndex}</span>${displayTitle}
                                    </div>
                                    <div class="singer-tags">${singersHtml}</div>
                                </div>
                            </div>
                            <div class="song-footer">
                                <div class="song-footer-left">
                                    <span class="song-count-label">歌唱回数: ${songCount}</span>
                                </div>
                                <div class="song-footer-right">${tagsHtml}</div>
                            </div>
                            ${commentHtml}
                        </div>
                    `;
                }).join('');
            };

            const leftHtml = generateColumnHtml(leftSongs);
            const rightHtml = generateColumnHtml(rightSongs);

            songsContainer.innerHTML = `
                <div class="setlist-column">${leftHtml}</div>
                <div class="setlist-column">${rightHtml}</div>
            `;
        }

        // --- 保存图片逻辑 ---
        function saveSetlistImage() {
            const element = document.querySelector(".modal-content");
            const saveBtn = document.querySelector(".save-btn");
            const closeBtn = document.querySelector(".close-btn");
            
            saveBtn.style.display = 'none';
            closeBtn.style.display = 'none';
            
            const originalOverflow = element.style.overflow;
            const originalHeight = element.style.height;
            const originalMaxHeight = element.style.maxHeight;
            
            element.style.overflow = "visible";
            element.style.height = "auto";
            element.style.maxHeight = "none";
            element.style.borderRadius = "0"; 

            setTimeout(() => {
                html2canvas(element, {
                    scale: 2, 
                    useCORS: true, 
                    backgroundColor: "#ffffff",
                    scrollY: -window.scrollY 
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = `${currentEventData ? currentEventData.title : 'setlist'}.png`;
                    link.href = canvas.toDataURL("image/png");
                    link.click();

                    restoreStyles();
                }).catch(err => {
                    console.error("Screenshot failed:", err);
                    alert("保存失败，请检查图片跨域问题。");
                    restoreStyles();
                });
            }, 300);

            function restoreStyles() {
                saveBtn.style.display = 'block';
                closeBtn.style.display = 'block';
                element.style.overflow = originalOverflow;
                element.style.height = originalHeight;
                element.style.maxHeight = originalMaxHeight;
                element.style.borderRadius = "12px";
            }
        }

        function closeModal(e, force) {
            if (force || e.target.classList.contains('modal-overlay')) {
                document.getElementById('detailModal').style.display = 'none';
            }
        }

        // --- 排行榜筛选切换 ---
        function toggleRankFilter(type, btn) {
            if (rankFilters.includes(type)) {
                // 取消选中
                rankFilters = rankFilters.filter(t => t !== type);
                btn.classList.remove('active');
            } else {
                // 选中
                rankFilters.push(type);
                btn.classList.add('active');
            }
            // 重新计算并渲染
            renderRanking();
        }

        // --- 排行榜渲染主逻辑 (含并列排名处理) ---
        function renderRanking() {
            const container = document.getElementById('rankingList');
            container.innerHTML = "";

            if (rankFilters.length === 0) {
                container.innerHTML = "<div style='padding:40px; text-align:center; color:#999;'>条件を選択してください<br><small>少なくとも1つのイベントを選択してください</small></div>";
                return;
            }

            // 1. 【全局统计】(保持不变)
            let songStats = {}; 
            eventsData.forEach(event => {
                const eType = String(event.eventType);
                const eventTitle = event.title;
                const songsInThisEvent = new Set();
                const collectSongs = (list, subName) => {
                    if (!list) return;
                    list.forEach(item => {
                        if (item.type !== 'break' && item.type !== 'mc' && item.songId) {
                            const sid = item.songId;
                            songsInThisEvent.add(sid);
                            if (!songStats[sid]) {
                                const info = songLibrary[sid] || { title: sid, cover: "" };
                                songStats[sid] = {
                                    id: sid, title: info.title, cover: info.cover || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", 
                                    count: 0, historyTypes: new Set(), detailedHistory: {} 
                                };
                            }
                            if (!songStats[sid].detailedHistory[eType]) songStats[sid].detailedHistory[eType] = [];
                            const fullDetail = subName ? `${eventTitle} [${subName}]` : eventTitle;
                            if (!songStats[sid].detailedHistory[eType].includes(fullDetail)) {
                                songStats[sid].detailedHistory[eType].push(fullDetail);
                            }
                        }
                    });
                };
                if (event.sublists) event.sublists.forEach(sub => collectSongs(sub.data, sub.name));
                else if (event.setlist) collectSongs(event.setlist, "");
                
                songsInThisEvent.forEach(sid => {
                    songStats[sid].historyTypes.add(eType);
                    if (rankFilters.includes(eType)) songStats[sid].count++;
                });
            });

            // 2. 【排序】(保持不变)
            let fullRankingArray = Object.values(songStats)
                .filter(s => s.count > 0) 
                .sort((a, b) => b.count - a.count);

            // 截取当前需要显示的部分
            let displayList = fullRankingArray.slice(0, rankingLimit);

            // 3. 【生成 HTML】(逻辑更新！)
            const fixedTags = [
                { id: '1', name: 'セカライ', activeClass: 'tag-sekalai' },
                { id: '2', name: '感謝祭',   activeClass: 'tag-kanshasai' },
                { id: '3', name: 'シンフォ', activeClass: 'tag-symphony' },
                { id: '4', name: 'コネライ', activeClass: 'tag-connect' }
            ];

            let html = "";
            
            // ★ 新增：用于记录并列排名的变量
            let currentRank = 1;

            displayList.forEach((song, index) => {
                // ★ 核心排位逻辑：
                // 如果不是第一首，且“当前这首的票数” < “上一首的票数”，则排名更新为 (index + 1)
                // 否则（票数相等），排名保持不变 (currentRank 不动)
                if (index > 0 && song.count < displayList[index - 1].count) {
                    currentRank = index + 1;
                }
                
                // 如果是第一首，强制设为 1 (防止分页加载时逻辑错乱，虽然这里每次都重绘)
                if (index === 0) currentRank = 1;

                const rank = currentRank;
                
                // 样式分配：如果 rank 是 1, 2, 3，就给对应的金银铜样式
                let rankClass = "";
                if (rank === 1) rankClass = "rank-1";
                else if (rank === 2) rankClass = "rank-2";
                else if (rank === 3) rankClass = "rank-3";

                // (后续渲染逻辑不变...)
                const tagsHtml = fixedTags.map(tagDef => {
                    const isColored = song.historyTypes.has(tagDef.id) && rankFilters.includes(tagDef.id);
                    const className = isColored ? tagDef.activeClass : 'tag-inactive';
                    let tooltipText = "";
                    if (song.detailedHistory[tagDef.id] && song.detailedHistory[tagDef.id].length > 0) {
                        tooltipText = song.detailedHistory[tagDef.id].join('\n');
                    }
                    // 把 title 改为 data-tooltip，这样我们才能用 CSS 控制它的宽度和样式
                    return `<span class="rank-tag ${className}" data-tooltip="${tooltipText}">${tagDef.name}</span>`;
                }).join('');

                html += `
                    <div class="ranking-row">
                        <div class="rank-num ${rankClass}">#${rank}</div>
                        <img src="${song.cover}" class="rank-cover" loading="lazy">
                        
                        <div class="rank-song-info">
                            <div style="font-weight:bold;">${song.title}</div>
                        </div>
                        
                        <div class="rank-count-box mobile-hidden">
                            <span class="rank-count-num">${song.count}回</span>
                        </div>
                        
                        <div class="rank-tags mobile-hidden">
                            ${tagsHtml}
                        </div>

                        <div class="rank-meta-mobile" style="display:none;"> 
                            <div><span style="font-weight:bold; color:var(--primary-color)">${song.count}回</span></div>
                            <div style="display:flex; gap:3px;">${tagsHtml}</div>
                        </div>
                    </div>
                `;
            });

            if (displayList.length === 0) {
                html = "<div style='padding:40px; text-align:center; color:#999;'>データがありません</div>";
            }

            if (fullRankingArray.length > rankingLimit) {
                const remaining = fullRankingArray.length - rankingLimit;
                html += `
                    <button class="ranking-load-more-btn" onclick="loadMoreRanking()">
                        <i class="fas fa-chevron-down"></i> もっと見る (あと${remaining}曲)
                    </button>
                `;
            }

            container.innerHTML = html;
        }


        function loadMoreRanking() {
                rankingLimit += 30; // 每次多显示 30 首
                renderRanking();    // 重新渲染列表
            }