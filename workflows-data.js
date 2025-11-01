(function(){
  'use strict';
  // Workflow registry: keyed by museum id
  // Each workflow has id, name, description, and tasks grouped by stage
  // Stages: prep | enroute | visit | share
  // Task fields: id, role: 'parent'|'child', type: 'photo'|'confirm'|'tts'|'link', title, subtitle, tts, url
  const WORKFLOWS = {
    'forbidden-city': [
      {
        id: 'easy-family-tour',
        name: '亲子轻松游',
        description: '轻量三步走，拍照留念+简单任务，适合首次到访',
        ages: ['3-6','7-12'],
        tasks: {
          enroute: [
          ],
          visit: [
            { id: 'gate-photo', role: 'parent', type: 'photo', title: '门口打卡', subtitle: '午门前合影', ages: ['3-6','7-12','13-18'] },
            { id: 'find-dragon', role: 'child', type: 'confirm', title: '寻找神兽', subtitle: '屋檐上找到一只龙或凤凰', ages: ['3-6','7-12'] },
            { id: 'count-roof-animals', role: 'child', type: 'confirm', title: '数数瑞兽', subtitle: '数一数屋檐走兽有几只（可以和家长一起数）', ages: ['3-6','7-12'] },
            { id: 'door-nails', role: 'child', type: 'confirm', title: '门钉小秘密', subtitle: '观察一扇大门，试着数一列门钉有几个', ages: ['7-12','13-18'] },
            { id: 'victory-photo', role: 'parent', type: 'photo', title: '胜利合影', subtitle: '御花园合影', ages: ['3-6','7-12','13-18'] }
          ]
        }
      },
      {
        id: 'curation-deep',
        name: '三大殿精华',
        description: '围绕太和殿-中和殿-保和殿的精华路线',
        ages: ['7-12','13-18'],
        tasks: {
          enroute: [
          ],
          visit: [
            { id: 'taihe-photo', role: 'parent', type: 'photo', title: '太和殿', subtitle: '门前合影', ages: ['7-12','13-18'] },
            { id: 'throne-confirm', role: 'child', type: 'confirm', title: '龙椅观察', subtitle: '说出龙椅上看到的两处细节', ages: ['7-12','13-18'] },
            { id: 'zhonghe-ritual', role: 'child', type: 'confirm', title: '中和殿用途', subtitle: '中和殿在典礼流程中起到什么作用？用一句话描述', ages: ['13-18'] },
            { id: 'baohe-photo', role: 'parent', type: 'photo', title: '保和殿', subtitle: '台阶留影', ages: ['7-12','13-18'] }
          ]
        }
      },
    ],
    'national-museum': [
      {
        id: 'family-starter',
        name: '首访精华·亲子版',
        description: '轻量路线，涵盖镇馆基础展的入门体验',
        ages: ['3-6','7-12'],
        tasks: {
          enroute: [
          ],
          visit: [
            { id: 'gate-photo', role: 'parent', type: 'photo', title: '门口打卡', subtitle: '国博主入口合影', ages: ['3-6','7-12','13-18'] },
            { id: 'find-animal', role: 'child', type: 'confirm', title: '寻找动物纹', subtitle: '在青铜器上找一种动物纹饰并描述', ages: ['7-12','13-18'] },
            { id: 'victory', role: 'parent', type: 'photo', title: '胜利合影', subtitle: '大厅留影', ages: ['3-6','7-12','13-18'] }
          ]
        }
      }
    ],
    'shanghai-museum': [
      {
        id: 'bronze-porcelain-lite',
        name: '青铜与陶瓷轻享',
        description: '以打卡+观察为主的亲子路线',
        ages: ['7-12','13-18'],
        tasks: {
          enroute: [
          ],
          visit: [
            { id: 'bronze-photo', role: 'parent', type: 'photo', title: '青铜厅到此一游', subtitle: '入口处合影', ages: ['7-12','13-18'] },
            { id: 'shape-observe', role: 'child', type: 'confirm', title: '器形观察', subtitle: '说出一件器物的名称与用途', ages: ['7-12','13-18'] },
            { id: 'porcelain-photo', role: 'parent', type: 'photo', title: '陶瓷厅打卡', subtitle: '挑一件最喜欢的瓷器合影', ages: ['7-12','13-18'] }
          ]
        }
      }
    ],
    'shanghai-science-technology-museum': [
      {
        id: 'hands-on-fun',
        name: '动手玩科学',
        description: '以互动展项为主，低龄友好',
        ages: ['3-6','7-12'],
        tasks: {
          enroute: [
          ],
          visit: [
            { id: 'entrance', role: 'parent', type: 'photo', title: '门口打卡', subtitle: '入口处合影', ages: ['3-6','7-12'] },
            { id: 'interactive', role: 'child', type: 'confirm', title: '完成一个互动装置', subtitle: '描述你做了什么现象', ages: ['3-6','7-12'] },
            { id: 'finish', role: 'parent', type: 'photo', title: '胜利合影', subtitle: '把今天的笑脸记录下来', ages: ['3-6','7-12','13-18'] }
          ]
        }
      }
    ],
    'pinghu-museum': [
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
      }
    ]
  };
  window.WORKFLOWS = WORKFLOWS;
})();
