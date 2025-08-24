// Museum data with checklists for different age groups
const MUSEUMS = [
    {
        id: 'forbidden-city',
        name: '故宫博物院',
        location: '北京',
        description: '世界上现存规模最大、保存最为完整的木质结构古建筑群',
        tags: ['历史', '建筑', '文物'],
        checklists: {
            parent: {
                '3-6': [
                    '提前下载故宫APP，预约参观时间',
                    '准备舒适的步行鞋，全程需要走很多路',
                    '带上小零食和水，中途可以补充体力',
                    '准备简单的故事：皇帝和皇后住在这里',
                    '指出红色的墙和金色的屋顶，让孩子观察颜色',
                    '寻找门上的门神和屋顶上的小兽',
                    '在太和殿前拍照留念',
                    '参观御花园，看古代的花草树木'
                ],
                '7-12': [
                    '提前了解明清两朝历史背景',
                    '下载故宫APP，使用语音导览功能',
                    '准备纸笔，让孩子记录有趣的发现',
                    '讲解古代皇帝的日常生活',
                    '介绍中国古代建筑的特色',
                    '寻找不同殿宇的功能差异',
                    '观察文物上的龙纹图案',
                    '了解古代科举制度'
                ],
                '13-18': [
                    '深入研究明清政治制度',
                    '分析故宫建筑的风水学原理',
                    '讨论文物保护的重要性',
                    '了解故宫的现代化管理',
                    '探讨历史与现代的对话',
                    '参观特展，培养艺术鉴赏力',
                    '思考传统文化的传承意义'
                ]
            },
            child: {
                '3-6': [
                    '数一数有多少个门',
                    '找到最大的那个院子',
                    '看看屋顶上有什么小动物',
                    '找一找门上的门神',
                    '看红色的墙有多高',
                    '在花园里找到自己喜欢的花',
                    '听听爸爸妈妈讲皇帝的故事',
                    '拍一张自己最喜欢的照片'
                ],
                '7-12': [
                    '找到三大殿：太和殿、中和殿、保和殿',
                    '数一数太和殿前有多少台阶',
                    '寻找屋顶上的神兽，了解它们的作用',
                    '在珍宝馆找到最喜欢的宝物',
                    '观察古代皇帝用过的物品',
                    '了解一个历史故事并记录下来',
                    '画一幅故宫的简笔画',
                    '学会一个关于故宫的知识点'
                ],
                '13-18': [
                    '研究故宫的对称设计原理',
                    '了解不同朝代的文物特征',
                    '分析一件文物的历史价值',
                    '探索故宫数字化保护技术',
                    '思考古代工匠技艺的传承',
                    '写一篇参观感悟',
                    '制作一个故宫知识小报告'
                ]
            }
        }
    },
    {
        id: 'national-museum',
        name: '中国国家博物馆',
        location: '北京',
        description: '综合性历史艺术博物馆，展示中华民族悠久文化历史',
        tags: ['历史', '文化', '艺术'],
        checklists: {
            parent: {
                '3-6': [
                    '选择适合幼儿的展厅，避免过于复杂的内容',
                    '重点参观古代中国展，有很多有趣的文物',
                    '准备简单易懂的历史小故事',
                    '带上画笔和纸，让孩子画下感兴趣的文物',
                    '利用互动展示设备吸引孩子注意力',
                    '适时休息，避免疲劳',
                    '拍照记录孩子的好奇表情'
                ],
                '7-12': [
                    '提前规划参观路线，重点看几个展厅',
                    '准备中国历史timeline，帮助理解',
                    '鼓励孩子提问和思考',
                    '使用博物馆提供的教育活动',
                    '讲解文物背后的故事',
                    '连接课本知识与实物',
                    '购买相关书籍作为延伸阅读'
                ],
                '13-18': [
                    '深入了解中华文明发展脉络',
                    '分析不同历史时期的特征',
                    '讨论文物的考古价值',
                    '了解博物馆学知识',
                    '思考历史对现代的启示',
                    '参与博物馆教育项目',
                    '写作参观报告'
                ]
            },
            child: {
                '3-6': [
                    '找到最大的恐龙骨头',
                    '看看古代人用的碗和杯子',
                    '找一找有动物图案的东西',
                    '看看古代小朋友的玩具',
                    '数一数青铜器上的花纹',
                    '找到自己喜欢的颜色的文物',
                    '学会一个新的汉字',
                    '告诉爸妈最有趣的发现'
                ],
                '7-12': [
                    '了解中国历史的主要朝代',
                    '找到课本上学过的历史文物',
                    '观察不同材质的文物：青铜、陶瓷、玉器',
                    '学习一个古代发明',
                    '找到丝绸之路相关文物',
                    '了解古代人的生活方式',
                    '记录三个最感兴趣的文物',
                    '想象自己生活在古代的样子'
                ],
                '13-18': [
                    '梳理中华文明发展的关键节点',
                    '分析文物反映的历史信息',
                    '了解考古发掘过程',
                    '思考文化遗产保护意义',
                    '比较不同文明的特色',
                    '探讨历史研究方法',
                    '制作知识思维导图'
                ]
            }
        }
    },
    {
        id: 'shanghai-museum',
        name: '上海博物馆',
        location: '上海',
        description: '以古代艺术为主的综合性博物馆，被誉为"中华艺术宫"',
        tags: ['艺术', '文物', '收藏'],
        checklists: {
            parent: {
                '3-6': [
                    '重点参观青铜器和瓷器展厅',
                    '让孩子触摸互动展示设备',
                    '准备关于颜色和形状的游戏',
                    '讲述简单的工艺制作过程',
                    '使用儿童导览手册',
                    '在咖啡厅休息时回顾参观内容'
                ],
                '7-12': [
                    '了解中国古代艺术发展历程',
                    '重点观察工艺技法的精妙',
                    '比较不同时代的艺术风格',
                    '参加博物馆教育活动',
                    '鼓励艺术创作和模仿',
                    '购买艺术类儿童读物'
                ],
                '13-18': [
                    '深入学习中国艺术史',
                    '分析艺术作品的文化内涵',
                    '了解艺术鉴赏方法',
                    '探讨艺术与社会的关系',
                    '参观临时特展',
                    '培养审美品味'
                ]
            },
            child: {
                '3-6': [
                    '找到最喜欢的颜色的瓷器',
                    '看看青铜器上的小动物',
                    '数一数有多少种不同的杯子',
                    '找到最大和最小的文物',
                    '看看古代人画的画',
                    '学会一个关于颜色的词',
                    '拍一张最美丽的照片'
                ],
                '7-12': [
                    '了解青铜器的制作过程',
                    '观察瓷器的花纹设计',
                    '学习书法的基本知识',
                    '找到不同朝代的艺术特色',
                    '了解一位古代艺术家',
                    '尝试临摹一幅简单的画',
                    '记录最震撼的艺术品'
                ],
                '13-18': [
                    '研究中国艺术的美学原理',
                    '分析艺术品的技法特点',
                    '了解艺术品的收藏价值',
                    '探索传统艺术的现代传承',
                    '写一篇艺术鉴赏文章',
                    '制作艺术作品分析报告'
                ]
            }
        }
    },
    {
        id: 'terracotta-warriors',
        name: '秦始皇帝陵博物院',
        location: '西安',
        description: '世界文化遗产，展示秦朝兵马俑的恢宏场面',
        tags: ['历史', '考古', '世界遗产'],
        checklists: {
            parent: {
                '3-6': [
                    '重点参观一号坑，震撼场面最适合拍照',
                    '准备秦始皇和兵马俑的简单故事',
                    '让孩子观察士兵的不同表情',
                    '比较兵马俑的高矮胖瘦',
                    '拍摄孩子与兵马俑的合照',
                    '购买兵马俑玩具作为纪念'
                ],
                '7-12': [
                    '了解秦始皇统一中国的历史',
                    '学习兵马俑的发现过程',
                    '观察不同兵种的装备差异',
                    '了解古代军事编制',
                    '思考古代工匠的智慧',
                    '参加考古体验活动'
                ],
                '13-18': [
                    '深入研究秦朝政治制度',
                    '分析兵马俑的艺术价值',
                    '了解考古学研究方法',
                    '思考文化遗产保护问题',
                    '探讨秦文化的历史影响',
                    '撰写研究报告'
                ]
            },
            child: {
                '3-6': [
                    '数一数能看到多少个士兵',
                    '找到最高的兵马俑',
                    '看看他们穿的衣服',
                    '找一找骑马的士兵',
                    '看看士兵的发型',
                    '想象他们在说什么',
                    '学会说"兵马俑"三个字'
                ],
                '7-12': [
                    '了解兵马俑的制作工艺',
                    '区分不同兵种：步兵、骑兵、车兵',
                    '观察兵马俑的面部表情差异',
                    '了解秦朝的历史背景',
                    '学习考古发掘的基本知识',
                    '思考古代军队的组织方式',
                    '记录最印象深刻的发现'
                ],
                '13-18': [
                    '研究兵马俑反映的秦代社会',
                    '分析制作工艺的技术水平',
                    '了解世界文化遗产价值',
                    '探讨保护与开发的平衡',
                    '比较世界各地的古代文明',
                    '制作专题研究报告'
                ]
            }
        }
    },
    {
        id: 'nanjing-museum',
        name: '南京博物院',
        location: '南京',
        description: '中国最早创建的博物馆，藏品丰富多样',
        tags: ['历史', '艺术', '民俗'],
        checklists: {
            parent: {
                '3-6': [
                    '参观民国馆，体验老南京街道',
                    '在数字馆使用互动设备',
                    '观看适合儿童的展示视频',
                    '参与手工制作活动',
                    '在仿古街道拍照留念',
                    '品尝传统小食'
                ],
                '7-12': [
                    '了解南京作为古都的历史',
                    '参观历史馆的精品文物',
                    '体验传统手工艺制作',
                    '学习江南文化特色',
                    '了解民国时期历史',
                    '参加教育活动'
                ],
                '13-18': [
                    '研究南京的历史地位',
                    '深入了解六朝文化',
                    '分析江南地区文化特色',
                    '了解博物馆学理论',
                    '参观学术性特展',
                    '撰写文化研究报告'
                ]
            },
            child: {
                '3-6': [
                    '在民国街道找到老式电车',
                    '看看古代小朋友的玩具',
                    '找到最漂亮的瓷器',
                    '在数字馆玩互动游戏',
                    '学会一个南京话词汇',
                    '品尝一种传统小食',
                    '拍一张古装照片'
                ],
                '7-12': [
                    '了解南京作为六朝古都的历史',
                    '观察不同朝代的文物差异',
                    '学习传统手工艺技法',
                    '了解民国时期的生活方式',
                    '探索数字化展示技术',
                    '记录江南文化特色',
                    '制作一件手工作品'
                ],
                '13-18': [
                    '研究南京历史文化的演变',
                    '分析地域文化的形成原因',
                    '了解文物保护修复技术',
                    '探讨传统与现代的融合',
                    '参与文化传承项目',
                    '创作文化主题作品'
                ]
            }
        }
    },
    {
        id: 'hubei-museum',
        name: '湖北省博物馆',
        location: '武汉',
        description: '以出土文物为主要特色，曾侯乙编钟闻名世界',
        tags: ['历史', '音乐', '青铜器'],
        checklists: {
            parent: {
                '3-6': [
                    '重点参观编钟展厅',
                    '让孩子听编钟演奏',
                    '观察青铜器的动物造型',
                    '参加音乐互动体验',
                    '讲述古代音乐的故事',
                    '购买编钟玩具'
                ],
                '7-12': [
                    '了解曾侯乙墓的发现过程',
                    '学习古代音乐理论',
                    '观察青铜工艺技术',
                    '了解楚文化特色',
                    '参加考古体验活动',
                    '学习一首古代乐曲'
                ],
                '13-18': [
                    '研究楚文化的独特性',
                    '分析古代音乐体系',
                    '了解考古学方法',
                    '探讨文物的科学价值',
                    '参与学术讲座',
                    '撰写专题研究'
                ]
            },
            child: {
                '3-6': [
                    '听一听编钟的美妙声音',
                    '数一数有多少个钟',
                    '找到最大的那个钟',
                    '看看青铜器上的小动物',
                    '学会打拍子',
                    '模仿古代人敲钟的样子',
                    '唱一首自己会的歌'
                ],
                '7-12': [
                    '了解编钟的制作原理',
                    '学习古代音乐知识',
                    '观察不同大小钟的音调差异',
                    '了解楚国的历史文化',
                    '尝试演奏简单乐器',
                    '记录古代乐器的种类',
                    '创作一首关于编钟的诗'
                ],
                '13-18': [
                    '研究中国古代音乐体系',
                    '分析编钟的科学原理',
                    '了解楚文化的艺术特色',
                    '探索音乐考古学',
                    '比较中外古代音乐',
                    '制作音乐文化报告'
                ]
            }
        }
    }
];

class MuseumCheckApp {
    constructor() {
        this.currentAge = document.getElementById('ageGroup').value;
        this.visitedMuseums = this.loadVisitedMuseums();
        this.museumChecklists = this.loadMuseumChecklists();
        this.init();
    }

    // Google Analytics tracking helper
    trackEvent(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined' && window.GA_MEASUREMENT_ID !== 'GA_MEASUREMENT_ID') {
            gtag('event', eventName, parameters);
        }
    }

    init() {
        this.setupEventListeners();
        this.renderMuseums();
        this.updateStats();
    }

    setupEventListeners() {
        // Age group selector
        document.getElementById('ageGroup').addEventListener('change', (e) => {
            const oldAge = this.currentAge;
            this.currentAge = e.target.value;
            this.renderMuseums();
            
            // Track age group change
            this.trackEvent('age_group_changed', {
                'previous_age': oldAge,
                'new_age': this.currentAge
            });
        });

        // Modal close
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        // Click outside modal to close
        document.getElementById('museumModal').addEventListener('click', (e) => {
            if (e.target.id === 'museumModal') {
                this.closeModal();
            }
        });
    }

    loadVisitedMuseums() {
        const saved = localStorage.getItem('visitedMuseums');
        return saved ? JSON.parse(saved) : [];
    }

    saveVisitedMuseums() {
        localStorage.setItem('visitedMuseums', JSON.stringify(this.visitedMuseums));
    }

    loadMuseumChecklists() {
        const saved = localStorage.getItem('museumChecklists');
        return saved ? JSON.parse(saved) : {};
    }

    saveMuseumChecklists() {
        localStorage.setItem('museumChecklists', JSON.stringify(this.museumChecklists));
    }

    renderMuseums() {
        const grid = document.getElementById('museumGrid');
        grid.innerHTML = '';

        MUSEUMS.forEach(museum => {
            const isVisited = this.visitedMuseums.includes(museum.id);
            const card = document.createElement('div');
            card.className = `museum-card ${isVisited ? 'visited' : ''}`;
            card.innerHTML = `
                <div class="museum-header">
                    <input type="checkbox" class="visit-checkbox" ${isVisited ? 'checked' : ''} 
                           data-museum="${museum.id}">
                    <div class="museum-info">
                        <h3>${museum.name}</h3>
                        <div class="museum-location">📍 ${museum.location}</div>
                    </div>
                </div>
                <p class="museum-description">${museum.description}</p>
                <div class="museum-tags">
                    ${museum.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `;

            // Add click event for the card (excluding checkbox)
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('visit-checkbox')) {
                    this.openMuseumModal(museum);
                }
            });

            // Add checkbox event
            const checkbox = card.querySelector('.visit-checkbox');
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                this.toggleMuseumVisit(museum.id);
            });

            grid.appendChild(card);
        });

        this.updateStats();
    }

    toggleMuseumVisit(museumId) {
        const index = this.visitedMuseums.indexOf(museumId);
        const museum = MUSEUMS.find(m => m.id === museumId);
        const isNowVisited = index === -1;
        
        if (index > -1) {
            this.visitedMuseums.splice(index, 1);
        } else {
            this.visitedMuseums.push(museumId);
        }
        this.saveVisitedMuseums();
        this.renderMuseums();
        
        // Track museum visit toggle
        this.trackEvent('museum_visit_toggled', {
            'museum_id': museumId,
            'museum_name': museum ? museum.name : '',
            'museum_location': museum ? museum.location : '',
            'visited': isNowVisited,
            'age_group': this.currentAge
        });
    }

    updateStats() {
        const visitedCount = this.visitedMuseums.length;
        const totalCount = MUSEUMS.length;
        const percentage = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;

        document.getElementById('visitedCount').textContent = visitedCount;
        document.getElementById('totalCount').textContent = totalCount;
        document.getElementById('visitedPercentage').textContent = percentage;
    }

    openMuseumModal(museum) {
        const modal = document.getElementById('museumModal');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');

        title.textContent = `${museum.name} - 参观指南`;

        content.innerHTML = `
            <div class="checklist-tabs">
                <button class="tab-button active" data-target="parent">家长准备</button>
                <button class="tab-button" data-target="child">孩子任务</button>
            </div>
            <div id="parentChecklist" class="checklist-content">
                <h3>家长准备事项</h3>
                ${this.renderChecklist(museum.id, 'parent', museum.checklists.parent[this.currentAge])}
            </div>
            <div id="childChecklist" class="checklist-content" style="display: none;">
                <h3>孩子探索任务</h3>
                ${this.renderChecklist(museum.id, 'child', museum.checklists.child[this.currentAge])}
            </div>
        `;

        // Setup tab switching
        const tabButtons = content.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.dataset.target;
                
                // Update active tab
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show corresponding content
                document.getElementById('parentChecklist').style.display = target === 'parent' ? 'block' : 'none';
                document.getElementById('childChecklist').style.display = target === 'child' ? 'block' : 'none';
            });
        });

        modal.classList.remove('hidden');
        
        // Track modal open
        this.trackEvent('museum_modal_opened', {
            'museum_id': museum.id,
            'museum_name': museum.name,
            'museum_location': museum.location,
            'age_group': this.currentAge
        });
    }

    renderChecklist(museumId, type, items) {
        const checklistKey = `${museumId}-${type}-${this.currentAge}`;
        const completed = this.museumChecklists[checklistKey] || [];

        return items.map((item, index) => {
            const itemId = `${checklistKey}-${index}`;
            const isCompleted = completed.includes(index);
            
            return `
                <div class="checklist-item ${isCompleted ? 'completed' : ''}">
                    <input type="checkbox" id="${itemId}" ${isCompleted ? 'checked' : ''} 
                           data-checklist="${checklistKey}" data-index="${index}">
                    <label for="${itemId}">${item}</label>
                </div>
            `;
        }).join('') + this.addChecklistEventListeners();
    }

    addChecklistEventListeners() {
        // This is a bit of a hack - we'll add event listeners after rendering
        setTimeout(() => {
            const checkboxes = document.querySelectorAll('#modalContent input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const checklistKey = e.target.dataset.checklist;
                    const index = parseInt(e.target.dataset.index);
                    
                    if (!this.museumChecklists[checklistKey]) {
                        this.museumChecklists[checklistKey] = [];
                    }
                    
                    const completed = this.museumChecklists[checklistKey];
                    const itemIndex = completed.indexOf(index);
                    
                    if (e.target.checked && itemIndex === -1) {
                        completed.push(index);
                    } else if (!e.target.checked && itemIndex > -1) {
                        completed.splice(itemIndex, 1);
                    }
                    
                    this.saveMuseumChecklists();
                    
                    // Track checklist item completion
                    const keyParts = checklistKey.split('-');
                    const museumId = keyParts[0];
                    const checklistType = keyParts[1];
                    const ageGroup = keyParts[2];
                    const museum = MUSEUMS.find(m => m.id === museumId);
                    const itemText = museum && museum.checklists[checklistType] && museum.checklists[checklistType][ageGroup] ? 
                                   museum.checklists[checklistType][ageGroup][index] : '';
                    
                    this.trackEvent('checklist_item_toggled', {
                        'museum_id': museumId,
                        'museum_name': museum ? museum.name : '',
                        'checklist_type': checklistType,
                        'age_group': ageGroup,
                        'item_index': index,
                        'item_text': itemText,
                        'completed': e.target.checked
                    });
                    
                    // Update visual state
                    const item = e.target.closest('.checklist-item');
                    if (e.target.checked) {
                        item.classList.add('completed');
                    } else {
                        item.classList.remove('completed');
                    }
                });
            });
        }, 100);
        
        return '';
    }

    closeModal() {
        document.getElementById('museumModal').classList.add('hidden');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MuseumCheckApp();
});