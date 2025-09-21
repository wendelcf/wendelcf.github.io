
export const PROMPT_GUIDE = {
  en: {
    title: "Crafting the Perfect Prompt",
    description: "A good prompt is like a recipe for your image. The more detailed and clear your instructions, the better the result. Think about what you want to see, the style it should be in, and any specific details that matter.",
    structure: {
        title: "Structure of a Strong Prompt",
        parts: [
            "Subject: The main focus of your image (e.g., 'a majestic lion', 'a futuristic city').",
            "Action/Setting: What the subject is doing and where (e.g., 'reading a book in a library', 'soaring through clouds').",
            "Style: The artistic style (e.g., 'photorealistic', 'oil painting', 'anime', 'synthwave').",
            "Details & Modifiers: Add specifics like lighting, color, mood, and camera details (e.g., 'dramatic lighting', 'vibrant colors', 'cinematic shot', '4K')."
        ]
    },
    example: {
        title: "Example",
        prompt: "A cinematic, ultra-realistic photograph of a lone astronaut standing on the surface of Mars, watching a blue sunset. The style is reminiscent of a sci-fi movie still, with dramatic shadows, fine dust particles in the air, and the texture of the spacesuit visible, 4K resolution.",
        explanation: "This prompt clearly defines the subject, setting, style, and adds many specific details that guide the AI to a high-quality, specific outcome."
    }
  },
  'pt-br': {
    title: "Criando o Prompt Perfeito",
    description: "Um bom prompt é como uma receita para sua imagem. Quanto mais detalhadas e claras forem suas instruções, melhor o resultado. Pense no que você quer ver, no estilo que deve ter e em quaisquer detalhes específicos que importam.",
    structure: {
        title: "Estrutura de um Prompt Forte",
        parts: [
            "Sujeito: O foco principal da sua imagem (ex: 'um leão majestoso', 'uma cidade futurista').",
            "Ação/Cenário: O que o sujeito está fazendo e onde (ex: 'lendo um livro em uma biblioteca', 'voando através das nuvens').",
            "Estilo: O estilo artístico (ex: 'fotorrealista', 'pintura a óleo', 'anime', 'synthwave').",
            "Detalhes e Modificadores: Adicione especificidades como iluminação, cor, humor e detalhes da câmera (ex: 'iluminação dramática', 'cores vibrantes', 'cena cinematográfica', '4K')."
        ]
    },
    example: {
        title: "Exemplo",
        prompt: "Uma fotografia cinematográfica e ultrarrealista de um astronauta solitário na superfície de Marte, observando um pôr do sol azul. O estilo é reminiscente de um filme de ficção científica, com sombras dramáticas, partículas finas de poeira no ar e a textura do traje espacial visível, resolução 4K.",
        explanation: "Este prompt define claramente o sujeito, o cenário, o estilo e adiciona muitos detalhes específicos que guiam a IA para um resultado específico e de alta qualidade."
    }
  }
};

export const EDIT_GUIDE = {
    en: {
        title: "Image Editing Guide",
        sections: [
            {
                title: "Add an Element",
                description: "To add something new to your image, simply describe it clearly.",
                template: "add a [subject] [action/location]"
            },
            {
                title: "Change Style",
                description: "Transform the entire image into a new artistic style.",
                template: "in the style of [artist/style]"
            },
            {
                title: "Change the Background",
                description: "Replace the background while keeping the main subject.",
                template: "change the background to [new background]"
            }
        ]
    },
    'pt-br': {
        title: "Guia de Edição de Imagem",
        sections: [
            {
                title: "Adicionar um Elemento",
                description: "Para adicionar algo novo à sua imagem, apenas descreva-o claramente.",
                template: "adicione um [sujeito] [ação/local]"
            },
            {
                title: "Mudar o Estilo",
                description: "Transforme a imagem inteira em um novo estilo artístico.",
                template: "no estilo de [artista/estilo]"
            },
            {
                title: "Mudar o Fundo",
                description: "Substitua o fundo mantendo o sujeito principal.",
                template: "mude o fundo para [novo fundo]"
            }
        ]
    }
};

export const KEYWORDS: any = {
    photography: {
        en: { title: "Photography Styles" }, 'pt-br': { title: "Estilos de Fotografia" },
        items: [
            { en: "cinematic", 'pt-br': "cinematográfico" }, { en: "photorealistic", 'pt-br': "fotorrealista" },
            { en: "long exposure", 'pt-br': "longa exposição" }, { en: "macro photography", 'pt-br': "macrofotografia" },
            { en: "golden hour", 'pt-br': "hora dourada" }, { en: "blue hour", 'pt-br': "hora azul" }
        ]
    },
    art: {
        en: { title: "Art Styles" }, 'pt-br': { title: "Estilos de Arte" },
        items: [
            { en: "oil painting", 'pt-br': "pintura a óleo" }, { en: "watercolor", 'pt-br': "aquarela" },
            { en: "synthwave", 'pt-br': "synthwave" }, { en: "cyberpunk", 'pt-br': "cyberpunk" },
            { en: "anime", 'pt-br': "anime" }, { en: "pixel art", 'pt-br': "pixel art" }
        ]
    },
    lighting: {
        en: { title: "Lighting" }, 'pt-br': { title: "Iluminação" },
        items: [
            { en: "dramatic lighting", 'pt-br': "iluminação dramática" }, { en: "soft lighting", 'pt-br': "iluminação suave" },
            { en: "neon lighting", 'pt-br': "iluminação neon" }, { en: "volumetric lighting", 'pt-br': "iluminação volumétrica" },
            { en: "rim lighting", 'pt-br': "luz de contorno" }
        ]
    }
};

export const NEGATIVE_PROMPTS = {
    en: {
        title: "Negative Prompts",
        description: "Use negative prompts to tell the AI what you DON'T want in your image. This helps avoid common mistakes and artifacts."
    },
    'pt-br': {
        title: "Prompts Negativos",
        description: "Use prompts negativos para dizer à IA o que você NÃO quer na sua imagem. Isso ajuda a evitar erros e artefatos comuns."
    },
    keywords: [
        { en: "blurry", 'pt-br': "desfocado" }, { en: "low quality", 'pt-br': "baixa qualidade" },
        { en: "text", 'pt-br': "texto" }, { en: "watermark", 'pt-br': "marca d'água" },
        { en: "signature", 'pt-br': "assinatura" }, { en: "ugly", 'pt-br': "feio" },
        { en: "bad anatomy", 'pt-br': "anatomia ruim" }, { en: "deformed", 'pt-br': "deformado" }
    ]
};
