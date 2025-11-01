window.MUSEUM_PINGHU = {
  id: 'pinghu-museum',
  name: '平湖博物馆',
  location: '平湖',
  description: '展示平湖历史与地方文化的综合性博物馆',
  tags: ['历史', '地方', '文化'],
  collections: [
    { name: '唐铸铁佛头', url: 'https://www.pinghumuseum.com:9001/kindeditorupload/image/2022-09-25/633065c3bddd3.jpg' },
    { name: '新石器时代崧泽文化夹砂红陶鼎', url: 'https://www.pinghumuseum.com:9001/kindeditorupload/image/2022-09-25/63305db12e457.jpg' },
    { name: '新石器时代良渚文化黑皮陶盉', url: 'https://www.pinghumuseum.com:9001/kindeditorupload/image/2022-09-25/633060a43fd82.jpg' }
  ],
  workflows: [
    {
      id: 'quick-family-visit',
      name: '亲子轻松游',
      description: '适合首次参观，轻量打卡+趣味探索',
      ages: ['3-6','7-12'],
      tasks: {
        enroute: [
          { id: 'simple-prep', role: 'parent', type: 'tts', title: '准备出发', subtitle: '带水杯、湿巾、轻便鞋', tts: '我们要去平湖博物馆看家乡的宝贝啦！记得带水杯和湿巾，今天我们要用"找找看"游戏来寻找鱼、船和稻谷～', ages: ['3-6','7-12'] }
        ],
        visit: [
          { id: 'entrance-checkin', role: 'parent', type: 'photo', title: '门口打卡', subtitle: '博物馆入口合影留念', ages: ['3-6','7-12','13-18'] },
          { id: 'treasure-hunt', role: 'child', type: 'confirm', title: '寻宝游戏', subtitle: '用"找找看"游戏找鱼、船、稻谷的图片', ages: ['3-6','7-12'] },
          { id: 'heritage-experience', role: 'child', type: 'confirm', title: '非遗小体验', subtitle: '找一个你最喜欢的手工（比如编织、木作），学它的名字', ages: ['3-6','7-12'] },
          { id: 'hometown-recognition', role: 'child', type: 'confirm', title: '家乡认同', subtitle: '让孩子在地图上找到"平湖"，说说家里离博物馆有多远', ages: ['3-6','7-12'] },
          { id: 'celebration-photo', role: 'parent', type: 'photo', title: '探险完成', subtitle: '和家人击掌庆祝完成家乡博物馆探险', ages: ['3-6','7-12','13-18'] }
        ]
      }
    },
    {
      id: 'hometown-discovery',
      name: '家乡探索之旅',
      description: '认识家乡，了解平湖的故事，适合低龄儿童',
      ages: ['3-6','7-12'],
      tasks: {
        enroute: [
          { id: 'nearby-prep', role: 'parent', type: 'tts', title: '快到啦', subtitle: '告诉孩子我们要去了解平湖的故事', tts: '我们快到平湖博物馆啦！今天我们要一起探索家乡的故事，找找鱼、船和稻谷，还要在地图上找到平湖哦～', ages: ['3-6','7-12'] }
        ],
        visit: [
          { id: 'gate-photo', role: 'parent', type: 'photo', title: '门口打卡', subtitle: '博物馆入口合影', ages: ['3-6','7-12','13-18'] },
          { id: 'find-fish', role: 'child', type: 'confirm', title: '找找鱼', subtitle: '在展品或图片里找到不同的鱼，数一数看到了几条', ages: ['3-6'] },
          { id: 'find-boat', role: 'child', type: 'confirm', title: '小船在哪里', subtitle: '看看古代人坐什么样的船，学划船的动作拍一张照片', ages: ['3-6'] },
          { id: 'rice-detective', role: 'child', type: 'confirm', title: '稻谷小侦探', subtitle: '找到稻谷或农具，说说农民伯伯怎么种田', ages: ['3-6'] },
          { id: 'water-city', role: 'child', type: 'confirm', title: '水系与城市', subtitle: '在地图上标出河道/湖泊，解释"因水而兴"的含义', ages: ['7-12'] },
          { id: 'shipping-trade', role: 'child', type: 'confirm', title: '航运与商贸', subtitle: '找与航运相关的展品（船模、码头器具、票据），写下其用途', ages: ['7-12'] },
          { id: 'find-pinghu', role: 'child', type: 'confirm', title: '找到"平湖"', subtitle: '在地图上指着平湖，说"这是我的家乡！"', ages: ['3-6','7-12'] },
          { id: 'victory-photo', role: 'parent', type: 'photo', title: '亲子合影', subtitle: '在平湖历史时间轴前或非遗区合影', ages: ['3-6','7-12','13-18'] }
        ]
      }
    },
    {
      id: 'water-culture-exploration',
      name: '水乡文化探秘',
      description: '深入了解平湖水乡文化与手工艺传承',
      ages: ['7-12','13-18'],
      tasks: {
        enroute: [
          { id: 'culture-prep', role: 'parent', type: 'tts', title: '了解背景', subtitle: '平湖因水而兴，兼具农耕、商贸与渔业文化', tts: '平湖是典型的江南水乡，因运河、河网和泖湖而兴盛。我们今天要探索水系如何影响城市发展，还要了解传统手工艺哦～', ages: ['7-12','13-18'] }
        ],
        visit: [
          { id: 'entrance-photo', role: 'parent', type: 'photo', title: '博物馆打卡', subtitle: '在平湖博物馆门口合影', ages: ['7-12','13-18'] },
          { id: 'craft-work', role: 'child', type: 'confirm', title: '匠作工艺', subtitle: '选择一种地方手工（如丝织/木作），画下其纹样或结构要点', ages: ['7-12'] },
          { id: 'family-roots', role: 'child', type: 'confirm', title: '家族与乡土', subtitle: '观察族谱/契约/牌匾等文献，记录一条你最有兴趣的信息', ages: ['7-12'] },
          { id: 'nature-observation', role: 'child', type: 'confirm', title: '自然观察', subtitle: '在自然生态角识别1-2种湿地动植物，说明它们与人们生活的关系', ages: ['7-12'] },
          { id: 'regional-development', role: 'child', type: 'confirm', title: '区域发展研究', subtitle: '梳理"水系→交通→产业→城镇"的因果链，举出平湖的例证', ages: ['13-18'] },
          { id: 'heritage-inheritance', role: 'child', type: 'confirm', title: '非遗传承', subtitle: '采访或查找资料，思考非遗如何在现代生活中创新表达', ages: ['13-18'] },
          { id: 'sharing-moment', role: 'child', type: 'confirm', title: '分享时刻', subtitle: '当小讲解员，向家人介绍今天学到的三条本地文化知识', ages: ['7-12','13-18'] },
          { id: 'final-photo', role: 'parent', type: 'photo', title: '胜利合影', subtitle: '在最喜欢的展区前留念', ages: ['7-12','13-18'] }
        ]
      }
    },
    {
      id: 'treasure-discovery',
      name: '镇馆之宝探索',
      description: '围绕平湖博物馆三大镇馆之宝的亲子探索路线',
      ages: ['3-6', '7-12'],
      tasks: {
        enroute: [],
        visit: [
          { id: 'gate-photo', role: 'parent', type: 'photo', title: '门口打卡', subtitle: '博物馆门口合影', ages: ['3-6','7-12','13-18'] },
          { id: 'find-buddha', role: 'child', type: 'photo', title: '镇馆之宝：佛头', subtitle: '找到「唐铸铁佛头」并合影', ages: ['3-6','7-12','13-18'] },
          { id: 'find-ding', role: 'child', type: 'photo', title: '镇馆之宝：陶鼎', subtitle: '找到「新石器时代崧泽文化夹砂红陶鼎」并合影', ages: ['3-6','7-12','13-18'] },
          { id: 'find-he', role: 'child', type: 'photo', title: '镇馆之宝：陶盉', subtitle: '找到「新石器时代良渚文化黑皮陶盉」并合影', ages: ['3-6','7-12','13-18'] },
          { id: 'victory-photo', role: 'parent', type: 'photo', title: '亲子合影', subtitle: '和家长比心/拥抱/击掌等动作合影', ages: ['3-6','7-12','13-18'] }
        ]
      }
    }
  ],
  checklists: {
    parent: {
      '3-6': [
        '🎫 入馆准备：告诉孩子我们要去了解平湖的故事（带水杯、湿巾、轻便鞋）',
        '🗺️ 参观路线：序厅 → 平湖历史展 → 非遗与民俗展 → 自然生态角（约60-90分钟）',
        '🏠 家乡认同：让孩子在地图上找到“平湖”，说说家里离博物馆有多远',
        '🧸 互动方法：用“找找看”游戏吸引注意力（找鱼、找船、找稻谷的图片）',
        '📸 打卡建议：在“平湖历史时间轴”前合影 + 在非遗区和手工实物合影',
        '💞 情感连接：每当孩子有新发现，蹲下与他同视线，说“你发现得真仔细！”'
      ],
      '7-12': [
        '📱 智慧导览：提前了解展厅分布与亮点展品，准备小本子做“平湖十大发现”',
        '📚 地方史基础：平湖因水而兴（运河/河网/泖湖），兼具农耕、商贸与渔业文化',
        '🏺 文物观察法：学会看年代、材质、用途三要素，尝试给展品写“小标签”',
        '🧭 路线建议：历史发展 → 经济与手工业 → 非遗与匠作 → 自然生态与湿地',
        '💬 亲子讨论：为什么城市会因水而兴？水路贸易对平湖有什么影响？',
        '🎊 成就展示：参观结束制作“我的平湖文化卡”，记录三件最有感的展品'
      ],
      '13-18': [
        '🎓 学术准备：预习平湖区域史与江南民俗，理解水网与城镇发展的关系',
        '🏛️ 展陈方法：关注叙事逻辑（时间轴/主题单元/重点实物），评估展示的完整性',
        '🧵 匠作与非遗：调研平湖的传统手工（如蚕桑丝织、木作、米行商号等）与现代传承',
        '📊 观察方法：从“人口-经济-交通-产业”维度整理地方发展的演变图谱',
        '💭 思辨话题：地方博物馆如何兼顾学术性与公共教育？如何让年轻人更愿意走近家乡史？',
        '📝 输出成果：撰写“平湖文化与水系文明”的参观札记或短评'
      ]
    },
    child: {
      '3-6': [
        '📸 门口打卡：家长给孩子在博物馆门口拍一张照片',
        '🏺 镇馆之宝：找到「唐铸铁佛头」并合影',
        '🏺 镇馆之宝：找到「新石器时代崧泽文化夹砂红陶鼎」并合影',
        '🏺 镇馆之宝：找到「新石器时代良渚文化黑皮陶盉」并合影',
        '📸 亲子合影：和家长比心/拥抱/击掌等动作合影'
      ],
      '7-12': [
        '📸 门口打卡：家长给孩子在博物馆门口拍一张照片',
        '🏺 镇馆之宝：找到「唐铸铁佛头」并合影',
        '🏺 镇馆之宝：找到「新石器时代崧泽文化夹砂红陶鼎」并合影',
        '🏺 镇馆之宝：找到「新石器时代良渚文化黑皮陶盉」并合影',
        '📸 亲子合影：和家长比心/拥抱/击掌等动作合影'
      ],
      '13-18': [
        '📸 门口打卡：家长给孩子在博物馆门口拍一张照片',
        '🏺 镇馆之宝：找到「唐铸铁佛头」并合影',
        '🏺 镇馆之宝：找到「新石器时代崧泽文化夹砂红陶鼎」并合影',
        '🏺 镇馆之宝：找到「新石器时代良渚文化黑皮陶盉」并合影',
        '📸 亲子合影：和家长比心/拥抱/击掌等动作合影'
      ]
    }
  }
};
