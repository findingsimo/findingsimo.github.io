// hearts.js - 30 unique pixel art heart card designs

const Hearts = (() => {
  const W = 540;
  const H = 960;
  const PIXEL_FONT = "'Press Start 2P', monospace";

  // 10x8 pixel heart shape
  const HEART = [
    [0,0,1,1,0,0,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
  ];

  function lighten(hex, amt) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgb(${Math.min(255,Math.round(r+(255-r)*amt))},${Math.min(255,Math.round(g+(255-g)*amt))},${Math.min(255,Math.round(b+(255-b)*amt))})`;
  }

  function drawPixelHeart(ctx, cx, cy, size, fill, opts) {
    const o = opts || {};
    const bs = Math.round(size / 6);
    const sx = Math.round(cx - 5 * bs);
    const sy = Math.round(cy - 4 * bs);
    const hl = o.highlight || (typeof fill === 'string' && fill[0] === '#' && fill.length === 7 ? lighten(fill, 0.3) : null);
    if (o.shadow) {
      const so = Math.max(4, Math.round(bs * 0.12));
      for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
        if (HEART[r][c]) { ctx.fillStyle = o.shadowColor || 'rgba(0,0,0,0.12)'; ctx.fillRect(sx+c*bs+so, sy+r*bs+so, bs, bs); }
      }
    }
    for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
      if (HEART[r][c]) {
        ctx.fillStyle = (hl && ((r===1&&c===2)||(r===2&&c===1))) ? hl : fill;
        ctx.fillRect(sx+c*bs, sy+r*bs, bs, bs);
      }
    }
  }

  function drawNumber(ctx, num, cx, cy, color, fontSize) {
    ctx.save();
    ctx.font = `${fontSize || 72}px ${PIXEL_FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color || '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.fillText(num.toString(), cx, cy);
    ctx.restore();
  }

  // Heart center Y and number Y constants
  const HCY = H * 0.5;
  const HNY = H * 0.48;

  // ===== CARD 1: Sunset pink-to-coral =====
  function card1(ctx, num) {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#FFB6C1'); grad.addColorStop(1, '#FF7F7F');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    drawPixelHeart(ctx, W/2, HCY, 240, '#E8536D');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 2: Peach-to-rose radial =====
  function card2(ctx, num) {
    const grad = ctx.createRadialGradient(W/2, H/2, 50, W/2, H/2, 450);
    grad.addColorStop(0, '#FFDAB9'); grad.addColorStop(1, '#E8536D');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    drawPixelHeart(ctx, W/2, HCY, 240, '#C2185B');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 3: Coral-to-gold diagonal =====
  function card3(ctx, num) {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#FF6F61'); grad.addColorStop(0.5, '#F4845F'); grad.addColorStop(1, '#F7B267');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    // Pixel art diamond scatter
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let i = 0; i < 25; i++) {
      const dx = ((i * 173 + 47) % (W - 40)) + 20;
      const dy = ((i * 211 + 83) % (H - 40)) + 20;
      const ds = 6 + (i % 4) * 2;
      ctx.save(); ctx.translate(dx, dy); ctx.rotate(Math.PI / 4);
      ctx.fillRect(-ds/2, -ds/2, ds, ds);
      ctx.restore();
    }
    drawPixelHeart(ctx, W/2, HCY, 240, '#C0392B', { shadow: true });
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 4: Lavender-to-pink =====
  function card4(ctx, num) {
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#E6BFFF'); grad.addColorStop(1, '#FFB6C1');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    drawPixelHeart(ctx, W/2, HCY, 240, '#D81B60');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 5: Amber-to-red sunset =====
  function card5(ctx, num) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#FFB347'); grad.addColorStop(0.5, '#FF6B6B'); grad.addColorStop(1, '#C0392B');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    drawPixelHeart(ctx, W/2, HCY, 240, '#DC143C');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 6: Rose-to-burgundy, gradient heart =====
  function card6(ctx, num) {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#F8BBD0'); bg.addColorStop(1, '#7B2D4A');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // Pixel art plus/cross scatter
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 3;
    for (let i = 0; i < 30; i++) {
      const px = ((i * 149 + 31) % (W - 20)) + 10;
      const py = ((i * 197 + 67) % (H - 20)) + 10;
      const ps = 4 + (i % 3) * 2;
      ctx.beginPath(); ctx.moveTo(px - ps, py); ctx.lineTo(px + ps, py); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py - ps); ctx.lineTo(px, py + ps); ctx.stroke();
    }
    const hg = ctx.createLinearGradient(W/2-120, H*0.33, W/2+120, H*0.67);
    hg.addColorStop(0, '#FF6B6B'); hg.addColorStop(1, '#8E0038');
    drawPixelHeart(ctx, W/2, HCY, 240, hg, { shadow: true });
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 7: Polka dots (gold on blush) =====
  function card7(ctx, num) {
    ctx.fillStyle = '#FFEEF0'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(247, 178, 103, 0.35)';
    for (let y = 20; y < H; y += 45)
      for (let x = (y % 90 === 20 ? 0 : 22); x < W; x += 45) {
        ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
      }
    drawPixelHeart(ctx, W/2, HCY, 240, '#F4845F');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 8: Diagonal stripes =====
  function card8(ctx, num) {
    ctx.fillStyle = '#FFF5EE'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255, 182, 193, 0.4)'; ctx.lineWidth = 12;
    for (let i = -H; i < W + H; i += 35) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H, H); ctx.stroke();
    }
    drawPixelHeart(ctx, W/2, HCY, 240, '#8E244D');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 9: Scattered mini pixel hearts =====
  function card9(ctx, num) {
    ctx.fillStyle = '#FFE4E8'; ctx.fillRect(0, 0, W, H);
    const colors = ['rgba(232,83,109,0.2)', 'rgba(244,132,95,0.2)', 'rgba(247,178,103,0.15)'];
    for (let i = 0; i < 60; i++) {
      const px = ((42 * (i + 1) * 7) % W);
      const py = ((42 * (i + 1) * 13) % H);
      const sz = 15 + ((42 * (i + 1)) % 20);
      drawPixelHeart(ctx, px, py, sz, colors[i % 3], { highlight: null });
    }
    drawPixelHeart(ctx, W/2, HCY, 240, '#E53935');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 10: Wavy lines =====
  function card10(ctx, num) {
    ctx.fillStyle = '#FFECD2'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(244, 132, 95, 0.25)'; ctx.lineWidth = 3;
    for (let y = 20; y < H; y += 30) {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 5) {
        const yy = y + Math.sin(x * 0.03 + y * 0.1) * 10;
        x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    drawPixelHeart(ctx, W/2, HCY, 240, '#CD5C5C');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 11: Confetti dots =====
  function card11(ctx, num) {
    ctx.fillStyle = '#FFF8F0'; ctx.fillRect(0, 0, W, H);
    const cc = ['#E8536D', '#F4845F', '#F7B267', '#C2185B', '#FF6F61', '#FFB347'];
    for (let i = 0; i < 120; i++) {
      ctx.fillStyle = cc[i % cc.length] + '55';
      ctx.beginPath(); ctx.arc(((i*137+50)%W), ((i*97+30)%H), 3+(i%5), 0, Math.PI*2); ctx.fill();
    }
    drawPixelHeart(ctx, W/2, HCY, 240, '#FF1493');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 12: Crosshatch =====
  function card12(ctx, num) {
    ctx.fillStyle = '#FFF0EB'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(232, 83, 109, 0.15)'; ctx.lineWidth = 2;
    for (let i = 0; i < W + H; i += 25) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(0, i); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W-i, 0); ctx.lineTo(W, i); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(247, 178, 103, 0.12)';
    for (let i = 0; i < W + H; i += 25) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(0, i); ctx.stroke();
    }
    drawPixelHeart(ctx, W/2, HCY, 240, '#B71C1C');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 13: Watercolor wash =====
  function card13(ctx, num) {
    ctx.fillStyle = '#FFF5F5'; ctx.fillRect(0, 0, W, H);
    const blobs = [
      { x:100, y:150, r:200, c:'rgba(255,182,193,0.3)' },
      { x:400, y:300, r:250, c:'rgba(244,132,95,0.2)' },
      { x:200, y:600, r:220, c:'rgba(232,83,109,0.15)' },
      { x:500, y:100, r:180, c:'rgba(247,178,103,0.2)' },
      { x:300, y:450, r:280, c:'rgba(255,160,180,0.2)' },
    ];
    for (const b of blobs) {
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, b.c); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    ctx.globalAlpha = 0.85;
    drawPixelHeart(ctx, W/2, HCY, 240, '#E8536D');
    ctx.globalAlpha = 1;
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 14: Speckled terrazzo =====
  function card14(ctx, num) {
    ctx.fillStyle = '#FFF0EB'; ctx.fillRect(0, 0, W, H);
    const sc = ['#E8536D', '#F4845F', '#F7B267', '#7B2D4A', '#C2185B'];
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = sc[i % sc.length] + '33';
      ctx.beginPath(); ctx.ellipse(((i*173+23)%W), ((i*211+47)%H), 4+(i%8), 2+(i%5), i*0.5, 0, Math.PI*2); ctx.fill();
    }
    drawPixelHeart(ctx, W/2, HCY, 240, '#E8536D');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 15: Bokeh circles =====
  function card15(ctx, num) {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#5C1A33'); bg.addColorStop(1, '#2C0E1A');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const bc = ['rgba(232,83,109,0.12)', 'rgba(247,178,103,0.1)', 'rgba(244,132,95,0.1)', 'rgba(255,255,255,0.06)'];
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = bc[i % bc.length];
      ctx.beginPath(); ctx.arc(((i*191+77)%W), ((i*127+33)%H), 20+(i%50), 0, Math.PI*2); ctx.fill();
    }
    drawPixelHeart(ctx, W/2, HCY, 240, 'rgba(232,83,109,0.6)', { highlight: null });
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 16: Starburst rays =====
  function card16(ctx, num) {
    ctx.fillStyle = '#FFF5E6'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(W/2, HCY);
    for (let i = 0; i < 24; i++) {
      ctx.rotate(Math.PI / 12);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(247,178,103,0.15)' : 'rgba(244,132,95,0.1)';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-40, -500); ctx.lineTo(40, -500); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    drawPixelHeart(ctx, W/2, HCY, 240, '#E8536D');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 17: Linen texture =====
  function card17(ctx, num) {
    ctx.fillStyle = '#FAF0E6'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(210, 180, 160, 0.2)'; ctx.lineWidth = 1;
    for (let y = 0; y < H; y += 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(210, 180, 160, 0.1)';
    for (let x = 0; x < W; x += 6) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    drawPixelHeart(ctx, W/2, HCY, 240, '#C0544E', { shadow: true });
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 18: Marble (rose/gold veins) =====
  function card18(ctx, num) {
    ctx.fillStyle = '#FFF0F0'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(232, 83, 109, 0.12)'; ctx.lineWidth = 2;
    for (let i = 0; i < 15; i++) {
      ctx.beginPath(); let x = (i*89)%W, y = 0; ctx.moveTo(x, y);
      for (let s = 0; s < 20; s++) { x += ((i*17+s*31)%80)-40; y += H/20; ctx.lineTo(x, y); }
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(247, 178, 103, 0.1)'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath(); let x = (i*131+50)%W, y = 0; ctx.moveTo(x, y);
      for (let s = 0; s < 20; s++) { x += ((i*23+s*41)%60)-30; y += H/20; ctx.lineTo(x, y); }
      ctx.stroke();
    }
    drawPixelHeart(ctx, W/2, HCY, 240, '#D44D6E');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 19: Color block (coral + burgundy) =====
  function card19(ctx, num) {
    ctx.fillStyle = '#F4845F'; ctx.fillRect(0, 0, W, H/2);
    ctx.fillStyle = '#7B2D4A'; ctx.fillRect(0, H/2, W, H/2);
    drawPixelHeart(ctx, W/2, HCY, 240, '#FFFFFF');
    drawNumber(ctx, num, W/2, HNY, '#E8536D');
  }

  // ===== CARD 20: Geometric triangles =====
  function card20(ctx, num) {
    const tc = ['#FFE0D0', '#FFD0C0', '#FFC0B0', '#FFB0A0', '#FFA090'];
    ctx.fillStyle = '#FFF0EB'; ctx.fillRect(0, 0, W, H);
    const ts = 60;
    for (let row = 0; row < H/ts+1; row++) for (let col = 0; col < W/ts+1; col++) {
      ctx.fillStyle = tc[(row+col) % tc.length] + 'AA';
      ctx.beginPath();
      const x = col*ts, y = row*ts;
      if ((row+col)%2===0) { ctx.moveTo(x,y); ctx.lineTo(x+ts,y); ctx.lineTo(x+ts/2,y+ts); }
      else { ctx.moveTo(x,y+ts); ctx.lineTo(x+ts,y+ts); ctx.lineTo(x+ts/2,y); }
      ctx.closePath(); ctx.fill();
    }
    drawPixelHeart(ctx, W/2, HCY, 240, '#E8536D');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 21: Concentric circles =====
  function card21(ctx, num) {
    ctx.fillStyle = '#FFF5F0'; ctx.fillRect(0, 0, W, H);
    const rc = ['#F7B267', '#F4845F', '#E8536D', '#C2185B', '#7B2D4A'];
    for (let i = 10; i > 0; i--) {
      ctx.fillStyle = rc[i % rc.length] + '22';
      ctx.beginPath(); ctx.arc(W/2, HCY, i*45, 0, Math.PI*2); ctx.fill();
    }
    drawPixelHeart(ctx, W/2, HCY, 240, '#B71C1C', { shadow: true });
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 22: Zigzag chevron =====
  function card22(ctx, num) {
    ctx.fillStyle = '#FFF5EE'; ctx.fillRect(0, 0, W, H);
    const cv = ['rgba(232,83,109,0.12)', 'rgba(247,178,103,0.12)'];
    const zh = 30, zw = 40;
    for (let row = 0; row < H/zh+1; row++) {
      ctx.fillStyle = cv[row%2]; ctx.beginPath();
      const by = row * zh;
      ctx.moveTo(0, by);
      for (let x = 0; x <= W; x += zw) ctx.lineTo(x, (x/zw)%2===0 ? by-zh/2 : by+zh/2);
      ctx.lineTo(W, by+zh);
      for (let x = W; x >= 0; x -= zw) ctx.lineTo(x, ((W-x)/zw)%2===0 ? by+zh+zh/2 : by+zh-zh/2);
      ctx.closePath(); ctx.fill();
    }
    drawPixelHeart(ctx, W/2, HCY, 240, '#E8536D');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 23: Grid squares (mosaic) =====
  function card23(ctx, num) {
    const mc = ['#FFE0D0', '#FFD5C5', '#FFCAB5', '#F8BBD0', '#FCE4EC', '#FFECD2'];
    const sq = 40;
    for (let y = 0; y < H; y += sq) for (let x = 0; x < W; x += sq) {
      ctx.fillStyle = mc[Math.floor(((x/sq)*7+(y/sq)*13) % mc.length)];
      ctx.fillRect(x, y, sq, sq);
    }
    drawPixelHeart(ctx, W/2, HCY, 240, '#E8536D', { shadow: true });
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 24: Abstract swirls =====
  function card24(ctx, num) {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#FFECD2'); grad.addColorStop(1, '#FCB69F');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.15;
    const sw = ['#E8536D', '#F4845F', '#C2185B'];
    for (let i = 0; i < 8; i++) {
      ctx.strokeStyle = sw[i%3]; ctx.lineWidth = 3; ctx.beginPath();
      const cx = ((i*157+100)%(W-100))+50, cy = ((i*211+80)%(H-100))+50;
      for (let t = 0; t < Math.PI*6; t += 0.1) {
        const r = t*8; t === 0 ? ctx.moveTo(cx+r*Math.cos(t), cy+r*Math.sin(t)) : ctx.lineTo(cx+r*Math.cos(t), cy+r*Math.sin(t));
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    drawPixelHeart(ctx, W/2, HCY, 240, '#E8536D');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 25: Starry (gold dots on deep red) =====
  function card25(ctx, num) {
    ctx.fillStyle = '#8B0000'; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(247,215,130,${0.3+(i%5)*0.14})`;
      ctx.beginPath(); ctx.arc(((i*163+29)%W), ((i*197+41)%H), 1+(i%3), 0, Math.PI*2); ctx.fill();
    }
    for (let i = 0; i < 15; i++) {
      const sx = ((i*211+73)%(W-40))+20, sy = ((i*157+51)%(H-40))+20;
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 8);
      g.addColorStop(0, 'rgba(255,230,150,0.6)'); g.addColorStop(1, 'rgba(255,230,150,0)');
      ctx.fillStyle = g; ctx.fillRect(sx-8, sy-8, 16, 16);
    }
    drawPixelHeart(ctx, W/2, HCY, 240, '#FF4444');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 26: Rainbow warm gradient with sparkles =====
  function card26(ctx, num) {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#FF6B6B'); grad.addColorStop(0.25, '#F4845F');
    grad.addColorStop(0.5, '#F7B267'); grad.addColorStop(0.75, '#FF8C94'); grad.addColorStop(1, '#E8536D');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.2+(i%4)*0.1})`;
      ctx.beginPath(); ctx.arc(((i*139+67)%W), ((i*181+23)%H), 2+(i%3), 0, Math.PI*2); ctx.fill();
    }
    const hg = ctx.createLinearGradient(W/2-120, H*0.33, W/2+120, H*0.67);
    hg.addColorStop(0, '#FFF'); hg.addColorStop(0.5, '#FFD1DC'); hg.addColorStop(1, '#FFF');
    ctx.globalAlpha = 0.85;
    drawPixelHeart(ctx, W/2, HCY, 240, hg);
    ctx.globalAlpha = 1;
    drawNumber(ctx, num, W/2, HNY, '#E8536D');
  }

  // ===== CARD 27: Tropical sunset sky =====
  function card27(ctx, num) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#FF512F'); grad.addColorStop(0.3, '#F09819');
    grad.addColorStop(0.6, '#FF6B6B'); grad.addColorStop(1, '#7B2D4A');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = '#FFF'; ctx.beginPath();
      ctx.ellipse(((i*173+50)%(W-200))+100, 100+i*120, 100+(i*20), 30, 0, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    drawPixelHeart(ctx, W/2, HCY, 240, '#3D0E1A', { highlight: null, shadow: true, shadowColor: 'rgba(0,0,0,0.25)' });
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 28: Flower petal scatter =====
  function card28(ctx, num) {
    ctx.fillStyle = '#FFF5F5'; ctx.fillRect(0, 0, W, H);
    const pc = ['rgba(232,83,109,0.15)', 'rgba(244,132,95,0.12)', 'rgba(255,182,193,0.2)', 'rgba(199,21,133,0.1)'];
    for (let i = 0; i < 40; i++) {
      ctx.save(); ctx.translate(((i*151+43)%W), ((i*199+71)%H)); ctx.rotate(i*1.3);
      ctx.fillStyle = pc[i % pc.length]; ctx.beginPath();
      ctx.ellipse(0, 0, 15+(i%15), (15+(i%15))*0.4, 0, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }
    drawPixelHeart(ctx, W/2, HCY, 240, '#E8536D');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 29: Aurora waves =====
  function card29(ctx, num) {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#2C0E1A'); bg.addColorStop(1, '#5C1A33');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const wc = ['rgba(232,83,109,0.15)', 'rgba(244,132,95,0.12)', 'rgba(247,178,103,0.1)', 'rgba(255,105,180,0.12)'];
    for (let w = 0; w < 4; w++) {
      ctx.fillStyle = wc[w]; ctx.beginPath(); ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 5) ctx.lineTo(x, H*0.3+w*80+Math.sin(x*0.008+w*2)*80+Math.sin(x*0.02+w)*30);
      ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
    }
    drawPixelHeart(ctx, W/2, HCY, 240, '#E8536D');
    drawNumber(ctx, num, W/2, HNY);
  }

  // ===== CARD 30: GOLD FINALE =====
  function card30(ctx, num) {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#BF953F'); bg.addColorStop(0.25, '#FCF6BA');
    bg.addColorStop(0.5, '#B38728'); bg.addColorStop(0.75, '#FBF5B7'); bg.addColorStop(1, '#AA771C');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.1+(i%5)*0.08})`;
      ctx.beginPath(); ctx.arc(((i*149+37)%W), ((i*193+59)%H), 1+(i%3), 0, Math.PI*2); ctx.fill();
    }
    // Pixel block crown above heart
    const crownY = H * 0.28;
    const crownX = W / 2;
    const cb = 10; // crown block size
    const crownGrid = [
      // 12 columns wide: 3 prongs with base band
      [1,0,0,0,1,0,0,1,0,0,0,1],
      [1,1,0,0,1,0,0,1,0,0,1,1],
      [1,1,0,1,1,0,0,1,1,0,1,1],
      [1,1,0,1,1,1,1,1,1,0,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
    ];
    const cw = crownGrid[0].length * cb;
    const ch = crownGrid.length * cb;
    const cx0 = crownX - cw / 2;
    const cy0 = crownY - ch / 2;
    crownGrid.forEach((row, ry) => {
      row.forEach((cell, rx) => {
        if (!cell) return;
        ctx.fillStyle = '#D4A843';
        ctx.fillRect(cx0 + rx * cb, cy0 + ry * cb, cb, cb);
        ctx.fillStyle = '#AA771C';
        ctx.fillRect(cx0 + rx * cb, cy0 + ry * cb + cb - 2, cb, 2); // bottom edge
      });
    });
    // Jewel dots on the base band (pixel squares)
    const jewelY = cy0 + 4 * cb + 2;
    [cx0 + 2*cb, cx0 + 5.5*cb - cb/2, cx0 + 9*cb].forEach(jx => {
      ctx.fillStyle = '#E8536D';
      ctx.fillRect(jx + 1, jewelY + 1, cb - 2, cb - 2);
    });
    // Golden pixel heart
    const hg = ctx.createLinearGradient(W/2-130, H*0.33, W/2+130, H*0.68);
    hg.addColorStop(0, '#D4A843'); hg.addColorStop(0.3, '#F5D98C');
    hg.addColorStop(0.5, '#D4A843'); hg.addColorStop(0.7, '#F5D98C'); hg.addColorStop(1, '#AA771C');
    drawPixelHeart(ctx, W/2, HCY, 250, hg, { shadow: true, shadowColor: 'rgba(80, 50, 0, 0.35)' });
    // Special "30" typography
    ctx.save();
    ctx.font = `80px ${PIXEL_FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(120, 80, 0, 0.3)'; ctx.fillText('30', W/2+4, HNY+4);
    const tg = ctx.createLinearGradient(W/2-50, HNY-20, W/2+50, HNY+20);
    tg.addColorStop(0, '#FFF8DC'); tg.addColorStop(0.5, '#FFFFFF'); tg.addColorStop(1, '#FFF8DC');
    ctx.fillStyle = tg; ctx.fillText('30', W/2, HNY);
    ctx.restore();
    // "Champion" text
    ctx.save();
    ctx.font = `20px ${PIXEL_FONT}`; ctx.textAlign = 'center';
    ctx.fillStyle = '#5A3E00'; ctx.fillText('* CHAMPION *', W/2, H * 0.76);
    ctx.restore();
  }

  const cardFunctions = [
    null,
    card1, card2, card3, card4, card5, card6,
    card7, card8, card9, card10, card11, card12,
    card13, card14, card15, card16, card17, card18,
    card19, card20, card21, card22, card23, card24,
    card25, card26, card27, card28, card29, card30
  ];

  function renderHeart(canvas, heartNumber) {
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    const num = Math.max(1, Math.min(30, heartNumber));
    if (cardFunctions[num]) cardFunctions[num](ctx, num);
  }

  function renderFailCard(canvas, message) {
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#FFECD2'); grad.addColorStop(1, '#FCB69F');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    // Faded pixel heart
    ctx.globalAlpha = 0.12;
    drawPixelHeart(ctx, W/2, HCY, 200, '#E8536D', { highlight: null });
    ctx.globalAlpha = 1;
    // Message text (word wrap)
    ctx.save();
    ctx.font = `20px ${PIXEL_FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#7B2D4A';
    const words = message.split(' ');
    const lines = []; let cur = '';
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w;
      if (ctx.measureText(test).width > W - 80) { lines.push(cur); cur = w; } else { cur = test; }
    }
    if (cur) lines.push(cur);
    const lh = 36;
    const startY = HCY - ((lines.length - 1) * lh) / 2;
    lines.forEach((line, i) => ctx.fillText(line, W/2, startY + i * lh));
    ctx.restore();
    ctx.font = `14px ${PIXEL_FONT}`; ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(123, 45, 74, 0.4)';
    ctx.fillText("Tomorrow is a new day", W/2, H - 50);
  }

  return { renderHeart, renderFailCard };
})();
