# Sarges — Portal de Links v2.0

Portal pessoal de atalhos para uso como página inicial do navegador.

## 📂 Estrutura de arquivos

```
portal/
├── index.html              ← página principal
├── sw.js                   ← service worker (cache offline / PWA)
├── manifest.webmanifest    ← manifesto PWA
├── img/
│   └── logoSarges2025.png  ← seu logotipo (já estava aí)
└── README.md
```

Tudo o que você precisa está em `index.html`. Os outros dois arquivos são opcionais:
sem eles a página funciona normal; com eles vira PWA (atalho, abre offline).

## 🚀 Como usar

1. Copie a pasta `portal/` para onde você hospeda seus arquivos estáticos
   (pode ser até um diretório local aberto com `file://` — funciona, só o PWA que exige `http://`).
2. Configure o navegador para abrir `index.html` como página inicial.
3. Pronto.

### Opção A: hospedagem local simples
Sirva com qualquer servidor estático. Exemplos:

```bash
# Python (já vem instalado)
python3 -m http.server 8080

# Node
npx serve .
```

Acesse `http://localhost:8080/` e defina como homepage.

### Opção B: GitHub Pages / Netlify / Vercel
Faça commit da pasta e deploy. PWA funciona automaticamente em HTTPS.

## ⌨️ Atalhos de teclado

- `/` → foca a barra de pesquisa
- `Esc` → limpa a pesquisa (quando o campo está focado)
- `Tab` → navega pelos botões e fixadores

## 📌 Como fixar um link

Passe o mouse sobre qualquer card → aparece um 📌 no canto superior esquerdo.
Clique para fixar/desfixar. Os fixados aparecem no topo na seção **"Fixados"**.

Os pinos são salvos no `localStorage` do navegador (chave `sarges:pinned`).
Limpar os dados do site remove os pinos.

## ✏️ Como adicionar/remover/editar links

Abra `index.html` e procure pelo array `SECTIONS` (perto da linha que começa
com `const SECTIONS = [`). Cada link segue este formato:

```js
{
    label: 'Nome',          // texto principal do botão
    sublabel: 'Descrição',  // texto secundário menor
    icon: 'fa-solid fa-...',// ícone FontAwesome (https://fontawesome.com/icons)
    iconClass: 'icon-x',    // cor do ícone (ver tabela abaixo)
    url: 'https://...'      // link
}
```

### Cores de ícone disponíveis (iconClass)

| Classe         | Cor              | Uso típico                          |
|----------------|------------------|-------------------------------------|
| `icon-tribunal`| azul-marinho     | Tribunais estaduais                 |
| `icon-trabalho`| vermelho escuro  | Varas/trabalistas                   |
| `icon-esaj`    | âmbar            | E-SAJ                               |
| `icon-eproc`   | azul             | EPROC                               |
| `icon-pje`     | teal             | PJe                                 |
| `icon-ri`      | dourado          | RI-Digital                          |
| `icon-signo`   | dourado          | Signo                               |
| `icon-doc`     | roxo             | Documentos, PDFs, portais           |
| `icon-briefcase`| laranja         | Gestão, escritório                  |
| `icon-search`  | azul             | Buscas e pesquisas                  |
| `icon-lock`    | vermelho         | Login, segurança                    |
| `icon-money`   | verde            | Custas, pagamentos, validações     |
| `icon-build`   | laranja          | Veículos, ferramentas, design       |
| `icon-bank`    | verde-azulado    | Bancos, juntas comerciais           |
| `icon-gov`     | azul-marinho     | Órgãos públicos                     |

Marcas conhecidas já têm cor própria (gmail, youtube, facebook, etc) — não
precisam de `iconClass`.

### Adicionar uma nova seção inteira

No array `SECTIONS`, adicione um objeto:

```js
{
    id: 'minha-secao',          // único, sem espaços
    title: 'Minha Seção',
    icon: 'fa-solid fa-star',   // ícone do cabeçalho
    items: [ /* links aqui */ ]
}
```

E adicione o tema da seção no CSS (em `index.html`, procure por `/* SECTION THEMES */`):

```css
.section.minha-secao { border-left: 4px solid #cor; }
.section.minha-secao .section-header { background: #cor-clara; }
.section.minha-secao .section-emoji  { color: #cor; }
.minha-secao .btn:hover { background: #cor-clara; }
```

## 🛠️ Manutenção

- **EPROC SP**: a URL do EPROC foi corrigida (a original tinha parâmetros `state`/`nonce` de uso único do SSO que quebrariam após o primeiro uso).
- **Ícones**: padronizados em FontAwesome. Sem mistura emoji/FA.
- **Busca**: filtra por nome + descrição em tempo real.
- **Pinos**: salvos no navegador, não sincronizam entre dispositivos.
- **PWA**: service worker faz cache de tudo. Abre offline na segunda visita.

## 🔧 Compatibilidade

Tudo moderno (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+).
PWA install só funciona em HTTPS (ou `localhost`).

## 📋 O que mudou na v2.0

✅ Corrigida URL do EPROC SP (removidos state/nonce inválidos)  
✅ Padronização completa para FontAwesome  
✅ Atalho `/` para focar a busca  
✅ `Esc` para limpar  
✅ Relógio e saudação no header  
✅ Seção "Fixados" com persistência em localStorage  
✅ Subdivisão de "Utilidades Jurídicas" (nova seção "Cartórios & Assinatura")  
✅ Adicionados **RI-Digital** e **Signo**  
✅ Busca mais rápida, filtra todas as seções  
✅ Estrutura data-driven (array `SECTIONS`) — adicionar link é 3 linhas  
✅ Animações com IntersectionObserver (só anima o que aparece na tela)  
✅ Indicador `↗` nos cards que abrem em nova aba  
✅ PWA: service worker + manifest, abre offline  
✅ `:focus-visible` global, skip link, ARIA labels  
✅ `prefers-reduced-motion` respeitado  
✅ Pin visível em dispositivos touch (sem hover)  
