/**
 * download-favicons.js
 * Baixa todos os favicons do portal para img/favicons/
 * Uso: node download-favicons.js
 *
 * Tenta dois serviços do Google em sequência.
 * Pula arquivos que já existem e têm conteúdo (>0 bytes).
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const OUT_DIR = path.join(__dirname, 'img', 'favicons');
fs.mkdirSync(OUT_DIR, { recursive: true });

const DOMAINS = [
    'www.tjsp.jus.br', 'www.trtsp.jus.br', 'pje1g.trf3.jus.br', 'esaj.tjsp.jus.br', 'eproc1g.tjsp.jus.br',
    'www.tjrj.jus.br', 'www.tjpb.jus.br', 'www.tjmg.jus.br', 'www.stf.jus.br', 'www.stj.jus.br',
    'www.tst.jus.br', 'eproc.jfrj.jus.br', 'www.pje.jus.br', 'ww2.trt2.jus.br', 'web.proadv.adv.br',
    'www.jusbrasil.com.br', 'portalbnmp.cnj.jus.br', 'portaldecustas.tjsp.jus.br', 'ridigital.org.br', 'www.signo.org.br',
    'www.in.gov.br', 'www.gov.br', 'cav.receita.fazenda.gov.br', 'www.cnj.jus.br', 'www.oabsp.org.br',
    'cna.oab.org.br', 'www.migalhas.com.br', 'servicos.receita.fazenda.gov.br', 'solucoes.receita.fazenda.gov.br', 'www.detran.sp.gov.br',
    'www.bcb.gov.br', 'portaldatransparencia.gov.br', 'www.sintegra.gov.br', 'www.conjur.com.br', 'validar.iti.gov.br',
    'www.aasp.org.br', 'portal.sap.sp.gov.br', 'www.jucesp.sp.gov.br', 'credlocaliza.com.br', 'mail.google.com',
    'outlook.live.com', 'mail.yahoo.com', 'web.whatsapp.com', 'teams.microsoft.com', 'web.telegram.org',
    'webmail.oabsp.org.br', 'drive.google.com', 'docs.google.com', 'onedrive.live.com', 'calendar.google.com',
    'sheets.google.com', 'www.notion.so', 'www.google.com', 'translate.google.com', 'maps.google.com',
    'www.canva.com', 'www.youtube.com', 'www.facebook.com', 'www.chess.com', 'www.ilovepdf.com',
    'smallpdf.com', 'cloudconvert.com', 'claude.ai', 'gemini.google.com', 'chatgpt.com',
    'grok.com', 'copilot.microsoft.com', 'www.perplexity.ai', 'chat.deepseek.com', 'notebooklm.google.com',
    'ia.jusbrasil.com.br', 'g1.globo.com', 'www.uol.com.br', 'www.folha.uol.com.br', 'www.estadao.com.br', 'www.globo.com',
];

function faviconUrls(domain) {
    return [
        `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`,
        `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`,
    ];
}

function fetchBytes(url, redirects = 0) {
    return new Promise((resolve, reject) => {
        if (redirects > 5) return reject(new Error('Too many redirects'));
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                res.resume();
                return fetchBytes(res.headers.location, redirects + 1).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error(`HTTP ${res.statusCode}`));
            }
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end',  () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        }).on('error', reject);
    });
}

async function download(domain) {
    const dest = path.join(OUT_DIR, `${domain}.png`);

    // Pula se já existe com conteúdo
    try {
        if (fs.statSync(dest).size > 0) return { domain, ok: true, skipped: true };
    } catch {}

    for (const url of faviconUrls(domain)) {
        try {
            const buf = await fetchBytes(url);
            if (buf.length > 0) {
                fs.writeFileSync(dest, buf);
                return { domain, ok: true, bytes: buf.length };
            }
        } catch {}
    }
    return { domain, ok: false };
}

(async () => {
    console.log(`\nBaixando favicons para img/favicons/\n`);
    let ok = 0, skipped = 0, fail = 0;
    for (const domain of DOMAINS) {
        const r = await download(domain);
        if (r.skipped) {
            console.log(`  —  ${domain}  (já existe, pulado)`);
            skipped++;
        } else if (r.ok) {
            console.log(`  ✓  ${domain}  (${r.bytes} bytes)`);
            ok++;
        } else {
            console.log(`  ✗  ${domain}`);
            fail++;
        }
    }
    console.log(`\nConcluído: ${ok} baixados, ${skipped} pulados, ${fail} sem favicon.\n`);
})();
