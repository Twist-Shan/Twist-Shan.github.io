/* Pinned empirical uniform-opponent Vector-Borda coordinates used in the paper. */
window.PARETO_BLOG_DATA = {
  palette: {
    "Alibaba": "#78B9E6",
    "Amazon": "#F28E8E",
    "Anthropic": "#95D5B2",
    "Cohere": "#F7C59F",
    "DeepSeek": "#C3AED6",
    "Google": "#F3D675",
    "Meta": "#7FC8C2",
    "MiniMax": "#E7A1C4",
    "Mistral": "#C4D96B",
    "OpenAI": "#D88AC5",
    "Perplexity": "#63B6C8",
    "xAI": "#92979F",
    "Other": "#8B6F5A"
  },
  datasets: {
    arena: {
      label: "Arena-35",
      source: "Arena Human Preference 140K",
      revision: "6322995",
      candidates: 52,
      roster: 35,
      retainedRows: 73135,
      routing: "Five mutually exclusive prompt strata",
      dimensions: ["general", "code", "math", "creative_writing", "instruction_following"],
      labels: {
        general: "General",
        code: "Code",
        math: "Math",
        creative_writing: "Creative writing",
        instruction_following: "Instruction following"
      },
      defaults: ["code", "math", "instruction_following"],
      fullFrontier: [
        "chatgpt-4o-latest-20250326",
        "gemini-2.5-pro",
        "grok-3-preview-02-24"
      ],
      rows: [
        { model: "amazon.nova-pro-v1:0", provider: "Amazon", scores: { general: 0.3390478953898466, code: 0.2779835550834216, math: 0.27211664969017907, creative_writing: 0.29953004511828046, instruction_following: 0.33570832332442235 } },
        { model: "chatgpt-4o-latest-20250326", provider: "OpenAI", scores: { general: 0.6500777528032571, code: 0.637765911248168, math: 0.5975638740344622, creative_writing: 0.6018872518543423, instruction_following: 0.6736917494270435 } },
        { model: "claude-3-5-haiku-20241022", provider: "Anthropic", scores: { general: 0.3000434383416777, code: 0.312768038174469, math: 0.24672672099142692, creative_writing: 0.27582107435048614, instruction_following: 0.2557163789942428 } },
        { model: "claude-3-5-sonnet-20241022", provider: "Anthropic", scores: { general: 0.33961138226403564, code: 0.3806651168240008, math: 0.33704800101858934, creative_writing: 0.40839291427526725, instruction_following: 0.37914226296579234 } },
        { model: "claude-3-7-sonnet-20250219", provider: "Anthropic", scores: { general: 0.3409145493150056, code: 0.39128234648509674, math: 0.4131435557906147, creative_writing: 0.39934043374218203, instruction_following: 0.40324419947097967 } },
        { model: "claude-3-7-sonnet-20250219-thinking-32k", provider: "Anthropic", scores: { general: 0.3442866386063877, code: 0.3767788797750254, math: 0.4060775825481708, creative_writing: 0.47403623259956346, instruction_following: 0.4709165010407954 } },
        { model: "claude-opus-4-20250514", provider: "Anthropic", scores: { general: 0.4589132797602128, code: 0.5633415576580942, math: 0.5289237314972609, creative_writing: 0.5615552189175629, instruction_following: 0.5559557893137842 } },
        { model: "claude-opus-4-20250514-thinking-16k", provider: "Anthropic", scores: { general: 0.4538626423630271, code: 0.5832136391251929, math: 0.5778361344537816, creative_writing: 0.5715763682481948, instruction_following: 0.49328898225957046 } },
        { model: "claude-sonnet-4-20250514", provider: "Anthropic", scores: { general: 0.402325385619476, code: 0.4879142709437925, math: 0.48516050942521527, creative_writing: 0.49700052942206246, instruction_following: 0.4943480906727583 } },
        { model: "command-a-03-2025", provider: "Cohere", scores: { general: 0.46039357579900136, code: 0.4198419609627323, math: 0.35994444569271566, creative_writing: 0.4479963639781979, instruction_following: 0.4616196303696304 } },
        { model: "deepseek-r1-0528", provider: "DeepSeek", scores: { general: 0.6582285507465955, code: 0.6157264195207164, math: 0.5997432306255835, creative_writing: 0.5982078983563229, instruction_following: 0.5630926119247918 } },
        { model: "deepseek-v3-0324", provider: "DeepSeek", scores: { general: 0.5641709068177152, code: 0.5281949683559707, math: 0.5142114421526187, creative_writing: 0.6067524723450329, instruction_following: 0.48329134101192917 } },
        { model: "gemini-2.0-flash-001", provider: "Google", scores: { general: 0.4682855595247146, code: 0.4643665826115692, math: 0.4288061611591023, creative_writing: 0.5142839186956834, instruction_following: 0.4224917239623122 } },
        { model: "gemini-2.5-flash", provider: "Google", scores: { general: 0.6166793550610127, code: 0.6022151664363377, math: 0.6536884851980007, creative_writing: 0.5880197181458335, instruction_following: 0.6266966920855103 } },
        { model: "gemini-2.5-flash-lite-preview-06-17-thinking", provider: "Google", scores: { general: 0.5383543496437364, code: 0.5011127135848634, math: 0.5533963585434174, creative_writing: 0.6030769883711061, instruction_following: 0.5644003055767762 } },
        { model: "gemini-2.5-flash-preview-04-17", provider: "Google", scores: { general: 0.5644506902858673, code: 0.5237829282872262, math: 0.5805165422812483, creative_writing: 0.6437258819611761, instruction_following: 0.5492031661149308 } },
        { model: "gemini-2.5-pro", provider: "Google", scores: { general: 0.7344159558122407, code: 0.7062421311966706, math: 0.7542686120108265, creative_writing: 0.7374024421003965, instruction_following: 0.6579619981891881 } },
        { model: "gemma-3-27b-it", provider: "Google", scores: { general: 0.5380284793632214, code: 0.4723783929947371, math: 0.44542300020241193, creative_writing: 0.5991446462034697, instruction_following: 0.5211509895333425 } },
        { model: "gpt-4.1-2025-04-14", provider: "OpenAI", scores: { general: 0.5509707288127093, code: 0.5437273064161194, math: 0.46073868941516, creative_writing: 0.5221106507871214, instruction_following: 0.5474187985217398 } },
        { model: "gpt-4.1-mini-2025-04-14", provider: "OpenAI", scores: { general: 0.44279840079118393, code: 0.5106196770662664, math: 0.4086900844253785, creative_writing: 0.38914035311094136, instruction_following: 0.5230903900021547 } },
        { model: "grok-3-mini-beta", provider: "xAI", scores: { general: 0.5046310909064217, code: 0.5015498943939403, math: 0.4570494864612512, creative_writing: 0.4653228667718287, instruction_following: 0.5162990196078432 } },
        { model: "grok-3-preview-02-24", provider: "xAI", scores: { general: 0.6296473698627173, code: 0.6288503386579187, math: 0.53174921483745, creative_writing: 0.6609798698033993, instruction_following: 0.7263960712490124 } },
        { model: "llama-3.3-70b-instruct", provider: "Meta", scores: { general: 0.34622218428893625, code: 0.2779149169880534, math: 0.25638422035480857, creative_writing: 0.31044494720965304, instruction_following: 0.3063492063492063 } },
        { model: "llama-4-maverick-03-26-experimental", provider: "Meta", scores: { general: 0.6105665515009483, code: 0.5958733329515135, math: 0.6653469079939667, creative_writing: 0.6263943548761888, instruction_following: 0.6330120043355337 } },
        { model: "llama-4-maverick-17b-128e-instruct", provider: "Meta", scores: { general: 0.37038489757605886, code: 0.3533019257291607, math: 0.3433617036558213, creative_writing: 0.3774984002925179, instruction_following: 0.36203179989944695 } },
        { model: "minimax-m1", provider: "MiniMax", scores: { general: 0.5190066746620976, code: 0.4758901824830351, math: 0.749859943977591, creative_writing: 0.487500244853186, instruction_following: 0.4510029618593632 } },
        { model: "mistral-medium-2505", provider: "Mistral", scores: { general: 0.5590946833955115, code: 0.5393827118659109, math: 0.41946268600680364, creative_writing: 0.49115047012312685, instruction_following: 0.5345148843851267 } },
        { model: "o3-2025-04-16", provider: "OpenAI", scores: { general: 0.6662899710756425, code: 0.627256276658488, math: 0.5815974058621117, creative_writing: 0.6032946685389318, instruction_following: 0.5965373764522371 } },
        { model: "o3-mini", provider: "OpenAI", scores: { general: 0.39305597286606353, code: 0.4567903478677483, math: 0.5044510228333758, creative_writing: 0.3856845768610475, instruction_following: 0.37809396485867075 } },
        { model: "o4-mini-2025-04-16", provider: "OpenAI", scores: { general: 0.571856323999679, code: 0.5291276159779277, math: 0.5783846872082166, creative_writing: 0.4892543682768596, instruction_following: 0.48770069799481564 } },
        { model: "qwen-max-2025-01-25", provider: "Alibaba", scores: { general: 0.5587582083788116, code: 0.5286185918489245, math: 0.5644491129785248, creative_writing: 0.5176396316102199, instruction_following: 0.5521053293112116 } },
        { model: "qwen3-235b-a22b", provider: "Alibaba", scores: { general: 0.5205856484101893, code: 0.5610797477285034, math: 0.6808473389355743, creative_writing: 0.480022020463197, instruction_following: 0.45886123680241325 } },
        { model: "qwen3-235b-a22b-no-thinking", provider: "Alibaba", scores: { general: 0.5813532150961457, code: 0.5695080568386192, math: 0.5988914680091151, creative_writing: 0.524355513485838, instruction_following: 0.5610847507325837 } },
        { model: "qwen3-30b-a3b", provider: "Alibaba", scores: { general: 0.4366812704636102, code: 0.48077679324651756, math: 0.47124183006535947, creative_writing: 0.3105468877527701, instruction_following: 0.46292420574427495 } },
        { model: "qwq-32b", provider: "Alibaba", scores: { general: 0.4660064203962428, code: 0.47415770401326823, math: 0.4728991596638656, creative_writing: 0.4309097764980118, instruction_following: 0.49065656565656574 } }
      ]
    },
    search: {
      label: "SearchArena-8",
      source: "Search Arena 24K",
      revision: "fac8dcf",
      candidates: 13,
      roster: 8,
      retainedRows: 4305,
      routing: "Nine released primary-intent labels",
      dimensions: ["Factual Lookup", "Info Synthesis", "Recommendation", "Analysis", "Explanation", "Guidance", "Creative Generation", "Other", "Text Processing"],
      labels: {
        "Factual Lookup": "Factual lookup",
        "Info Synthesis": "Info synthesis",
        "Recommendation": "Recommendation",
        "Analysis": "Analysis",
        "Explanation": "Explanation",
        "Guidance": "Guidance",
        "Creative Generation": "Creative generation",
        "Other": "Other",
        "Text Processing": "Text processing"
      },
      defaults: ["Factual Lookup", "Recommendation", "Creative Generation"],
      fullFrontier: [
        "gemini-2.5-pro-exp-03-25-grounding",
        "sonar",
        "sonar-pro-high",
        "sonar-reasoning",
        "sonar-reasoning-pro-high"
      ],
      rows: [
        { model: "gemini-2.0-flash-grounding", provider: "Google", scores: { "Factual Lookup": 0.3974069657893188, "Info Synthesis": 0.4432528180354267, Recommendation: 0.39224987899391295, Analysis: 0.3711622228702974, Explanation: 0.37733056417266947, Guidance: 0.3846798474127667, "Creative Generation": 0.43065268065268064, Other: 0.32081807081807084, "Text Processing": 0.35714285714285715 } },
        { model: "gemini-2.5-pro-exp-03-25-grounding", provider: "Google", scores: { "Factual Lookup": 0.6640371791719181, "Info Synthesis": 0.6401375476034072, Recommendation: 0.6091475984333128, Analysis: 0.6719151775542753, Explanation: 0.6597207303974221, Guidance: 0.7171923314780457, "Creative Generation": 0.5322954822954823, Other: 0.4908948194662481, "Text Processing": 0.5261904761904762 } },
        { model: "gpt-4o-search-preview-high", provider: "OpenAI", scores: { "Factual Lookup": 0.36344292473860573, "Info Synthesis": 0.2929777143832443, Recommendation: 0.3191276115189159, Analysis: 0.2704313746109412, Explanation: 0.2152997562661428, Guidance: 0.3123713587999302, "Creative Generation": 0.3560502989074418, Other: 0.36477803242509127, "Text Processing": 0.5785714285714285 } },
        { model: "gpt-4o-search-preview-high-loc", provider: "OpenAI", scores: { "Factual Lookup": 0.36709102613377365, "Info Synthesis": 0.300594792142764, Recommendation: 0.2872585397795482, Analysis: 0.20516885648464595, Explanation: 0.33298662177421573, Guidance: 0.38127877413591704, "Creative Generation": 0.34794649794649796, Other: 0.473010323010323, "Text Processing": 0.43639455782312925 } },
        { model: "sonar", provider: "Perplexity", scores: { "Factual Lookup": 0.5115473725722174, "Info Synthesis": 0.45821406935049785, Recommendation: 0.6260288166303204, Analysis: 0.584368712519973, Explanation: 0.5738047666619096, Guidance: 0.43257575757575756, "Creative Generation": 0.6119047619047618, Other: 0.6158119658119657, "Text Processing": 0.5476190476190476 } },
        { model: "sonar-pro-high", provider: "Perplexity", scores: { "Factual Lookup": 0.5461027760798929, "Info Synthesis": 0.5739657096799954, Recommendation: 0.7244341011258305, Analysis: 0.6050170068027211, Explanation: 0.626897546897547, Guidance: 0.613095238095238, "Creative Generation": 0.5473516679399032, Other: 0.5203050917336631, "Text Processing": 0.2921768707482993 } },
        { model: "sonar-reasoning", provider: "Perplexity", scores: { "Factual Lookup": 0.5146147052070397, "Info Synthesis": 0.5920476875261658, Recommendation: 0.52317886791571, Analysis: 0.6363392559821132, Explanation: 0.5976924102974522, Guidance: 0.5772249144919952, "Creative Generation": 0.531828488971346, Other: 0.5722428831672529, "Text Processing": 0.6166666666666666 } },
        { model: "sonar-reasoning-pro-high", provider: "Perplexity", scores: { "Factual Lookup": 0.6357570503072338, "Info Synthesis": 0.6988096612784985, Recommendation: 0.5185745856024494, Analysis: 0.655597393175033, Explanation: 0.6162676035326411, Guidance: 0.5815817780103494, "Creative Generation": 0.6419701213818861, Other: 0.642138813567385, "Text Processing": 0.6452380952380953 } }
      ]
    },
    vision: {
      label: "VisionArena-12",
      source: "VisionArena-Battle",
      revision: "a41d58f",
      candidates: 17,
      roster: 12,
      retainedRows: 23458,
      routing: "Eight released multi-label categories",
      dimensions: ["captioning", "creative_writing", "diagram", "entity_recognition", "homework", "humor", "is_code", "ocr"],
      labels: {
        captioning: "Captioning",
        creative_writing: "Creative writing",
        diagram: "Diagram",
        entity_recognition: "Entity recognition",
        homework: "Homework",
        humor: "Humor",
        is_code: "Is code",
        ocr: "OCR"
      },
      defaults: ["captioning", "creative_writing", "entity_recognition"],
      fullFrontier: [
        "claude-3-5-sonnet-20240620",
        "gemini-1.5-pro-exp-0801",
        "gpt-4o-2024-05-13"
      ],
      rows: [
        { model: "claude-3-5-sonnet-20240620", provider: "Anthropic", scores: { captioning: 0.731513342714722, creative_writing: 0.5842518999740698, diagram: 0.6628641423544551, entity_recognition: 0.707993387909082, homework: 0.6439025853508049, humor: 0.6231601009438883, is_code: 0.6696631804786886, ocr: 0.6766111786129874 } },
        { model: "claude-3-haiku-20240307", provider: "Anthropic", scores: { captioning: 0.24195315739808854, creative_writing: 0.232892838155996, diagram: 0.3006344196422196, entity_recognition: 0.21909681227863045, homework: 0.28300870926608107, humor: 0.22097928009661627, is_code: 0.30142308896872794, ocr: 0.28626410312911227 } },
        { model: "claude-3-opus-20240229", provider: "Anthropic", scores: { captioning: 0.4058616901524349, creative_writing: 0.45671323625869076, diagram: 0.4343852324735426, entity_recognition: 0.37694085524073045, homework: 0.34418639588917704, humor: 0.4719064537949987, is_code: 0.40339558688489174, ocr: 0.42222532724013156 } },
        { model: "claude-3-sonnet-20240229", provider: "Anthropic", scores: { captioning: 0.3730232259957437, creative_writing: 0.4097338542002573, diagram: 0.4164903199863242, entity_recognition: 0.3810261214411412, homework: 0.3927390967422909, humor: 0.3650426427639346, is_code: 0.3470751140709505, ocr: 0.38166643485792906 } },
        { model: "gemini-1.5-flash-api-0514", provider: "Google", scores: { captioning: 0.39472708957210556, creative_writing: 0.5711100743186305, diagram: 0.4780415959126254, entity_recognition: 0.5524662206480389, homework: 0.5270541295201411, humor: 0.4481456764014953, is_code: 0.5477631261712993, ocr: 0.4781868857512441 } },
        { model: "gemini-1.5-pro-api-0514", provider: "Google", scores: { captioning: 0.6119120315450087, creative_writing: 0.6101374743667234, diagram: 0.5760022560221908, entity_recognition: 0.6207060006408783, homework: 0.6624529276409852, humor: 0.5856750699773956, is_code: 0.6542042729534316, ocr: 0.6169295137011797 } },
        { model: "gemini-1.5-pro-exp-0801", provider: "Google", scores: { captioning: 0.7298992100865113, creative_writing: 0.7598042570088002, diagram: 0.707006997062761, entity_recognition: 0.6862826633759649, homework: 0.715355494370161, humor: 0.7952110113593367, is_code: 0.7376904388144125, ocr: 0.7356132118095985 } },
        { model: "gpt-4-turbo-2024-04-09", provider: "OpenAI", scores: { captioning: 0.6133176089619959, creative_writing: 0.6392786951610482, diagram: 0.6204864913721594, entity_recognition: 0.5954172264517091, homework: 0.6249492893265081, humor: 0.6296664120193532, is_code: 0.5944351319023337, ocr: 0.6165182080692545 } },
        { model: "gpt-4o-2024-05-13", provider: "OpenAI", scores: { captioning: 0.6859608641807224, creative_writing: 0.7053941274036969, diagram: 0.7363010599159924, entity_recognition: 0.7675710364540591, homework: 0.6718845662810717, humor: 0.7523859538377018, is_code: 0.7221253902866512, ocr: 0.7298039360177841 } },
        { model: "gpt-4o-mini-2024-07-18", provider: "OpenAI", scores: { captioning: 0.5453230315936124, creative_writing: 0.5843577530463926, diagram: 0.5525297960406301, entity_recognition: 0.38445203786112875, homework: 0.5631134767505294, humor: 0.5171548924697104, is_code: 0.6121437741002959, ocr: 0.5472927843928846 } },
        { model: "reka-core-20240501", provider: "Other", scores: { captioning: 0.30348289508279935, creative_writing: 0.19121711621711623, diagram: 0.27184753492825214, entity_recognition: 0.35126086035176945, homework: 0.32785689553823016, humor: 0.3225594760360184, is_code: 0.199466750374434, ocr: 0.269480514568755 } },
        { model: "reka-flash-preview-20240611", provider: "Other", scores: { captioning: 0.3630258527162552, creative_writing: 0.2551086738885782, diagram: 0.24341015428884677, entity_recognition: 0.35678677734686737, homework: 0.24349643332401952, humor: 0.2681130302995507, is_code: 0.21061414499388317, ocr: 0.2394079018491394 } }
      ]
    }
  }
};
