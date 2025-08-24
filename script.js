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
    },
    {
        id: 'shaanxi-history',
        name: '陕西历史博物馆',
        location: '西安',
        description: '中国第一座大型现代化国家级博物馆，被誉为"古都明珠，华夏宝库"',
        tags: ['历史', '文物', '古代文明'],
        checklists: {
            parent: {
                '3-6': [
                    '提前了解馆内重要文物位置',
                    '准备简单的朝代故事给孩子听',
                    '带上小画本让孩子涂画喜欢的文物',
                    '重点参观唐代文物展厅',
                    '寻找颜色鲜艳的彩绘陶俑',
                    '指出不同材质：金、银、铜、陶',
                    '在纪念品店选购小礼品'
                ],
                '7-12': [
                    '学习周秦汉唐四个朝代的基本知识',
                    '重点观察唐三彩和金银器',
                    '了解丝绸之路的历史意义',
                    '寻找馆藏的国宝级文物',
                    '观察古代工艺品的制作技巧',
                    '参加互动体验活动',
                    '记录印象最深的三件文物'
                ],
                '13-18': [
                    '深入了解陕西在中国历史中的地位',
                    '分析不同时期文物的艺术风格',
                    '研究古代丝绸之路贸易文化',
                    '探讨文物保护技术的发展',
                    '了解考古发现的学术价值',
                    '参与专题讲座和学术活动'
                ]
            },
            child: {
                '3-6': [
                    '找一找金光闪闪的宝物',
                    '数一数有多少个小马',
                    '看看古代人的衣服是什么颜色',
                    '找到最漂亮的花纹',
                    '学会说"唐三彩"三个字',
                    '看看古代的镜子',
                    '找一个和自己一样高的文物'
                ],
                '7-12': [
                    '了解唐三彩的制作过程',
                    '寻找丝绸之路相关文物',
                    '观察古代人的日常用品',
                    '学习古代货币的知识',
                    '探索古代科技成就',
                    '参与文物拼图游戏',
                    '绘制自己喜欢的文物'
                ],
                '13-18': [
                    '研究陕西地区古代文明发展',
                    '分析唐代文化的国际影响',
                    '探讨文物修复的科学方法',
                    '了解博物馆的研究功能',
                    '制作历史文化专题报告',
                    '参与模拟考古活动'
                ]
            }
        }
    },
    {
        id: 'china-science-museum',
        name: '中国科学技术馆',
        location: '北京',
        description: '国家级综合性科技馆，展示科学原理及技术应用的互动式博物馆',
        tags: ['科技', '互动', '教育'],
        checklists: {
            parent: {
                '3-6': [
                    '选择适合低龄的互动展项',
                    '准备简单的科学小故事',
                    '关注孩子的安全，避免过于刺激的项目',
                    '重点参观儿童科学乐园',
                    '带上相机记录孩子的探索过程',
                    '预约科学表演的观看时间',
                    '准备小奖励鼓励孩子提问'
                ],
                '7-12': [
                    '提前了解各展厅的主题内容',
                    '鼓励孩子动手参与互动实验',
                    '解释基本的科学原理',
                    '参观机器人和人工智能展区',
                    '体验虚拟现实技术',
                    '观看科学实验表演',
                    '引导孩子思考科学与生活的关系'
                ],
                '13-18': [
                    '深入探讨前沿科技发展',
                    '参与高级科学实验',
                    '了解中国科技创新成就',
                    '探索STEAM教育理念',
                    '参加科学讲座和工作坊',
                    '思考科技伦理问题'
                ]
            },
            child: {
                '3-6': [
                    '按一按各种有趣的按钮',
                    '看看会动的机器人',
                    '玩一玩水的游戏',
                    '坐一坐小火车',
                    '听一听奇怪的声音',
                    '摸一摸不同的材料',
                    '看一场神奇的表演'
                ],
                '7-12': [
                    '体验各种科学实验',
                    '了解机器人的工作原理',
                    '探索声光电的奥秘',
                    '学习航空航天知识',
                    '参与编程入门活动',
                    '观察显微镜下的世界',
                    '制作简单的科学作品'
                ],
                '13-18': [
                    '深入理解科学原理',
                    '参与复杂实验操作',
                    '探索人工智能技术',
                    '了解生物技术发展',
                    '参加科技创新竞赛',
                    '制作科技项目报告'
                ]
            }
        }
    },
    {
        id: 'suzhou-museum',
        name: '苏州博物馆',
        location: '苏州',
        description: '由建筑大师贝聿铭设计，集现代建筑与苏州古典园林于一体的艺术博物馆',
        tags: ['艺术', '建筑', '江南文化'],
        checklists: {
            parent: {
                '3-6': [
                    '欣赏贝聿铭的现代建筑设计',
                    '参观室内的小庭院',
                    '寻找建筑中的几何形状',
                    '观察光线在建筑中的运用',
                    '重点看江南文物和书画',
                    '在博物馆商店选购文创产品',
                    '拍摄建筑与光影的照片'
                ],
                '7-12': [
                    '了解苏州的历史文化',
                    '学习江南园林的设计理念',
                    '观察古代文人的书房用品',
                    '了解苏州丝绸和刺绣工艺',
                    '参观古代书画作品',
                    '学习中国传统建筑知识',
                    '体验传统工艺制作'
                ],
                '13-18': [
                    '分析贝聿铭的建筑哲学',
                    '研究江南文化的特色',
                    '了解中国古代文人文化',
                    '探讨传统与现代的融合',
                    '参与艺术鉴赏活动',
                    '研究博物馆建筑学'
                ]
            },
            child: {
                '3-6': [
                    '找一找最亮的地方',
                    '数一数有多少个小院子',
                    '看看建筑像什么形状',
                    '找到最喜欢的颜色',
                    '听听水的声音',
                    '看看古代的小玩具',
                    '在漂亮的地方拍照'
                ],
                '7-12': [
                    '了解苏州园林的特点',
                    '观察古代文房四宝',
                    '学习江南建筑风格',
                    '探索丝绸的制作过程',
                    '欣赏古代书法作品',
                    '参与传统游戏体验',
                    '制作江南风格手工'
                ],
                '13-18': [
                    '研究建筑空间设计',
                    '分析江南文化内涵',
                    '了解古代文人生活',
                    '探讨艺术与建筑关系',
                    '参与文化创意设计',
                    '制作建筑模型'
                ]
            }
        }
    },
    {
        id: 'zhejiang-museum',
        name: '浙江省博物馆',
        location: '杭州',
        description: '浙江省内规模最大的综合性人文科学博物馆，展示浙江悠久历史和灿烂文化',
        tags: ['历史', '文化', '江南'],
        checklists: {
            parent: {
                '3-6': [
                    '重点参观陶瓷和玉器展厅',
                    '寻找色彩丰富的文物',
                    '准备关于西湖的小故事',
                    '观察古代人的生活用品',
                    '带孩子看看古代的钱币',
                    '在文物中寻找动物图案',
                    '购买适合的儿童读物'
                ],
                '7-12': [
                    '了解浙江的历史文化',
                    '学习越窑青瓷的知识',
                    '观察古代书画作品',
                    '了解良渚文化的意义',
                    '参观自然标本展厅',
                    '学习古代手工艺技术',
                    '参加博物馆教育活动'
                ],
                '13-18': [
                    '深入研究浙江地方史',
                    '分析越窑青瓷的艺术价值',
                    '了解良渚文明的考古发现',
                    '探讨江南文化的形成',
                    '参与学术讲座',
                    '研究博物馆收藏体系'
                ]
            },
            child: {
                '3-6': [
                    '找一找绿色的瓷器',
                    '看看古代的小动物',
                    '数一数有多少种颜色',
                    '找到最光滑的石头',
                    '看看古代人用的碗',
                    '听听关于西湖的故事',
                    '找一件像自己玩具的文物'
                ],
                '7-12': [
                    '了解青瓷的制作过程',
                    '学习良渚文化知识',
                    '观察古代工艺品',
                    '探索浙江自然环境',
                    '参与手工制作活动',
                    '学习古代人的智慧',
                    '绘制印象深刻的文物'
                ],
                '13-18': [
                    '研究浙江文化特色',
                    '分析青瓷艺术发展',
                    '了解考古学研究方法',
                    '探讨文化传承问题',
                    '参与文化研究项目',
                    '制作专题展示'
                ]
            }
        }
    },
    {
        id: 'guangdong-museum',
        name: '广东省博物馆',
        location: '广州',
        description: '华南地区最大的综合性博物馆，展示岭南文化和海上丝绸之路历史',
        tags: ['岭南文化', '海丝', '文物'],
        checklists: {
            parent: {
                '3-6': [
                    '参观岭南特色文物展厅',
                    '寻找色彩鲜艳的广彩瓷器',
                    '观察岭南建筑模型',
                    '了解广东的特色食物文化',
                    '看看古代的船只模型',
                    '在自然馆观看动植物标本',
                    '体验传统广式茶文化'
                ],
                '7-12': [
                    '了解岭南文化的特色',
                    '学习海上丝绸之路历史',
                    '观察广彩和广雕工艺',
                    '了解广东近现代历史',
                    '参观恐龙化石展',
                    '学习岭南建筑特点',
                    '参加传统工艺体验'
                ],
                '13-18': [
                    '深入研究岭南文化内涵',
                    '分析海丝贸易的历史影响',
                    '了解广东改革开放历程',
                    '探讨文化多元性',
                    '参与学术研讨',
                    '研究博物馆教育功能'
                ]
            },
            child: {
                '3-6': [
                    '找一找最漂亮的花纹',
                    '看看大恐龙的骨头',
                    '数一数船上有多少帆',
                    '找到红色的瓷器',
                    '看看古代人住的房子',
                    '听听广东话怎么说',
                    '找一找小鸟和小鱼'
                ],
                '7-12': [
                    '了解广彩瓷器的特点',
                    '学习海上丝路的故事',
                    '观察岭南建筑风格',
                    '探索恐龙生活时代',
                    '了解广东传统工艺',
                    '参与互动游戏',
                    '学习粤语文化知识'
                ],
                '13-18': [
                    '研究岭南文化发展',
                    '分析海丝贸易模式',
                    '了解广东历史变迁',
                    '探讨文化交融现象',
                    '参与文化调研',
                    '制作岭南文化专题'
                ]
            }
        }
    },
    {
        id: 'sichuan-museum',
        name: '四川博物院',
        location: '成都',
        description: '西南地区最大的综合性博物馆，展示巴蜀文化和四川历史',
        tags: ['巴蜀文化', '历史', '民俗'],
        checklists: {
            parent: {
                '3-6': [
                    '参观四川特色文物展',
                    '观看三星堆文化相关展品',
                    '了解大熊猫的相关知识',
                    '看看古代四川人的生活',
                    '寻找色彩丰富的民族服饰',
                    '观察古代的青铜器',
                    '品尝四川特色小食'
                ],
                '7-12': [
                    '学习巴蜀文化历史',
                    '了解三星堆和金沙遗址',
                    '观察四川汉代画像砖',
                    '学习四川民族文化',
                    '了解茶马古道历史',
                    '参观民俗文化展',
                    '体验传统手工艺'
                ],
                '13-18': [
                    '深入研究巴蜀文明',
                    '分析四川地域文化特色',
                    '了解四川在中国历史中的作用',
                    '探讨多民族文化融合',
                    '参与考古学研究',
                    '研究博物馆收藏特色'
                ]
            },
            child: {
                '3-6': [
                    '找一找青铜面具',
                    '看看大熊猫的标本',
                    '数一数有多少种颜色的衣服',
                    '找到最奇怪的形状',
                    '看看古代人的房子',
                    '听听四川话怎么说',
                    '找一找小动物图案'
                ],
                '7-12': [
                    '了解三星堆文明',
                    '学习四川历史故事',
                    '观察古代青铜工艺',
                    '探索巴蜀文字',
                    '了解四川民族服饰',
                    '参与文化体验活动',
                    '学习传统技艺'
                ],
                '13-18': [
                    '研究巴蜀文化内涵',
                    '分析四川考古发现',
                    '了解四川文化多样性',
                    '探讨古蜀文明特色',
                    '参与学术交流',
                    '制作文化研究报告'
                ]
            }
        }
    },
    {
        id: 'henan-museum',
        name: '河南博物院',
        location: '郑州',
        description: '中国建立较早的博物馆之一，以展示中原文化为主的综合性博物馆',
        tags: ['中原文化', '文物', '历史'],
        checklists: {
            parent: {
                '3-6': [
                    '重点观看彩陶和青铜器',
                    '寻找动物造型的文物',
                    '观察古代人使用的工具',
                    '了解河南的历史地位',
                    '看看古代的文字演变',
                    '参观恐龙化石展厅',
                    '购买教育意义的纪念品'
                ],
                '7-12': [
                    '学习中原文化的重要性',
                    '了解河南出土的重要文物',
                    '观察商代青铜器工艺',
                    '学习汉字的起源和发展',
                    '了解古代都城的建设',
                    '参观佛教艺术展览',
                    '参加文物知识竞赛'
                ],
                '13-18': [
                    '深入研究中原文明',
                    '分析河南在中国历史中的地位',
                    '了解考古学的发展历程',
                    '探讨文物保护技术',
                    '参与学术讲座',
                    '研究博物馆学理论'
                ]
            },
            child: {
                '3-6': [
                    '找一找青铜小动物',
                    '看看最大的恐龙',
                    '数一数有多少个罐子',
                    '找到最漂亮的颜色',
                    '看看古代人的文字',
                    '找一找圆形的东西',
                    '听听中原的故事'
                ],
                '7-12': [
                    '了解商朝的历史',
                    '学习青铜器制作',
                    '观察古代文字发展',
                    '探索中原文化特色',
                    '了解考古发现过程',
                    '参与手工制作',
                    '学习历史知识'
                ],
                '13-18': [
                    '研究中原文明发展',
                    '分析考古发现意义',
                    '了解博物馆研究功能',
                    '探讨文化传承问题',
                    '参与学术活动',
                    '制作历史专题报告'
                ]
            }
        }
    },
    {
        id: 'liaoning-museum',
        name: '辽宁省博物馆',
        location: '沈阳',
        description: '以辽宁地区考古发现和历史文物为主的综合性博物馆',
        tags: ['东北文化', '考古', '历史'],
        checklists: {
            parent: {
                '3-6': [
                    '观看辽代和金代文物',
                    '寻找动物造型的工艺品',
                    '了解东北地区的历史',
                    '观察古代人的服饰',
                    '看看古代的生活用具',
                    '参观自然历史展厅',
                    '了解满族文化特色'
                ],
                '7-12': [
                    '学习东北地区历史文化',
                    '了解辽、金、元的历史',
                    '观察契丹文字和女真文字',
                    '学习满族的文化传统',
                    '了解东北的自然环境',
                    '参观民族服饰展览',
                    '参加民族文化体验'
                ],
                '13-18': [
                    '深入研究东北历史',
                    '分析多民族文化交融',
                    '了解辽宁考古成就',
                    '探讨边疆文化特色',
                    '参与民族学研究',
                    '研究博物馆民族文物'
                ]
            },
            child: {
                '3-6': [
                    '找一找小马的图案',
                    '看看漂亮的花纹',
                    '数一数有多少种动物',
                    '找到金色的宝物',
                    '看看古代人的帽子',
                    '听听东北的故事',
                    '找一找自己认识的动物'
                ],
                '7-12': [
                    '了解契丹族历史',
                    '学习古代民族文化',
                    '观察东北地区文物',
                    '探索满族传统',
                    '了解古代文字',
                    '参与文化游戏',
                    '学习民族知识'
                ],
                '13-18': [
                    '研究东北民族史',
                    '分析文化交流现象',
                    '了解考古学方法',
                    '探讨民族文化保护',
                    '参与学术讨论',
                    '制作民族文化专题'
                ]
            }
        }
    },
    {
        id: 'shandong-museum',
        name: '山东博物馆',
        location: '济南',
        description: '展示齐鲁文化和山东历史的综合性博物馆，藏品丰富多样',
        tags: ['齐鲁文化', '孔子', '历史'],
        checklists: {
            parent: {
                '3-6': [
                    '参观孔子相关文物展',
                    '观看山东特色陶瓷',
                    '寻找色彩丰富的文物',
                    '了解孔子的简单故事',
                    '观察古代的书籍和文房用品',
                    '看看山东的自然标本',
                    '参观恐龙化石展'
                ],
                '7-12': [
                    '学习齐鲁文化历史',
                    '了解孔子和儒家思想',
                    '观察山东出土文物',
                    '学习古代教育制度',
                    '了解山东的地理特色',
                    '参观书画作品展览',
                    '参加传统文化体验'
                ],
                '13-18': [
                    '深入研究齐鲁文化',
                    '分析儒家思想的影响',
                    '了解山东考古发现',
                    '探讨传统文化传承',
                    '参与儒学讨论',
                    '研究文化教育史'
                ]
            },
            child: {
                '3-6': [
                    '找一找古代的书',
                    '看看孔子的画像',
                    '数一数有多少个瓶子',
                    '找到最厚的石头',
                    '看看古代人写字的工具',
                    '听听孔子的故事',
                    '找一找恐龙骨头'
                ],
                '7-12': [
                    '了解孔子的生平',
                    '学习古代文字书写',
                    '观察齐鲁文化特色',
                    '探索古代教育方式',
                    '了解山东历史名人',
                    '参与传统游戏',
                    '学习儒家礼仪'
                ],
                '13-18': [
                    '研究儒家文化内涵',
                    '分析齐鲁文化影响',
                    '了解孔子教育思想',
                    '探讨文化传承意义',
                    '参与文化讨论',
                    '制作儒学专题研究'
                ]
            }
        }
    },
    {
        id: 'tianjin-museum',
        name: '天津博物馆',
        location: '天津',
        description: '展示天津历史文化和近代中国发展的综合性博物馆',
        tags: ['近代史', '文化', '天津'],
        checklists: {
            parent: {
                '3-6': [
                    '参观天津历史文化展',
                    '观看近代生活用品展',
                    '了解天津的地理位置',
                    '看看老天津的照片',
                    '观察古代和近代的对比',
                    '参观自然科学展厅',
                    '了解天津小吃文化'
                ],
                '7-12': [
                    '学习天津的历史发展',
                    '了解近代中国的变化',
                    '观察天津租界建筑',
                    '学习天津的工商业发展',
                    '了解海河文化',
                    '参观科技发展展览',
                    '体验近代生活方式'
                ],
                '13-18': [
                    '深入研究天津近代史',
                    '分析天津在近代中国的作用',
                    '了解中西文化交流',
                    '探讨城市发展模式',
                    '参与历史研究项目',
                    '研究博物馆城市史展示'
                ]
            },
            child: {
                '3-6': [
                    '看看老天津的样子',
                    '找一找不同的建筑',
                    '数一数有多少辆老汽车',
                    '看看古代人和现代人',
                    '找到最有趣的老物件',
                    '听听天津话怎么说',
                    '看看海河的照片'
                ],
                '7-12': [
                    '了解天津的发展历程',
                    '学习近代科技进步',
                    '观察建筑风格变化',
                    '探索天津文化特色',
                    '了解海河的作用',
                    '参与历史体验活动',
                    '学习天津民俗文化'
                ],
                '13-18': [
                    '研究天津城市发展',
                    '分析近代化进程',
                    '了解中西文化融合',
                    '探讨历史与现代关系',
                    '参与城市史研究',
                    '制作天津历史专题'
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