import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function uniqloApiPlugin() {
  return {
    name: 'uniqlo-api-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/uniqlo')) {
          return next();
        }

        try {
          const parsedUrl = new URL(req.url, 'http://localhost');
          const pathname = parsedUrl.pathname;

          // Helper to extract product ID
          const extractProductId = (input) => {
            if (!input) return null;
            const str = input.trim();
            // Match E-number format like E465185-000 or E465185
            const eMatch = str.match(/E\d{6}(?:-\d{3})?/i);
            if (eMatch) {
              const base = eMatch[0].toUpperCase();
              return base.includes('-') ? base : `${base}-000`;
            }
            // Match 6 digit numbers like 465185
            const numMatch = str.match(/\b\d{6}\b/);
            if (numMatch) {
              return `E${numMatch[0]}-000`;
            }
            return null;
          };

          const colorHexMap = {
            'WHITE': '#FFFFFF',
            'OFF WHITE': '#FDFBF7',
            'BLACK': '#151515',
            'NAVY': '#1B2A4A',
            'GRAY': '#808080',
            'LIGHT GRAY': '#D3D3D3',
            'DARK GRAY': '#4A4A4A',
            'PINK': '#F5A9B8',
            'WINE': '#6B1724',
            'RED': '#D32F2F',
            'DARK BROWN': '#3E2723',
            'BROWN': '#795548',
            'LIGHT GREEN': '#81C784',
            'DARK GREEN': '#1B5E20',
            'GREEN': '#388E3C',
            'BLUE': '#1976D2',
            'LIGHT BLUE': '#90CAF9',
            'PURPLE': '#7B1FA2',
            'LIGHT PURPLE': '#CE93D8',
            'BEIGE': '#D7CCC8',
            'NATURAL': '#F5EBE1',
            'OLIVE': '#556B2F',
            'YELLOW': '#FBC02D',
            'ORANGE': '#F57C00'
          };

          const getColorHex = (name) => {
            const upper = (name || '').toUpperCase().trim();
            if (colorHexMap[upper]) return colorHexMap[upper];
            for (const [k, v] of Object.entries(colorHexMap)) {
              if (upper.includes(k)) return v;
            }
            return '#A0AEC0';
          };

          // 1. Fetch Product with Live Stock
          if (pathname === '/api/uniqlo/fetch') {
            const inputId = parsedUrl.searchParams.get('id') || parsedUrl.searchParams.get('url');
            const productId = extractProductId(inputId);

            if (!productId) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid Uniqlo URL or Product Code. Example: https://www.uniqlo.com/jp/ja/products/E465185-000/00 or E465185-000' }));
              return;
            }

            // Fetch product detail and stock from Fast Retailing API
            const prodUrl = `https://www.uniqlo.com/jp/api/commerce/v5/ja/products/${productId}/price-groups/00`;
            const stockUrl = `https://www.uniqlo.com/jp/api/commerce/v5/ja/products/${productId}/price-groups/00/stock`;

            const headers = {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/json'
            };

            const [prodRes, stockRes] = await Promise.all([
              fetch(prodUrl, { headers }).then(r => r.json()).catch(() => null),
              fetch(stockUrl, { headers }).then(r => r.json()).catch(() => null)
            ]);

            if (!prodRes || prodRes.status !== 'ok' || !prodRes.result) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: `Product ${productId} not found on Uniqlo Japan.` }));
              return;
            }

            const pData = prodRes.result;
            const sData = stockRes?.result || {};

            // Map SKUs and live stock
            const skus = {};
            const sizeStockMap = {};

            if (Array.isArray(pData.l2s)) {
              for (const l2 of pData.l2s) {
                const stockItem = sData[l2.l2Id] || {};
                const colorCode = l2.color?.displayCode || '00';
                const sizeName = l2.size?.name || 'M';
                const key = `${colorCode}_${sizeName}`;

                const qty = stockItem.quantity ?? (stockItem.statusCode === 'IN_STOCK' ? 50 : 0);
                const isAvailable = stockItem.statusCode === 'IN_STOCK' || stockItem.statusCode === 'LOW_STOCK' || qty > 0;

                skus[key] = {
                  l2Id: l2.l2Id,
                  colorCode,
                  colorName: l2.color?.name,
                  sizeName,
                  statusCode: stockItem.statusCode || 'UNKNOWN',
                  statusLocalized: stockItem.statusLocalized || (isAvailable ? '在庫あり' : '在庫なし'),
                  quantity: qty,
                  inStock: isAvailable
                };

                if (!sizeStockMap[sizeName]) {
                  sizeStockMap[sizeName] = { availableCount: 0, totalCount: 0 };
                }
                sizeStockMap[sizeName].totalCount++;
                if (isAvailable) sizeStockMap[sizeName].availableCount++;
              }
            }

            // Colors with image & hex
            const colors = (pData.colors || []).map(c => {
              const mainImgObj = pData.images?.main?.[c.displayCode];
              const imgUrl = mainImgObj?.image || `https://image.uniqlo.com/UQ/ST3/jp/imagesgoods/${productId.replace('E', '').split('-')[0]}/item/jpgoods_${c.displayCode}_${productId.replace('E', '').split('-')[0]}_3x4.jpg`;
              return {
                id: c.displayCode,
                code: c.code,
                name: `${c.name} (${c.displayCode})`,
                rawName: c.name,
                hex: getColorHex(c.name),
                image: imgUrl
              };
            });

            // Images list
            const images = [];
            if (pData.images?.main) {
              for (const key of Object.keys(pData.images.main)) {
                if (pData.images.main[key]?.image) {
                  images.push(pData.images.main[key].image);
                }
              }
            }
            if (Array.isArray(pData.images?.sub)) {
              for (const sub of pData.images.sub) {
                if (sub.image && !images.includes(sub.image)) {
                  images.push(sub.image);
                }
              }
            }

            // Sizes with overall availability
            const sizes = (pData.sizes || []).map(s => {
              const stockStat = sizeStockMap[s.name];
              const isAvailable = stockStat ? stockStat.availableCount > 0 : true;
              return {
                size: s.name,
                available: isAvailable,
                availableStockCount: stockStat?.availableCount || 0
              };
            });

            // Prices
            const priceJpy = pData.prices?.base?.value || 1990;
            // Personal shopping markup conversion: ~155 JPY/USD + 20% margin
            const recommendedUsd = Math.round((priceJpy / 155) * 1.25);

            // Gender detection
            let detectedGender = 'MEN';
            const genderFlags = (pData.flags?.productFlags || []).map(f => f.code);
            if (genderFlags.includes('women') || (pData.name && pData.name.includes('ウィメンズ'))) {
              detectedGender = 'WOMEN';
            } else if (genderFlags.includes('kids') || (pData.name && pData.name.includes('キッズ'))) {
              detectedGender = 'KIDS';
            }

            // Category detection
            let detectedCat = 'top-tshirts';
            const nameLower = (pData.name || '').toLowerCase();
            if (nameLower.includes('パンツ') || nameLower.includes('pants')) detectedCat = 'pants';
            else if (nameLower.includes('ジーンズ') || nameLower.includes('jeans')) detectedCat = 'jeans';
            else if (nameLower.includes('シャツ') || nameLower.includes('shirt')) detectedCat = 'casual-shirts';
            else if (nameLower.includes('アウター') || nameLower.includes('jacket') || nameLower.includes('コート')) detectedCat = 'outerwear';
            else if (nameLower.includes('パーカー') || nameLower.includes('スウェット')) detectedCat = 'hoodies';
            else if (nameLower.includes('靴') || nameLower.includes('シューズ')) detectedCat = 'shoes';

            const formattedProduct = {
              id: `uniqlo-${productId.toLowerCase()}`,
              uniqloId: productId,
              sourceUrl: `https://www.uniqlo.com/jp/ja/products/${productId}/00`,
              titleJp: pData.name,
              titleEn: pData.name, // Can be refined by admin
              titleKh: `${pData.name} - នាំចូលពី Uniqlo Japan`,
              priceUsd: recommendedUsd,
              priceJpy: priceJpy,
              category: detectedCat,
              gender: detectedGender,
              badge: 'NEW',
              isUniqloSynced: true,
              lastSynced: new Date().toISOString(),
              images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
              colors: colors,
              sizes: sizes,
              skus: skus,
              description: pData.shortDescription || pData.longDescription || 'Authentic item imported directly from Uniqlo Japan official store.',
              material: pData.composition || '100% Quality Fabric'
            };

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'ok', product: formattedProduct }));
            return;
          }

          // 2. Sync Stock endpoint
          if (pathname === '/api/uniqlo/sync-stock') {
            const inputId = parsedUrl.searchParams.get('id');
            const productId = extractProductId(inputId);

            if (!productId) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing or invalid productId' }));
              return;
            }

            const stockUrl = `https://www.uniqlo.com/jp/api/commerce/v5/ja/products/${productId}/price-groups/00/stock`;
            const prodUrl = `https://www.uniqlo.com/jp/api/commerce/v5/ja/products/${productId}/price-groups/00`;

            const headers = {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
              'Accept': 'application/json'
            };

            const [stockRes, prodRes] = await Promise.all([
              fetch(stockUrl, { headers }).then(r => r.json()).catch(() => null),
              fetch(prodUrl, { headers }).then(r => r.json()).catch(() => null)
            ]);

            const sData = stockRes?.result || {};
            const pData = prodRes?.result || {};

            const skus = {};
            if (Array.isArray(pData.l2s)) {
              for (const l2 of pData.l2s) {
                const stockItem = sData[l2.l2Id] || {};
                const colorCode = l2.color?.displayCode || '00';
                const sizeName = l2.size?.name || 'M';
                const key = `${colorCode}_${sizeName}`;

                const qty = stockItem.quantity ?? (stockItem.statusCode === 'IN_STOCK' ? 50 : 0);
                const isAvailable = stockItem.statusCode === 'IN_STOCK' || stockItem.statusCode === 'LOW_STOCK' || qty > 0;

                skus[key] = {
                  l2Id: l2.l2Id,
                  colorCode,
                  sizeName,
                  statusCode: stockItem.statusCode || 'UNKNOWN',
                  statusLocalized: stockItem.statusLocalized || (isAvailable ? '在庫あり' : '在庫なし'),
                  quantity: qty,
                  inStock: isAvailable
                };
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              status: 'ok',
              productId,
              lastSynced: new Date().toISOString(),
              skus
            }));
            return;
          }

          next();
        } catch (err) {
          console.error('Uniqlo API Proxy error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), uniqloApiPlugin()],
})
